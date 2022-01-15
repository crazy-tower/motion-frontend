import type { NextPage } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone,
  faMicrophoneSlash,
} from '@fortawesome/free-solid-svg-icons';
import { handleToggleAudio } from '../../../utils/webRTC';
import { useState } from 'react';

const AudioButton: NextPage = () => {
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  return (
    <button onClick={() => setAudioEnabled(handleToggleAudio())}>
      {audioEnabled ? (
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

export default AudioButton;
