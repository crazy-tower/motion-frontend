import { Dispatch, SetStateAction } from 'react';
import { io, Socket } from 'socket.io-client';

// Type

// https://socket.io/docs/v4/typescript/
type ServerToClientEvents = {
  'all other users': (otherUsers: string[]) => void;
  'connection offer': (event: PeerConnectionOffer) => void;
  'connection answer': (event: PeerConnectionAnswerEvent) => void;
  'ice-candidate': (event: ReceiveIceCandidateEvent) => void;
  'user disconnected': (userID: string) => void;
  'server is full': () => void;
  'someone is laughing': () => void;
};

type ClientToServerEvents = {
  'user joined room': (roomID: string) => void;
  'peer connection request': (payload: PeerConnectionRequest) => void;
  'connection answer': (payload: PeerConnectionAnswerPayload) => void;
  'ice-candidate': (payload: IceCandidatePayload) => void;
  'someone is laughing': (roomID: string) => void;
  disconnecting: () => void;
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

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
let peers = new Map<string, RTCPeerConnection>();
let userStream: MediaStream;
let remoteUserStreams = new Map<string, MediaStream>();
let setRemoteUserStreams: Dispatch<SetStateAction<MediaStream[]>>;

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
  console.log('Add track from userID:' + userID);
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
  if (videoTrack.enabled) {
    videoTrack.enabled = false;
  } else {
    videoTrack.enabled = true;
  }
  return videoTrack.enabled;
};

/**
 * マイクのオン/オフを切り替える
 * @return {boolean} result マイクがオンか
 */
const handleToggleAudio = (): boolean => {
  const audioTrack = userStream.getAudioTracks()[0];
  if (audioTrack.enabled) {
    audioTrack.enabled = false;
  } else {
    audioTrack.enabled = true;
  }
  return audioTrack.enabled;
};

const hangUp = () => {
  // stop cam
  userStream.getTracks().forEach((track) => {
    track.stop();
  });

  peers.clear();
  remoteUserStreams.clear();

  socket.disconnect();
};

const someoneLaugh = (roomID: string) => {
  socket.emit('someone is laughing', roomID);
};

const setupRTC = async (
  roomID: string,
  localVideo: HTMLVideoElement,
  setRemoteStreams: Dispatch<SetStateAction<MediaStream[]>>,
  someoneLaughFunc: () => void
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

  socket.on('someone is laughing', someoneLaughFunc);
};

const startScreenSharing = async (screenVideo: HTMLVideoElement) => {
  const screenStream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
  });
  screenVideo.srcObject = screenStream;
};

export {
  setupRTC,
  startScreenSharing,
  handleToggleCam,
  handleToggleAudio,
  hangUp,
  someoneLaugh,
};
