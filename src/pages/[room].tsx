import type { NextPage } from 'next';
import Head from 'next/head';
import Room from '../components/block/Room';
import Header from '../components/block/Layout/Header';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';

const Page: NextPage = () => {
  const router = useRouter();
  const room = router.query.room as string | undefined;

  if (!room) return <p>No room</p>;

  return (
    <>
      <Head>
        <title>Room | motion</title>
      </Head>
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <Room room={room} />
        </main>
      </div>
    </>
  );
};

export default Page;
