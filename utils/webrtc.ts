// 通話を開始
// 自分のカメラを起動(startAction)できなければ通話は開始できない
const callAction = (
  localStream: MediaStream,
  remoteVideo: HTMLVideoElement
) => {
  let localPeerConnection: RTCPeerConnection,
    remotePeerConnection: RTCPeerConnection;
  // 1. Create peer connections and add behavior
  // const servers = null;
  localPeerConnection = new RTCPeerConnection();
  localPeerConnection.addEventListener("icecandidate", (event) =>
    handleConnection(localPeerConnection, remotePeerConnection, event)
  );
  localPeerConnection.addEventListener(
    "iceconnectionstatechange",
    (event: Event) => {
      console.log("ICE state change event: " + event);
    }
  );

  remotePeerConnection = new RTCPeerConnection();
  remotePeerConnection.addEventListener("icecandidate", (event) =>
    handleConnection(localPeerConnection, remotePeerConnection, event)
  );
  remotePeerConnection.addEventListener(
    "iceconnectionstatechange",
    (event: Event) => {
      console.log("ICE state change event: " + event);
    }
  );
  remotePeerConnection.addEventListener("track", (event: RTCTrackEvent) => {
    remoteVideo.srcObject = event.streams[0];
  });

  // 2. Add local stream to connections and create offer to connect
  localStream.getTracks().forEach((track) => {
    localPeerConnection.addTrack(track, localStream);
  });
  localPeerConnection
    .createOffer({
      offerToReceiveVideo: true,
    })
    .then((description) =>
      createdOffer(localPeerConnection, remotePeerConnection, description)
    );
};

// 相手から候補メッセージを受け取った場合、候補をリモートピアのdescriptionに追加
const handleConnection = (
  localPeerConnection: RTCPeerConnection,
  remotePeerConnection: RTCPeerConnection,
  event: RTCPeerConnectionIceEvent
) => {
  const peerConnection = event.target;
  const iceCandidate = event.candidate;

  if (iceCandidate) {
    const newIceCandidate = new RTCIceCandidate(iceCandidate);
    const otherPeer = getOtherPeer(
      localPeerConnection,
      remotePeerConnection,
      peerConnection
    );

    otherPeer
      .addIceCandidate(newIceCandidate)
      .then(() => {
        console.log(`addIceCandidate success.`);
      })
      .catch((error) => {
        console.error(`failed to add ICE Candidate:` + error.toString());
      });
  }
};

// 解像度やコーデック機能などのビデオメディア情報をローカルおよびリモートで交換する
const createdOffer = (
  localPeerConnection: RTCPeerConnection,
  remotePeerConnection: RTCPeerConnection,
  description: RTCSessionDescriptionInit
) => {
  // 自分はdescriptionをローカルにセットする
  localPeerConnection
    .setLocalDescription(description)
    .then(() => console.log("setLocalDescription success."))
    .catch((error) =>
      console.error(`failed to setLocalDescription` + error.toString())
    );
  // 相手は送られたdescriptionをリモートのdescriptionとしてセットする
  remotePeerConnection
    .setRemoteDescription(description)
    .then(() => console.log("setRemoteDescription success."))
    .catch((error) =>
      console.error(`failed to setRemoteDescription` + error.toString())
    );
  // リモートのオファーにアンサーする
  remotePeerConnection
    .createAnswer()
    .then((description) =>
      createdAnswer(localPeerConnection, remotePeerConnection, description)
    )
    .catch((error) =>
      console.error(`failed to createdAnswer` + error.toString())
    );
};

// リモートから送られてきたビデオメディア情報のオファーに応答する
const createdAnswer = (
  localPeerConnection: RTCPeerConnection,
  remotePeerConnection: RTCPeerConnection,
  description: RTCSessionDescriptionInit
) => {
  remotePeerConnection
    .setLocalDescription(description)
    .then(() => console.log("setLocalDescription success."))
    .catch((error) =>
      console.error(`failed to setLocalDescription` + error.toString())
    );
  localPeerConnection
    .setRemoteDescription(description)
    .then(() => {
      console.log("setRemoteDescription success.");
    })
    .catch((error) =>
      console.error(`failed to setRemoteDescription` + error.toString())
    );
};

const getOtherPeer = (
  localPeerConnection: RTCPeerConnection,
  remotePeerConnection: RTCPeerConnection,
  peerConnection: EventTarget | null
): RTCPeerConnection => {
  return peerConnection === localPeerConnection
    ? remotePeerConnection
    : localPeerConnection;
};

export { callAction };
