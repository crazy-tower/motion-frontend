import { NextPage } from 'next';
import { useEffect, useRef } from 'react';

type Props = {
  stream: MediaStream;
};

const RemoteVideo: NextPage<Props> = ({ stream }) => {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
    }
  });

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{
          width: '600px',
          height: '500px',
          objectFit: 'cover',
          borderRadius: '8px',
        }}
      ></video>
    </div>
  );
};

export default RemoteVideo;
