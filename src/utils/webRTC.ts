import { io, Socket } from 'socket.io-client';

// https://socket.io/docs/v4/typescript/
type ServerToClientEvents = {
  created: (room: string) => void;
  full: (room: string) => void;
  join: (room: string) => void;
  joined: (room: string) => void;
  log: (array: string[]) => void;
  message: (
    message: string | RTCSessionDescriptionInit | RTCIceCandidateMessage
  ) => void;
};

type ClientToServerEvents = {
  'create or join': (room: string) => void;
  message: (
    message: string | RTCSessionDescriptionInit | RTCIceCandidateMessage
  ) => void;
};

type RTCIceCandidateMessage = {
  type: 'candidate';
  label: RTCIceCandidate['sdpMLineIndex'];
  id: RTCIceCandidate['sdpMid'];
  candidate: RTCIceCandidate['candidate'];
};

// type PeerConnectionConfig = {
//   iceServers: Array<{
//     urls: string;
//     credential?: string;
//   }>;
// };

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
let isChannelReady = false;
let isInitiator = false; // Roomが存在するか
let isStarted = false;
let localStream: MediaStream;
let remoteStream: MediaStream;
let pc: RTCPeerConnection | null;
// let pcConfig: PeerConnectionConfig = {
//   iceServers: [
//     {
//       urls: 'stun:stun.l.google.com:19302',
//     },
//   ],
// };

const sendMessage = (
  message: string | RTCSessionDescriptionInit | RTCIceCandidateMessage
) => {
  console.log('Client sending message: ', message);
  socket.emit('message', message);
};

const maybeStart = (remoteVideo: HTMLVideoElement) => {
  console.log('>>>>>>> maybeStart() ', isStarted, localStream, isChannelReady);
  if (!isStarted && typeof localStream !== 'undefined' && isChannelReady) {
    console.log('>>>>>> creating peer connection');
    createPeerConnection(remoteVideo);
    localStream.getTracks().forEach((track) => {
      if (pc === null) {
        console.error('Failed to addTrack to PeerConnection. pc is null.');
        return;
      }
      pc.addTrack(track, localStream);
    });
    isStarted = true;
    console.log('isInitiator', isInitiator);
    if (isInitiator) {
      // doCall
      console.log('Sending offer to peer');
      if (pc === null) {
        console.error('Failed to addTrack to PeerConnection. pc is null.');
        return;
      }
      pc.createOffer()
        .then(setLocalAndSendMessage)
        .catch((event) => console.log('createOffer() error: ', event));
    }
  }
};

const createPeerConnection = (remoteVideo: HTMLVideoElement) => {
  try {
    pc = new RTCPeerConnection();
    pc.onicecandidate = (event) => {
      console.log('icecandidate event: ', event);
      if (event.candidate) {
        sendMessage({
          type: 'candidate',
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate,
        });
      } else {
        console.log('End of candidates.');
      }
    };
    pc.ontrack = (event) => {
      console.log('Remote stream added.');
      remoteStream = event.streams[0];
      remoteStream.onremovetrack = (event) =>
        console.log('Remote stream removed. Event: ', event);
      remoteVideo.srcObject = remoteStream;
    };
    console.log('Created RTCPeerConnnection');
    return;
  } catch (e) {
    console.log('Failed to create PeerConnection, exception: ' + e);
    alert('Cannot create RTCPeerConnection object.');
    return;
  }
};

const setLocalAndSendMessage = (
  sessionDescription: RTCSessionDescriptionInit
) => {
  if (pc === null) {
    console.error('Failed to addTrack to PeerConnection. pc is null.');
    return;
  }
  pc.setLocalDescription(sessionDescription);
  console.log('setLocalAndSendMessage sending message', sessionDescription);
  sendMessage(sessionDescription);
};

// const requestTurn = (turnURL: string) => {
//   var turnExists = false;
//   for (var i in pcConfig.iceServers) {
//     if (pcConfig.iceServers[i].urls.substr(0, 5) === 'turn:') {
//       turnExists = true;
//       break;
//     }
//   }
//   if (!turnExists) {
//     console.log('Getting TURN server from ', turnURL);
//     // No TURN server. Get one from computeengineondemand.appspot.com:
//     var xhr = new XMLHttpRequest();
//     xhr.onreadystatechange = function () {
//       if (xhr.readyState === 4 && xhr.status === 200) {
//         const turnServer = JSON.parse(xhr.responseText);
//         console.log('Got TURN server: ', turnServer);
//         pcConfig.iceServers.push({
//           urls: 'turn:' + turnServer.username + '@' + turnServer.turn,
//           credential: turnServer.password,
//         });
//       }
//     };
//     xhr.open('GET', turnURL, true);
//     xhr.send();
//   }
// };

// const hangup = () => {
//   console.log('Hanging up.');
//   stop();
//   sendMessage('bye');
// };

const handleRemoteHangup = () => {
  console.log('Session terminated.');
  stop();
  isInitiator = false;
};

const stop = () => {
  isStarted = false;
  if (pc === null) {
    console.error('Failed to pc.stop(). pc is null.');
    return;
  }
  pc.close();
  pc = null;
};

const setupRTC = (
  room: string,
  localVideo: HTMLVideoElement,
  remoteVideo: HTMLVideoElement
) => {
  // Set up socket
  socket = io(process.env.NEXT_PUBLIC_SIGNALING_SERVER).connect();
  socket.emit('create or join', room);

  socket.on('created', (room) => {
    console.log('Created room ' + room);
    isInitiator = true;
  });

  socket.on('full', (room) => {
    console.log('Room ' + room + ' is full');
  });

  socket.on('join', function (room) {
    console.log('Another peer made a request to join room ' + room);
    console.log('This peer is the initiator of room ' + room + '!');
    isChannelReady = true;
  });

  socket.on('joined', function (room) {
    console.log('joined: ' + room);
    isChannelReady = true;
  });

  // Serverのログを出力
  socket.on('log', function (array) {
    console.log.apply(console, array);
  });

  // This client receives a message
  socket.on('message', function (message) {
    console.log('Client received message:', message);
    if (typeof message === 'string') {
      if (message === 'got user media') {
        maybeStart(remoteVideo);
      } else if (message === 'bye' && isStarted) {
        handleRemoteHangup();
      }
    } else if ('type' in message) {
      if (message.type === 'offer') {
        if (!isInitiator && !isStarted) {
          maybeStart(remoteVideo);
        }
        if (pc === null) {
          console.error('Failed to setRemoteDescription. pc is null.');
          return;
        }
        pc.setRemoteDescription(new RTCSessionDescription(message));
        // doAnswer()
        console.log('Sending answer to peer.');
        pc.createAnswer()
          .then(setLocalAndSendMessage)
          .catch((error) => {
            console.log(
              'Failed to create session description: ' + error.toString()
            );
          });
      } else if (message.type === 'answer' && isStarted) {
        if (pc === null) {
          console.error('Failed to pc.setRemoteDescription(). pc is null.');
          return;
        }
        pc.setRemoteDescription(new RTCSessionDescription(message));
      } else if (message.type === 'candidate' && isStarted) {
        if (pc === null) {
          console.error('Failed to addIceCandidate(). pc is null.');
          return;
        }
        var candidate = new RTCIceCandidate({
          sdpMLineIndex: message.label,
          candidate: message.candidate,
        });
        pc.addIceCandidate(candidate);
      }
    }
  });

  // Start local video stream
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .then((stream) => {
      console.log('Adding local stream.');
      localStream = stream;
      localVideo.srcObject = stream;
      sendMessage('got user media');
      if (isInitiator) {
        maybeStart(remoteVideo);
      }
    })
    .catch((e) => {
      alert('getUserMedia() error: ' + e.name);
    });

  // Set up TURN server
  // if (location.hostname !== 'localhost') {
  //   requestTurn(
  //     'https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913'
  //   );
  // }

  // Must first bye
  window.onbeforeunload = function () {
    sendMessage('bye');
  };
};

export { setupRTC };
