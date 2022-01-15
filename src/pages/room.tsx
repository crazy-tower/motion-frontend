import { Button, Heading, Input } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

const Page: NextPage = () => {
  const [room, setRoom] = useState<string>();

  return (
    <div
      style={{
        padding: '0 2rem',
        backgroundColor: '#006654',
      }}
    >
      <Head>
        <title>Room | motion</title>
        <meta name="description" content="Join room" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{
          height: '100vh',
          padding: '4rem 0',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Heading as="h1" size="2xl" marginY="3">
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
      </div>
    </div>
  );
};

export default Page;
