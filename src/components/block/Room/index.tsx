import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { setupRTC } from '../../../utils/webRTC';
import Buttons from './Buttons';
import LocalVideo from './LocalVideo';
import RemoteVideo from './RemoteVideo';
import { FaceDetect } from '../../../utils/runFaceDetect';
import { HandDetect } from '../../../utils/runHandpose';
import Motions from './Motions';

type Props = {
  room: string;
};

const Room: NextPage<Props> = ({ room }) => {
  // Local Video
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Remote Video
  const [remoteStreams, setRemoteStreams] = useState<Array<MediaStream>>([]);

  // Motion
  const faceCanvasRef = useRef<HTMLCanvasElement>(null);
  const handCanvasRef = useRef<HTMLCanvasElement>(null);
  const faceDetectObject = new FaceDetect(localVideoRef, faceCanvasRef, room);
  const [faceMotionEnabled, setFaceMotionEnabled] = useState<boolean>(false);
  const handDetectObject = new HandDetect(localVideoRef, handCanvasRef, room);
  const [handMotionEnabled, setHandMotionEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (!localVideoRef.current) return;
    setupRTC(room, localVideoRef.current, setRemoteStreams);
  }, [room]);

  return (
    <>
      <Motions />
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
        <LocalVideo
          localVideoRef={localVideoRef}
          faceCanvasRef={faceCanvasRef}
          faceMotionEnabled={faceMotionEnabled}
          handCanvasRef={handCanvasRef}
          handMotionEnabled={handMotionEnabled}
        />
        {remoteStreams.map((stream, i) => {
          return <RemoteVideo key={i} stream={stream} />;
        })}
      </div>
      <Buttons
        roomID={room}
        localVideoRef={localVideoRef}
        faceDetectObject={faceDetectObject}
        faceMotionEnabled={faceMotionEnabled}
        setFaceMotionEnabled={setFaceMotionEnabled}
        handDetectObject={handDetectObject}
        handMotionEnabled={handMotionEnabled}
        setHandMotionEnabled={setHandMotionEnabled}
      />
    </>
  );
};

export default Room;
