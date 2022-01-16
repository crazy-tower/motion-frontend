import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { NextPage } from 'next';
import { RefObject, useState } from 'react';
import Text from './Text';
import { startScreenSharing } from '../../../utils/webRTC';

type Props = {
  roomID: string;
  screenVideoRef: RefObject<HTMLVideoElement>;
};

const DesktopButton: NextPage<Props> = ({ roomID, screenVideoRef }) => {
  const [screenSharingEnabled, setScreenSharingEnabled] =
    useState<boolean>(true);

  return (
    <button
      onClick={async () => {
        if (screenVideoRef.current) {
          startScreenSharing(screenVideoRef.current);
          setScreenSharingEnabled(!screenSharingEnabled);
        }
      }}
    >
      {screenSharingEnabled ? (
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
          <FontAwesomeIcon icon={faDesktop} size="lg" />
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
            background: 'rgba(0, 0, 0, 0.56)',
            color: '#f26b4d',
          }}
        >
          <FontAwesomeIcon icon={faDesktop} size="lg" />
        </div>
      )}
      <Text>Share</Text>
    </button>
  );
};

export default DesktopButton;
