import { NextPage } from 'next';
import { RefObject, useRef } from 'react';
// import { runHandpose } from '../../../utils/runHandpose';

type Props = {
  localVideoRef: RefObject<HTMLVideoElement>;
  faceCanvasRef: RefObject<HTMLCanvasElement>;
  faceMotionEnabled: boolean;
};

const LocalVideo: NextPage<Props> = ({
  localVideoRef,
  faceCanvasRef,
  faceMotionEnabled,
}) => {
  const handCanvasRef = useRef<HTMLCanvasElement>(null);

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
      {faceMotionEnabled ? (
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
      ) : null}
    </div>
  );
};

export default LocalVideo;
