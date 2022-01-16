import type { NextPage } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmileWink, faSlash } from '@fortawesome/free-solid-svg-icons';
import { Dispatch, SetStateAction } from 'react';
import type { FaceDetect } from '../../../utils/runFaceDetect';
import Text from './Text';

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
          <FontAwesomeIcon icon={faSmileWink} size="lg" />
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
          className="fa-layers fa-fw"
        >
          <FontAwesomeIcon icon={faSmileWink} size="lg" />
          <FontAwesomeIcon icon={faSlash} size="lg" />
        </div>
      )}
      <Text>FaceM</Text>
    </button>
  );
};

export default FaceMotionButton;
