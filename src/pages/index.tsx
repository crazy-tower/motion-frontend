import type { NextPage } from 'next';
import Head from 'next/head';
import Signin from '../components/block/Entrance/signin';
import styled from 'styled-components';
import { Heading } from '@chakra-ui/react';

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgPink};
  height: 100vh;
  padding: 4rem 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Motion</title>
      </Head>

      <Wrapper>
        <Heading as="h1" size="3xl" color="black.100" marginY="3">
          Welcome to Motion!
        </Heading>
        <Signin />
      </Wrapper>
    </>
  );
};

export default Page;
