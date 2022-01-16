import type { NextPage } from 'next';
import Head from 'next/head';
import Room from '../components/block/Room';
import Header from '../components/block/Layout/Header';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const Layout = styled.div`
  min-height: 100vh;
  padding: 0 2rem;
  background-color: ${(props) => props.theme.bgGreen};
`;

const Wrapper = styled.div`
  padding: 2rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Page: NextPage = () => {
  const router = useRouter();
  const room = router.query.room as string | undefined;

  if (!room) return <p>No room</p>;

  return (
    <>
      <Head>
        <title>Room | motion</title>
      </Head>
      <Layout>
        <Header />
        <Wrapper>
          <Room room={room} />
        </Wrapper>
      </Layout>
    </>
  );
};

export default Page;
