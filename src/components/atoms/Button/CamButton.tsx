import type { NextPage } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';
import { handleToggleCam } from '../../../utils/webRTC';
import { useState } from 'react';

const CamButton: NextPage = () => {
  const [camEnabled, setCamEnabled] = useState<boolean>(true);

  return (
    <button onClick={() => setCamEnabled(handleToggleCam())}>
      {camEnabled ? (
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
          <FontAwesomeIcon icon={faVideo} />
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
          <FontAwesomeIcon icon={faVideoSlash} />
        </div>
      )}
    </button>
  );
};

export default CamButton;
