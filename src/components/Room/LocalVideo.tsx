import { NextPage } from 'next';
import { RefObject, useRef } from 'react';
// import { runFaceDetect } from '../../utils/runFaceDetect';
// import { runHandpose } from '../../utils/runHandpose';

type Props = {
  localVideoRef: RefObject<HTMLVideoElement>;
};

const LocalVideo: NextPage<Props> = ({ localVideoRef }) => {
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
        // onLoadedData={() => {
        //   runHandpose(localVideoRef, handCanvasRef);
        //   runFaceDetect(localVideoRef, faceCanvasRef);
        // }}
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
