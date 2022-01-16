import type { NextPage } from 'next';
import type { RefObject } from 'react';
import {
  CamButton,
  AudioButton,
  DesktopButton,
  ChatButton,
  LeaveButton,
  PeopleButton,
} from '../../atoms/Button/index';

type Props = {
  screenVideoRef: RefObject<HTMLVideoElement>;
};

const Buttons: NextPage<Props> = ({ screenVideoRef }) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexFlow: 'row nowrap',
        margin: '1rem auto',
      }}
    >
      <div
        style={{
          margin: '0 auto',
          padding: '4px',
          display: 'grid',
          gridGap: '12px',
          gridAutoFlow: 'column',
          overflow: 'scroll',
        }}
      >
        <CamButton />
        <AudioButton />
        <DesktopButton screenVideoRef={screenVideoRef} />
        <ChatButton />
        <PeopleButton />
        <LeaveButton />
      </div>
    </div>
  );
};

export default Buttons;
