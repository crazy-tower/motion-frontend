import type { NextPage } from 'next';
import { useEffect, useRef } from 'react';
import { runHandpose } from '../../utils/runHandpose';
import { setupRTC } from '../../utils/webRTC';
import OperationButtons from './OperationButtons';

const Room: NextPage = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localCanvasRef = useRef<HTMLCanvasElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!localVideoRef.current || !remoteVideoRef.current) return;

    setupRTC(localVideoRef.current, remoteVideoRef.current);
  }, []);

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            position: 'relative',
            left: 0,
            right: 50,
            width: 600,
            height: 500,
            display: 'inline-block',
          }}
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            onLoadedData={() => runHandpose(localVideoRef, localCanvasRef)}
            style={{
              position: 'absolute',
              marginLeft: 'auto',
              marginRight: 'auto',
              left: 0,
              right: 0,
              width: 600,
            }}
          ></video>
          <canvas
            ref={localCanvasRef}
            style={{
              position: 'absolute',
              marginLeft: 'auto',
              marginRight: 'auto',
              left: 0,
              right: 0,
              width: 600,
            }}
          />
        </div>

        <div
          style={{
            position: 'relative',
            left: 50,
            right: 0,
            width: 600,
            height: 500,
            display: 'inline-block',
          }}
        >
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            onLoadedData={() => runHandpose(remoteVideoRef, remoteCanvasRef)}
            style={{
              position: 'absolute',
              marginLeft: 'auto',
              marginRight: 'auto',
              left: 0,
              right: 0,
              width: 600,
            }}
          ></video>

          <canvas
            ref={remoteCanvasRef}
            style={{
              position: 'absolute',
              marginLeft: 'auto',
              marginRight: 'auto',
              left: 0,
              right: 0,
              width: 600,
            }}
          />
        </div>
      </div>
      <OperationButtons />
    </div>
  );
};

export default Room;
