import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { NextPage } from 'next';

const PeopleButton: NextPage = () => {
  return (
    <button className="bg-emerald-900 hover:bg-cyan-900 text-slate-50 font-bold py-2 px-4 rounded-full mx-2">
      <FontAwesomeIcon icon={faUserFriends} />
      &nbsp; People
    </button>
  );
};

export default PeopleButton;
