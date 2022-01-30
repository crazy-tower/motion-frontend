import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { setupRTC } from '../../../utils/webRTC';
import Buttons from './Buttons';
import LocalVideo from './LocalVideo';
import RemoteVideo from './RemoteVideo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSmileBeam,
  faAngry,
  faSadTear,
  faSurprise,
} from '@fortawesome/free-solid-svg-icons';
import { FaceDetect } from '../../../utils/runFaceDetect';
import { HandDetect } from '../../../utils/runHandpose';
import { motionInit } from '../../../utils/webRTC';

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
  const [motions, setMotions] = useState<string[]>([]);
  const faceDetectObject = new FaceDetect(localVideoRef, faceCanvasRef, room);
  const [faceMotionEnabled, setFaceMotionEnabled] = useState<boolean>(false);
  const handDetectObject = new HandDetect(localVideoRef, handCanvasRef);
  const [handMotionEnabled, setHandMotionEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (!localVideoRef.current) return;
    motionInit(setMotions);
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
        {motions.map((motion, i) => {
          if (motion == 'happy') {
            return <FontAwesomeIcon key={i} icon={faSmileBeam} size="lg" />;
          } else if (motion == 'angry') {
            return <FontAwesomeIcon key={i} icon={faAngry} size="lg" />;
          } else if (motion == 'sad') {
            return <FontAwesomeIcon key={i} icon={faSadTear} size="lg" />;
          } else if (motion == 'surprised') {
            return <FontAwesomeIcon key={i} icon={faSurprise} size="lg" />;
          } else {
            return;
          }
        })}
      </div>
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
