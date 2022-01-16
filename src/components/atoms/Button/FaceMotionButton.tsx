import type { NextPage } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone,
  faMicrophoneSlash,
} from '@fortawesome/free-solid-svg-icons';
import { Dispatch, SetStateAction } from 'react';
import type { FaceDetect } from '../../../utils/runFaceDetect';

type Props = {
  faceDetectObject: FaceDetect;
  faceMotionEnabled: boolean;
  setFaceMotionEnabled: Dispatch<SetStateAction<boolean>>;
};

const FaceMotionButton: NextPage<Props> = ({
  faceDetectObject,
  faceMotionEnabled,
  setFaceMotionEnabled,
}) => {
  return (
    <button
      onClick={() => {
        faceDetectObject.handleToggleFaceMotion(faceMotionEnabled);
        setFaceMotionEnabled(!faceMotionEnabled);
      }}
    >
      {faceMotionEnabled ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50px',
            height: '50px',
            borderRadius: '10px',
            background: 'rgba(0, 0, 0, 0.56)',
            color: 'white',
          }}
        >
          <FontAwesomeIcon icon={faMicrophone} size="lg" />
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50px',
            height: '50px',
            borderRadius: '10px',
            background: '#f26b4d',
            color: 'white',
          }}
        >
          <FontAwesomeIcon icon={faMicrophoneSlash} />
        </div>
      )}
    </button>
  );
};

export default FaceMotionButton;
