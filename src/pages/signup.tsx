import type { NextPage } from 'next';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
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

const Page: NextPage = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [working, setWorking] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async () => {
    setWorking(true);

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_SERVER + '/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        }
      );
      if (res.status == 200) {
        router.replace('/');
      } else {
        const data = await res.json();
        alert(data.error);
      }

      setUsername('');
      setPassword('');
    } finally {
      setWorking(false);
    }
  };
  return (
    <>
      <Head>
        <title>Motion</title>
      </Head>
      <Wrapper>
        <Heading as="h2" size="xl" color="black.100" marginY="3">
          Sign up
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
          Continue
        </Button>
        <p>
          <Text color="black">Already have an account? </Text>
          <Link href="/">
            <a>
              <Text color="blue">Sign in</Text>
            </a>
          </Link>
        </p>
      </Wrapper>
    </>
  );
};
export default Page;
