import type { NextPage } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComment,
  faDesktop,
  faMicrophone,
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
import { handleToggleCam } from '../../utils/webRTC';
import { useState } from 'react';
config.autoAddCss = false;

const OperationButtons: NextPage = () => {
  const [camEnabled, setCamEnabled] = useState<boolean>(true);

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="flex-auto">
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
        <button className="bg-emerald-900 hover:bg-cyan-900 text-slate-50 font-bold py-2 px-4 rounded-full mx-2">
          <FontAwesomeIcon icon={faMicrophone} />
          &nbsp; Mic
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
