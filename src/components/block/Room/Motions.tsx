import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSmileBeam,
  faAngry,
  faSadTear,
  faSurprise,
  faThumbsUp,
  faHandPeace,
} from '@fortawesome/free-solid-svg-icons';
import { motionInit } from '../../../utils/webRTC';

type Props = {};

const Motions: NextPage<Props> = () => {
  const [motions, setMotions] = useState<string[]>([]);

  useEffect(() => {
    motionInit(setMotions);
  }, []);

  return (
    <>
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          columnGap: '12px',
          rowGap: '12px',
        }}
      >
        {motions.map((motion, i) => {
          if (motion == 'happy') {
            return <FontAwesomeIcon key={i} icon={faSmileBeam} size="lg" />;
          } else if (motion == 'angry') {
            return <FontAwesomeIcon key={i} icon={faAngry} size="lg" />;
          } else if (motion == 'sad') {
            return <FontAwesomeIcon key={i} icon={faSadTear} size="lg" />;
          } else if (motion == 'surprised') {
            return <FontAwesomeIcon key={i} icon={faSurprise} size="lg" />;
          } else if (motion == 'victory') {
            return <FontAwesomeIcon key={i} icon={faHandPeace} size="lg" />;
          } else if (motion == 'thumbs_up') {
            return <FontAwesomeIcon key={i} icon={faThumbsUp} size="lg" />;
          } else {
            return;
          }
        })}
      </div>
    </>
  );
};

export default Motions;
