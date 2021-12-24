import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { callAction } from "../../utils/webrtc";
import LocalVideo from "./LocalVideo";

const Room: NextPage = () => {
  const [localStream, setLocalStream] = useState<MediaStream>();

  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!localStream || !remoteVideoRef.current) return;

    callAction(localStream, remoteVideoRef.current);
  }, [localStream]);

  return (
    <>
      <LocalVideo setLocalStream={setLocalStream} />
      <video ref={remoteVideoRef} autoPlay playsInline width={600}></video>
    </>
  );
};

export default Room;
