import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { NextPage } from 'next';
import Text from './Text';

const PeopleButton: NextPage = () => {
  return (
    <button>
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
        <FontAwesomeIcon icon={faUserFriends} size="lg" />
      </div>
      <Text>People</Text>
    </button>
  );
};

export default PeopleButton;
