import { NextPage } from 'next';
import { useEffect, useRef } from 'react';
// import { runFaceDetect } from '../../utils/runFaceDetect';
// import { runHandpose } from '../../utils/runHandpose';

type Props = {
  stream: MediaStream;
};

const RemoteVideo: NextPage<Props> = ({ stream }) => {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const handCanvasRef = useRef<HTMLCanvasElement>(null);
  const faceCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
    }
  });

  return (
    <div
      style={{
        position: 'relative',
        width: '500px',
        height: '400px',
      }}
    >
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        // onLoadedData={() => {
        //   runHandpose(remoteVideoRef, handCanvasRef);
        //   runFaceDetect(remoteVideoRef, faceCanvasRef);
        // }}
        style={{}}
      ></video>

      <canvas
        ref={handCanvasRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <canvas
        ref={faceCanvasRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default RemoteVideo;
