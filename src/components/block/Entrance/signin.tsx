import type { NextPage } from 'next';
import React from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';
import { Button, Heading } from '@chakra-ui/react';
import styled from 'styled-components';

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

const Signin: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  if (session) {
    router.push('/room');
  }
  return (
    <>
      <Wrapper>
        <Heading as="h2" size="xl" color="black.100" marginY="3">
          Sign in
        </Heading>
        <Button
          colorScheme="blue"
          marginY={1}
          onClick={() => signIn('google')}
          width={270}
        >
          Sign in with Google
        </Button>
        <Button
          colorScheme="green"
          marginY={1}
          onClick={() => signIn('line')}
          width={270}
        >
          Sign in with Line
        </Button>
      </Wrapper>
    </>
  );
};
export default Signin;
