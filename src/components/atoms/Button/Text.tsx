import type { NextPage } from 'next';
import styled from 'styled-components';

const Wrapper = styled.div`
  font-size: 12px;
  line-height: 14px;
  font-weight: 700;
  color: #fff;
  width: 100%;
  text-align: center;
  user-select: none;
  text-shadow: 0px 1px 4px rgba(0, 0, 0, 0, 16);
  margin-top: 7px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 48px;
`;

type Props = {
  children: string;
};

const Text: NextPage<Props> = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default Text;
