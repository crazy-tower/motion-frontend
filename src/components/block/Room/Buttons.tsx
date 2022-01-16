import type { NextPage } from 'next';
import type { RefObject, Dispatch, SetStateAction } from 'react';
import type { FaceDetect } from '../../../utils/runFaceDetect';
import type { HandDetect } from '../../../utils/runHandpose';
import {
  CamButton,
  AudioButton,
  DesktopButton,
  ChatButton,
  LeaveButton,
  PeopleButton,
  FaceMotionButton,
  HandMotionButton,
} from '../../atoms/Button/index';

type Props = {
  screenVideoRef: RefObject<HTMLVideoElement>;
  faceDetectObject: FaceDetect;
  faceMotionEnabled: boolean;
  setFaceMotionEnabled: Dispatch<SetStateAction<boolean>>;
  handDetectObject: HandDetect;
  handMotionEnabled: boolean;
  setHandMotionEnabled: Dispatch<SetStateAction<boolean>>;
};

const Buttons: NextPage<Props> = ({
  screenVideoRef,
  faceDetectObject,
  faceMotionEnabled,
  setFaceMotionEnabled,
  handDetectObject,
  handMotionEnabled,
  setHandMotionEnabled,
}) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexFlow: 'row nowrap',
        margin: '1rem auto',
      }}
    >
      <div
        style={{
          margin: '0 auto',
          padding: '4px',
          display: 'grid',
          gridGap: '12px',
          gridAutoFlow: 'column',
          overflow: 'scroll',
        }}
      >
        <CamButton />
        <AudioButton />
        <DesktopButton screenVideoRef={screenVideoRef} />
        <ChatButton />
        <PeopleButton />
        <FaceMotionButton
          faceDetectObject={faceDetectObject}
          faceMotionEnabled={faceMotionEnabled}
          setFaceMotionEnabled={setFaceMotionEnabled}
        />
        <HandMotionButton
          handDetectObject={handDetectObject}
          handMotionEnabled={handMotionEnabled}
          setHandMotionEnabled={setHandMotionEnabled}
        />
        <LeaveButton />
      </div>
    </div>
  );
};

export default Buttons;
