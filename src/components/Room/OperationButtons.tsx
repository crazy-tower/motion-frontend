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
} from '@fortawesome/free-solid-svg-icons';
// Over sized icons on page refresh
// FYI: https://github.com/FortAwesome/react-fontawesome/issues/134
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

const OperationButtons: NextPage = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="flex-auto">
        <button className="bg-emerald-900 hover:bg-cyan-900 text-slate-50 font-bold py-2 px-4 rounded-full mx-2">
          <FontAwesomeIcon icon={faVideo} />
          &nbsp; Cam
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
