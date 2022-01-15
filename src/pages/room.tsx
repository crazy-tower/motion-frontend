import { Button, Heading, Input } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgGreen};
  height: 100vh;
  padding: 4rem 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Page: NextPage = () => {
  const [room, setRoom] = useState<string>();

  return (
    <>
      <Head>
        <title>Room | motion</title>
        <meta name="description" content="Join room" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Wrapper>
        <Heading as="h1" size="2xl" color="gray.200" marginY="3">
          Join room
        </Heading>

        <Input
          placeholder="room-name"
          size="lg"
          onChange={(event) => setRoom(event.target.value)}
          width={270}
          color="black"
          backgroundColor="white"
          paddingX="6"
          paddingY="6"
          marginY="3"
        />
        <Link href={`/${room}`}>
          <a>
            <Button colorScheme="blue" marginY={1}>
              Button
            </Button>
          </a>
        </Link>
      </Wrapper>
    </>
  );
};

export default Page;
