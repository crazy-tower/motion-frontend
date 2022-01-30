import { Dispatch, SetStateAction } from 'react';
import { io, Socket } from 'socket.io-client';

/* Type */

// https://socket.io/docs/v4/typescript/
type ServerToClientEvents = {
  'all other users': (otherUsers: string[]) => void;
  'connection offer': (event: PeerConnectionOffer) => void;
  'connection answer': (event: PeerConnectionAnswerEvent) => void;
  'ice-candidate': (event: ReceiveIceCandidateEvent) => void;
  'user disconnected': (userID: string) => void;
  'server is full': () => void;
  'chat message': (message: string) => void;
  'send motion': (motion: string) => void;
};

type ClientToServerEvents = {
  'user joined room': (roomID: string) => void;
  'peer connection request': (payload: PeerConnectionRequest) => void;
  'connection answer': (payload: PeerConnectionAnswerPayload) => void;
  'ice-candidate': (payload: IceCandidatePayload) => void;
  'someone is laughing': (roomID: string) => void;
  disconnecting: () => void;
  'chat message': (roomID: string, message: string) => void;
  'send motion': (roomID: string, motion: string) => void;
};

type PeerConnectionRequest = {
  sdp: RTCSessionDescription;
  userIDToCall: string;
};

type PeerConnectionOffer = {
  sdp: RTCSessionDescription;
  callerID: string;
};

type PeerConnectionAnswerPayload = {
  sdp: RTCSessionDescription;
  userIDToAnswerTo: string;
};

type PeerConnectionAnswerEvent = {
  sdp: RTCSessionDescription;
  answererID: string;
};

type IceCandidatePayload = {
  target: string;
  candidate: RTCIceCandidate;
};

type ReceiveIceCandidateEvent = {
  candidate: RTCIceCandidate;
  from: string;
};

/* Global Variables */

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
let peers = new Map<string, RTCPeerConnection>();
let userStream: MediaStream;
let remoteUserStreams = new Map<string, MediaStream>();
let setRemoteUserStreams: Dispatch<SetStateAction<MediaStream[]>>;
let screenStream: MediaStream;
let chatMessages: string[] = [];
let setChatMessages: Dispatch<SetStateAction<string[]>>;
let userMotions = new Map<number, string>();
let setUserMotions: Dispatch<SetStateAction<string[]>>;

/* Functions */

/**
 * 部屋に入っている他のユーザにPeerConnectionを繋ぐ
 * @param {string[]} otherUsers 他のユーザ
 * @param {MediaStream} localStream 自分のストリーム情報
 */
const callOtherUsers = (otherUsers: string[], localStream: MediaStream) => {
  otherUsers.forEach((userIDToCall) => {
    const peer = createPeer(userIDToCall);
    peers.set(userIDToCall, peer);
    localStream.getTracks().forEach((track) => {
      peer.addTrack(track, localStream);
    });
  });
};

/**
 * 渡されたユーザとのPeerConnectionを繋ぐ
 * @param {string} userIDToCall 電話を繋ぐユーザID
 * @return {RTCPeerConnection} ピアコネクション
 */
const createPeer = (userIDToCall: string): RTCPeerConnection => {
  const peer = new RTCPeerConnection({
    iceServers: [
      {
        urls: 'stun:stun.stunprotocol.org',
      },
    ],
  });
  peer.onnegotiationneeded = () =>
    userIDToCall ? handleNegotiationNeededEvent(peer, userIDToCall) : null;
  peer.onicecandidate = handleICECandidateEvent;
  peer.ontrack = (event) => handleTrackEvent(event, userIDToCall);
  return peer;
};

/**
 * Peerを確立するための交渉をする
 * @param {RTCPeerConnection} peer ピアコネクション
 * @param {string} userIDToCall 電話を繋ぐユーザID
 */
const handleNegotiationNeededEvent = async (
  peer: RTCPeerConnection,
  userIDToCall: string
) => {
  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);
  if (!peer.localDescription) {
    console.error('Cannot find local description in peer.');
    return;
  }
  const payload = {
    sdp: peer.localDescription,
    userIDToCall,
  };

  socket.emit('peer connection request', payload);
};

/**
 * 他のユーザからPeerConnectionのofferを受け取り、相手にanswerする
 * @param {PeerConnectionOffer}  offer コネクションオファー
 * @param {MediaStream} localStream ローカルストリーム
 */
const handleReceiveOffer = async (
  { sdp, callerID }: PeerConnectionOffer,
  localStream: MediaStream
) => {
  const peer = createPeer(callerID);
  peers.set(callerID, peer);
  const desc = new RTCSessionDescription(sdp);
  await peer.setRemoteDescription(desc);

  localStream.getTracks().forEach((track) => {
    peer.addTrack(track, localStream);
  });

  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);

  if (!peer.localDescription) {
    console.error('Cannnot find local description in peer.');
    return;
  }

  const payload = {
    userIDToAnswerTo: callerID,
    sdp: peer.localDescription,
  };

  socket.emit('connection answer', payload);
};

/**
 * 送ったofferに返答が来たら、descriptionを登録する
 * @param {PeerConnectionAnswerEvent}  offer コネクションオファー
 */
const handleAnswer = ({ sdp, answererID }: PeerConnectionAnswerEvent) => {
  const desc = new RTCSessionDescription(sdp);
  const peer = peers.get(answererID);

  if (!peer) {
    console.error('Cannot find peer. answererID:' + answererID);
    return;
  }

  peer.setRemoteDescription(desc).catch((e) => console.error(e));
};

/**
 * 候補があった場合、Peerで繋がっている全ユーザに候補を知らせる
 * @param {RTCPeerConnectionIceEvent} event 候補イベント
 */
const handleICECandidateEvent = (event: RTCPeerConnectionIceEvent) => {
  peers.forEach((_, userID) => {
    if (!event.candidate) return;
    const payload = {
      target: userID,
      candidate: event.candidate,
    };

    socket.emit('ice-candidate', payload);
  });
};

/**
 * 他のユーザの候補を受け取った場合、peerに候補を登録する
 * @param {ReceiveIceCandidateEvent} event
 * @param {RTCIceCandidate} event.candidate 通信先のユーザの候補
 * @param {string} event.from 通信先のユーザID
 */
const handleReceiveIceCandidate = ({
  candidate,
  from,
}: ReceiveIceCandidateEvent) => {
  const inComingCandidate = new RTCIceCandidate(candidate);
  const peer = peers.get(from);

  if (!peer) {
    console.error('Cannot find peer. userID:' + from);
    return;
  }

  peer.addIceCandidate(inComingCandidate);
};

/**
 * Peer先のユーザがtrackを追加した時、リモートビデオに表示させる
 * @param {RTCTrackEvent} event trackが追加されたイベント
 * @param {string} userID Peer先のユーザID
 */
const handleTrackEvent = (event: RTCTrackEvent, userID: string) => {
  remoteUserStreams.set(userID, event.streams[0]);
  setRemoteUserStreams(Array.from(remoteUserStreams.values()));
};

/**
 * ユーザからの接続が切れた時、そのユーザのビデオを削除する
 * @param {string} userID ユーザID
 */
const handleDisconnect = (userID: string) => {
  const peer = peers.get(userID);
  if (!peer) {
    console.error('Cannot find peer. userID:' + userID);
    return;
  }
  peer.close();
  peers.delete(userID);
  remoteUserStreams.delete(userID);
  setRemoteUserStreams(Array.from(remoteUserStreams.values()));
};

/**
 * カメラのオン/オフを切り替える
 * @return {boolean} result カメラがオンか
 */
const handleToggleCam = (): boolean => {
  const videoTrack = userStream.getVideoTracks()[0];
  videoTrack.enabled = !videoTrack.enabled;
  return videoTrack.enabled;
};

/**
 * マイクのオン/オフを切り替える
 * @return {boolean} result マイクがオンか
 */
const handleToggleAudio = (): boolean => {
  const audioTrack = userStream.getAudioTracks()[0];
  audioTrack.enabled = !audioTrack.enabled;
  return audioTrack.enabled;
};

/**
 * 通話を切る
 */
const hangUp = () => {
  // stop cam
  userStream.getTracks().forEach((track) => {
    track.stop();
  });

  peers.clear();
  remoteUserStreams.clear();

  socket.disconnect();
};

/**
 * スクリーンシェアを始める
 * @param {HTMLVideoElement} localVideo ローカルビデオ
 * @param {Dispatch<SetStateAction<boolean>>} setScreenShared スクリーンシェアをしているか管理しているステートフック
 */
const startScreenSharing = async (
  localVideo: HTMLVideoElement,
  setScreenShared: Dispatch<SetStateAction<boolean>>
) => {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
  });
  screenStream = stream;
  localVideo.srcObject = stream;

  const screenTrack = stream.getTracks()[0];
  peers.forEach((peer) => {
    const senders = peer.getSenders();
    const userTrack = senders.find((sender) => sender.track?.kind === 'video');
    if (userTrack) {
      userTrack.replaceTrack(screenTrack);
    }
  });

  // UIで画面キャプチャをやめた場合
  screenTrack.onended = () => {
    stopScreenSharing(localVideo, setScreenShared);
  };
};

/**
 * スクリーンシェアを止める
 * @param {HTMLVideoElement} localVideo ローカルビデオ
 * @param {Dispatch<SetStateAction<boolean>>} setScreenShared スクリーンシェアをしているか管理しているステートフック
 */
const stopScreenSharing = (
  localVideo: HTMLVideoElement,
  setScreenShared: Dispatch<SetStateAction<boolean>>
) => {
  // リモートの画面をユーザストリームに変える
  peers.forEach((peer) => {
    const senders = peer.getSenders();
    const userTrack = senders.find((sender) => sender.track?.kind === 'video');
    if (userTrack) {
      userTrack.replaceTrack(userStream.getVideoTracks()[0]);
    }
  });

  localVideo.srcObject = userStream;

  // スクリーンキャプチャを止める
  screenStream.getTracks().forEach((track) => track.stop());

  setScreenShared(false);
};

const setupRTC = async (
  roomID: string,
  localVideo: HTMLVideoElement,
  setRemoteStreams: Dispatch<SetStateAction<MediaStream[]>>
) => {
  setRemoteUserStreams = setRemoteStreams;

  // Strat to get user media
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  userStream = localStream;
  localVideo.srcObject = localStream;

  socket = io(process.env.NEXT_PUBLIC_SIGNALING_SERVER).connect();
  // user joined room
  socket.emit('user joined room', roomID);

  // Set up socket
  socket.on('all other users', (otherUsers) =>
    callOtherUsers(otherUsers, localStream)
  );

  socket.on('connection offer', (payload) =>
    handleReceiveOffer(payload, localStream)
  );

  socket.on('connection answer', handleAnswer);

  socket.on('ice-candidate', handleReceiveIceCandidate);

  socket.on('user disconnected', (userID) => handleDisconnect(userID));

  socket.on('server is full', () => alert('chat is full'));

  socket.on('send motion', handleUserMotion);

  socket.on('chat message', handleChatMessage);
};

/* Chat */

const chatInit = (setMessages: Dispatch<SetStateAction<string[]>>) => {
  setChatMessages = setMessages;
};

const chatMessage = (roomID: string, message: string) => {
  socket.emit('chat message', roomID, message);
};

const handleChatMessage = (message: string) => {
  chatMessages = chatMessages.concat(message);
  setChatMessages(chatMessages);
};
/* User Motion */

const motionInit = (setMotions: Dispatch<SetStateAction<string[]>>) => {
  setUserMotions = setMotions;
};

const sendMotion = (roomID: string, motion: string) => {
  socket.emit('send motion', roomID, motion);
};

const handleUserMotion = (motion: string) => {
  let count = userMotions.size;
  userMotions.set(count, motion);
  setUserMotions(Array.from(userMotions.values()));
  setTimeout(() => {
    userMotions.delete(count);
    setUserMotions(Array.from(userMotions.values()));
  }, 3000);
};

export {
  setupRTC,
  startScreenSharing,
  stopScreenSharing,
  handleToggleCam,
  handleToggleAudio,
  hangUp,
  chatInit,
  chatMessage,
  motionInit,
  sendMotion,
};
