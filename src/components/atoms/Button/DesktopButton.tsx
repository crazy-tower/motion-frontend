import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { NextPage } from 'next';
import { RefObject, useState } from 'react';

type Props = {
  screenVideoRef: RefObject<HTMLVideoElement>;
};

const DesktopButton: NextPage<Props> = ({ screenVideoRef }) => {
  const [screenSharingEnabled, setScreenSharingEnabled] =
    useState<boolean>(true);

  return (
    <button
      onClick={async () => {
        navigator.mediaDevices
          .getDisplayMedia({
            video: true,
          })
          .then((stream) => {
            if (!screenVideoRef.current) return;
            screenVideoRef.current.srcObject = stream;
          });
        setScreenSharingEnabled(!screenSharingEnabled);
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
          <FontAwesomeIcon icon={faDesktop} />
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
          <FontAwesomeIcon icon={faDesktop} />
        </div>
      )}
    </button>
  );
};

export default DesktopButton;
