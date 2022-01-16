import { NextPage } from 'next';
import { RefObject } from 'react';

type Props = {
  localVideoRef: RefObject<HTMLVideoElement>;
  faceCanvasRef: RefObject<HTMLCanvasElement>;
  faceMotionEnabled: boolean;
  handCanvasRef: RefObject<HTMLCanvasElement>;
  handMotionEnabled: boolean;
};

const LocalVideo: NextPage<Props> = ({
  localVideoRef,
  faceCanvasRef,
  faceMotionEnabled,
  handCanvasRef,
  handMotionEnabled,
}) => {
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
      ></video>
      {handMotionEnabled ? (
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
      ) : null}
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
