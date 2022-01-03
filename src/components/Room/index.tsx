import type { NextPage } from 'next';
import { useEffect, useRef } from 'react';
import { runHandpose } from '../../utils/runHandpose';
import { setupRTC } from '../../utils/webRTC';
import OperationButtons from './operationButtons';

const Room: NextPage = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

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
            onLoadedData={() => runHandpose(localVideoRef, canvasRef)}
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
            ref={canvasRef}
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
