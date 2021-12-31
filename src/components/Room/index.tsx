import type { NextPage } from 'next';
import { useEffect, useRef } from 'react';
import { runHandpose } from '../../utils/runHandpose';
import { setupRTC } from '../../utils/webRTC';

const Room: NextPage = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!localVideoRef.current || !remoteVideoRef.current) return;

    setupRTC(localVideoRef.current, remoteVideoRef.current);
  }, []);

  return (
    <>
      <div
        style={{
          position: 'relative',
          left: 0,
          right: 0,
          width: 600,
          height: 480,
        }}
      >
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          onLoadedData={() => runHandpose(localVideoRef, canvasRef)}
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            width: 600,
            height: 480,
          }}
        ></video>
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            width: 600,
            height: 480,
          }}
        />
      </div>
      <video ref={remoteVideoRef} autoPlay playsInline width={600}></video>
    </>
  );
};

export default Room;
