import type { NextPage } from 'next';
import React, { useState } from 'react';
import useUser from '../../../lib/useUser';
import Link from 'next/link';
import fetchJson, { FetchError } from '../../../lib/fetchJson';
import styled from 'styled-components';
import { Button, Heading, Input, Text } from '@chakra-ui/react';

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
  const { mutateUser } = useUser({
    redirectTo: '/room',
    redirectIfFound: true,
  });
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [working, setWorking] = useState<boolean>(false);

  if (!mutateUser) {
    return <h1>リダイレクトします</h1>;
  }

  const handleSubmit = async () => {
    setWorking(true);

    try {
      mutateUser(
        await fetchJson('api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        })
      );
      setUsername('');
      setPassword('');
    } catch (error) {
      if (error instanceof FetchError) {
        alert(error);
      } else {
        alert(error);
      }
    } finally {
      setWorking(false);
    }
  };
  return (
    <>
      <Wrapper>
        <Heading as="h2" size="xl" color="black.100" marginY="3">
          Sign in
        </Heading>
        <div>
          <label htmlFor="email-address" className="sr-only">
            Username
          </label>
          <Input
            placeholder="Username"
            size="lg"
            onChange={(event) => setUsername(event.target.value)}
            width={270}
            color="black"
            backgroundColor="white"
            paddingX="4"
            paddingY="3"
            marginY="3"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <Input
            placeholder="Password"
            size="lg"
            onChange={(event) => setPassword(event.target.value)}
            width={270}
            color="black"
            backgroundColor="white"
            paddingX="4"
            paddingY="3"
            marginY="3"
          />
        </div>
        <Button
          colorScheme="blue"
          marginY={1}
          onClick={handleSubmit}
          disabled={working}
          width={270}
        >
          Sign in
        </Button>
        <p>
          <Text color="black">New to Motion? </Text>
          <Link href="signup">
            <a>
              <Text color="blue">Sign up for free</Text>
            </a>
          </Link>
        </p>
      </Wrapper>
    </>
  );
};
export default Signin;
