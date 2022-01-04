import type { NextPage } from 'next';
import Head from 'next/head';
import Room from '../components/Room';
import Header from '../components/Layout/Header';
import styles from '../styles/Home.module.css';

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Room</title>
      </Head>
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <Room />
        </main>
      </div>
    </>
  );
};

export default Page;
