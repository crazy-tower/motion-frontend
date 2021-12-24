import type { NextPage } from "next";
import { useRef } from "react";

const RemoteVideo: NextPage = () => {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  return <video ref={remoteVideoRef} autoPlay playsInline></video>;
};

export default RemoteVideo;
