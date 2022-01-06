import type { NextPage } from 'next';
import { useEffect, useRef } from 'react';
import { runHandpose } from '../../utils/runHandpose';
import { runFaceDetect } from '../../utils/runFaceDetect';
import { setupRTC } from '../../utils/webRTC';
import OperationButtons from './OperationButtons';

type Props = {
  room: string;
};

const Room: NextPage<Props> = ({ room }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localHandCanvasRef = useRef<HTMLCanvasElement>(null);
  const localFaceCanvasRef = useRef<HTMLCanvasElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteHandCanvasRef = useRef<HTMLCanvasElement>(null);
  const remoteFaceCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!localVideoRef.current || !remoteVideoRef.current) return;

    setupRTC(room, localVideoRef.current, remoteVideoRef.current);
  }, [room]);

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
            onLoadedData={() => {
              runHandpose(localVideoRef, localHandCanvasRef);
              runFaceDetect(localVideoRef, localFaceCanvasRef);
            }}
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
            ref={localHandCanvasRef}
            style={{
              position: 'absolute',
              marginLeft: 'auto',
              marginRight: 'auto',
              left: 0,
              right: 0,
              width: 600,
            }}
          />
          <canvas
            ref={localFaceCanvasRef}
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
            onLoadedData={() => {
              runHandpose(remoteVideoRef, remoteHandCanvasRef);
              runFaceDetect(remoteVideoRef, remoteFaceCanvasRef);
            }}
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
            ref={remoteHandCanvasRef}
            style={{
              position: 'absolute',
              marginLeft: 'auto',
              marginRight: 'auto',
              left: 0,
              right: 0,
              width: 600,
            }}
          />
          <canvas
            ref={remoteFaceCanvasRef}
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
