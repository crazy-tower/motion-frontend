import { Button, Heading, Input } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styled from 'styled-components';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgGreen};
  height: 100vh;
  padding: 4rem 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  background-color: ${(props) => props.theme.bgGreen};
  padding: 4rem 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const HeaderButton = styled.div`
  background-color: ${(props) => props.theme.bgGreen};
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
`;

const Page: NextPage = () => {
  const [room, setRoom] = useState<string>();
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/');
    },
  });

  return (
    <>
      <Head>
        <title>Room | motion</title>
        <meta name="description" content="Join room" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HeaderButton>
        <Button onClick={() => signOut()} colorScheme="blue" marginY={1}>
          Sign out
        </Button>
      </HeaderButton>
      <Header>
        <Heading as="h1" size="4xl" color="gray.200" marginY="" paddingY="10">
          Welcome {session?.user?.name}
        </Heading>
      </Header>
      <Wrapper>
        <Heading as="h1" size="3xl" color="gray.200" marginY="3">
          Join room
        </Heading>

        <Input
          placeholder="room-name"
          size="lg"
          onChange={(event) => setRoom(event.target.value)}
          width={270}
          color="black"
          backgroundColor="white"
          paddingX="4"
          paddingY="3"
          marginY="3"
        />
        <Link href={`/${room}`}>
          <a>
            <Button colorScheme="blue" marginY={1}>
              Join
            </Button>
          </a>
        </Link>
      </Wrapper>
    </>
  );
};

export default Page;
