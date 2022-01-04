import type { NextPage } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faComment,
  faDesktop,
  faMicrophone,
  faRecordVinyl,
  faSignOutAlt,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';

const OperationButtons: NextPage = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="flex-auto">
        <button className="bg-emerald-900 hover:bg-cyan-900 text-slate-50 font-bold py-2 px-4 rounded-full mx-2">
          <FontAwesomeIcon icon={faCamera} />
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
