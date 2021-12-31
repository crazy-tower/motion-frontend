import type { NextPage } from 'next';
import { useEffect, useRef } from 'react';
import { setupRTC } from '../../utils/webrtc';

const Room: NextPage = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current === null || remoteVideoRef.current === null) {
      return;
    }
    setupRTC(localVideoRef.current, remoteVideoRef.current);
  }, []);

  return (
    <>
      <video ref={localVideoRef} autoPlay playsInline width={600}></video>
      <video ref={remoteVideoRef} autoPlay playsInline width={600}></video>
    </>
  );
};

export default Room;
