import type { NextPage } from 'next';
import Head from 'next/head';
import Room from '../components/Room';
import Header from '../components/header';
import styles from '../styles/Home.module.css';

const Page: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Room</title>
      </Head>
      <Header />
      <main className={styles.main}>
        <Room />
      </main>
    </div>
  );
};

export default Page;
