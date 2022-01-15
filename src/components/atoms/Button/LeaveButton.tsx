import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { NextPage } from 'next';
import Link from 'next/link';
import { hangUp } from '../../../utils/webRTC';

const LeaveButton: NextPage = () => {
  return (
    <Link href="/room" passHref>
      <a onClick={() => hangUp()}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50px',
            height: '50px',
            borderRadius: '10px',
            background: 'rgba(0, 0, 0, 0.56)',
            color: '#f26b4d',
          }}
        >
          <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
        </div>
      </a>
    </Link>
  );
};

export default LeaveButton;
