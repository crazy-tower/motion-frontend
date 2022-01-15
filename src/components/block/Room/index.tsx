import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { setupRTC } from '../../../utils/webRTC';
import Buttons from './Buttons';
import LocalVideo from './LocalVideo';
import RemoteVideo from './RemoteVideo';

type Props = {
  room: string;
};

const Room: NextPage<Props> = ({ room }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [remoteStreams, setRemoteStreams] = useState<Array<MediaStream>>([]);
  const screenVideoRef = useRef<HTMLVideoElement>(null);

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
          columnGap: '12px',
          rowGap: '12px',
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
      <Buttons screenVideoRef={screenVideoRef} />
    </>
  );
};

export default Room;
