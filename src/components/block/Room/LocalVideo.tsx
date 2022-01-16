import { NextPage } from 'next';
import { RefObject, useRef } from 'react';
import { runFaceDetect } from '../../../utils/runFaceDetect';
// import { runHandpose } from '../../../utils/runHandpose';

type Props = {
  localVideoRef: RefObject<HTMLVideoElement>;
  room: string;
};

const LocalVideo: NextPage<Props> = ({ localVideoRef, room }) => {
  const handCanvasRef = useRef<HTMLCanvasElement>(null);
  const faceCanvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: '600px',
          height: '500px',
          objectFit: 'cover',
          borderRadius: '8px',
        }}
        onLoadedData={() => {
          // runHandpose(localVideoRef, handCanvasRef);
          runFaceDetect(localVideoRef, faceCanvasRef, room);
        }}
      ></video>
      <canvas
        ref={handCanvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
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

export default LocalVideo;
