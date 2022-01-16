import type { NextPage } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPeace, faSlash } from '@fortawesome/free-solid-svg-icons';
import { Dispatch, SetStateAction } from 'react';
import type { HandDetect } from '../../../utils/runHandpose';

type Props = {
  handDetectObject: HandDetect;
  handMotionEnabled: boolean;
  setHandMotionEnabled: Dispatch<SetStateAction<boolean>>;
};

const HandMotionButton: NextPage<Props> = ({
  handDetectObject,
  handMotionEnabled,
  setHandMotionEnabled,
}) => {
  return (
    <button
      onClick={() => {
        handDetectObject.handleToggleHandMotion(handMotionEnabled);
        setHandMotionEnabled(!handMotionEnabled);
      }}
    >
      {handMotionEnabled ? (
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
          <FontAwesomeIcon icon={faHandPeace} size="lg" />
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
          <FontAwesomeIcon icon={faHandPeace} size="lg" />
          <FontAwesomeIcon icon={faSlash} size="lg" />
        </div>
      )}
    </button>
  );
};

export default HandMotionButton;
