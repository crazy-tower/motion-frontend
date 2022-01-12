import type { NextPage } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComment,
  faDesktop,
  faMicrophone,
  faMicrophoneSlash,
  faRecordVinyl,
  faSignOutAlt,
  faUserFriends,
  faVideo,
  faVideoSlash,
} from '@fortawesome/free-solid-svg-icons';
// Over sized icons on page refresh
// FYI: https://github.com/FortAwesome/react-fontawesome/issues/134
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { handleToggleAudio, handleToggleCam } from '../../utils/webRTC';
import { useState } from 'react';
config.autoAddCss = false;

const OperationButtons: NextPage = () => {
  const [camEnabled, setCamEnabled] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'row nowrap',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          margin: '0 auto',
          padding: '4px',
          display: 'grid',
          gridGap: '12px',
          gridAutoFlow: 'column',
        }}
      >
        <button
          onClick={() => {
            const enabled = handleToggleCam();
            setCamEnabled(enabled);
          }}
        >
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
        <button
          onClick={() => {
            const enabled = handleToggleAudio();
            setAudioEnabled(enabled);
          }}
        >
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
              <FontAwesomeIcon icon={faMicrophone} />
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
        <button className="bg-emerald-900 hover:bg-cyan-900 text-slate-50 font-bold py-2 px-4 rounded-full mx-2">
          <FontAwesomeIcon icon={faDesktop} />
          &nbsp; Share
        </button>
        <button className="bg-emerald-900 hover:bg-cyan-900 text-slate-50 font-bold py-2 px-4 rounded-full mx-2">
          <FontAwesomeIcon icon={faRecordVinyl} />
          &nbsp; Record
        </button>
        <button className="bg-emerald-900 hover:bg-cyan-900 text-slate-50 font-bold py-2 px-4 rounded-full mx-2">
          <FontAwesomeIcon icon={faComment} />
          &nbsp; Chat
        </button>
        <button className="bg-emerald-900 hover:bg-cyan-900 text-slate-50 font-bold py-2 px-4 rounded-full mx-2">
          <FontAwesomeIcon icon={faUserFriends} />
          &nbsp; People
        </button>
        <button className="bg-emerald-900 hover:bg-cyan-900 text-slate-50 font-bold py-2 px-4 rounded-full mx-2">
          <FontAwesomeIcon icon={faSignOutAlt} />
          &nbsp; Leave
        </button>
      </div>
    </div>
  );
};

export default OperationButtons;
