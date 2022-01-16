import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { setupRTC } from '../../../utils/webRTC';
import Buttons from './Buttons';
import LocalVideo from './LocalVideo';
import RemoteVideo from './RemoteVideo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmileBeam } from '@fortawesome/free-solid-svg-icons';
import { FaceDetect } from '../../../utils/runFaceDetect';
import { HandDetect } from '../../../utils/runHandpose';

type Props = {
  room: string;
};

const Room: NextPage<Props> = ({ room }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const faceCanvasRef = useRef<HTMLCanvasElement>(null);
  const handCanvasRef = useRef<HTMLCanvasElement>(null);
  const [remoteStreams, setRemoteStreams] = useState<Array<MediaStream>>([]);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const [happyEffect, setHappyEffect] = useState<Boolean>(false);
  const faceDetectObject = new FaceDetect(localVideoRef, faceCanvasRef, room);
  const [faceMotionEnabled, setFaceMotionEnabled] = useState<boolean>(false);
  const handDetectObject = new HandDetect(localVideoRef, handCanvasRef);
  const [handMotionEnabled, setHandMotionEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (!localVideoRef.current) return;

    setupRTC(room, localVideoRef.current, setRemoteStreams, () => {
      setHappyEffect(true);
      setTimeout(() => {
        setHappyEffect(false);
      }, 3000);
    });
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
      {happyEffect && <FontAwesomeIcon icon={faSmileBeam} />}
      <Buttons
        screenVideoRef={screenVideoRef}
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
