import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Signin from '../components/block/Entrance/signin';

const Page: NextPage = () => {
  return (
    <div className={styles.entranceContainer}>
      <Head>
        <title>Motion</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Motion!</h1>
        <Signin />
      </main>
    </div>
  );
};

export default Page;
