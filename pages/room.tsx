import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import LocalVideo from "../components/local-video";

function handleConnection(
  localPeerConnection: RTCPeerConnection,
  remotePeerConnection: RTCPeerConnection,
  event: RTCPeerConnectionIceEvent
) {
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
}

function createdOffer(
  localPeerConnection: RTCPeerConnection,
  remotePeerConnection: RTCPeerConnection,
  description: RTCSessionDescriptionInit
) {
  localPeerConnection
    .setLocalDescription(description)
    .then(() => console.log("setLocalDescription success."))
    .catch((error) =>
      console.error(`failed to setLocalDescription` + error.toString())
    );
  remotePeerConnection
    .setRemoteDescription(description)
    .then(() => console.log("setRemoteDescription success."))
    .catch((error) =>
      console.error(`failed to setRemoteDescription` + error.toString())
    );
  remotePeerConnection
    .createAnswer()
    .then((description) =>
      createdAnswer(localPeerConnection, remotePeerConnection, description)
    )
    .catch((error) =>
      console.error(`failed to createdAnswer` + error.toString())
    );
}

function createdAnswer(
  localPeerConnection: RTCPeerConnection,
  remotePeerConnection: RTCPeerConnection,
  description: RTCSessionDescriptionInit
) {
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
}

function getOtherPeer(
  localPeerConnection: RTCPeerConnection,
  remotePeerConnection: RTCPeerConnection,
  peerConnection: EventTarget | null
): RTCPeerConnection {
  return peerConnection === localPeerConnection
    ? remotePeerConnection
    : localPeerConnection;
}

const Room: NextPage = () => {
  const [localStream, setLocalStream] = useState<MediaStream>();

  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!localStream) return;

    // Create peer connections and add behavior
    // const servers = null;
    const localPeerConnection = new RTCPeerConnection();
    localPeerConnection.addEventListener("icecandidate", (event) =>
      handleConnection(localPeerConnection, remotePeerConnection, event)
    );
    localPeerConnection.addEventListener(
      "iceconnectionstatechange",
      (event: Event) => {
        console.log("ICE state change event: " + event);
      }
    );

    const remotePeerConnection = new RTCPeerConnection();
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
      if (remoteVideoRef.current) {
        const mediaStream = event.streams[0];
        remoteVideoRef.current.srcObject = mediaStream;
      }
    });

    // Add local stream to connections and create offer to connect
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
  });

  return (
    <>
      <Head>
        <title>Room</title>
      </Head>
      <h1>Realtime communication with WebRTC</h1>
      <LocalVideo setLocalStream={setLocalStream} />
      <video width={600} ref={remoteVideoRef} autoPlay playsInline></video>
    </>
  );
};

export default Room;
