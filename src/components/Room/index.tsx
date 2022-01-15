import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { setupRTC } from '../../utils/webRTC';
import OperationButtons from './OperationButtons';
import LocalVideo from './LocalVideo';
import RemoteVideo from './RemoteVideo';

type Props = {
  room: string;
};

const Room: NextPage<Props> = ({ room }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [remoteStreams, setRemoteStreams] = useState<Array<MediaStream>>([]);

  useEffect(() => {
    if (!localVideoRef.current) return;

    setupRTC(room, localVideoRef.current, setRemoteStreams);
  }, [room]);

  return (
    <>
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '500px',
            height: '400px',
          }}
        >
          <LocalVideo localVideoRef={localVideoRef} />
        </div>
        {remoteStreams.map((stream, i) => {
          return <RemoteVideo key={i} stream={stream} />;
        })}
      </div>
      <OperationButtons />
    </>
  );
};

export default Room;
