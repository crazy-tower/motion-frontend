import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const Page: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Motion</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Motion!</h1>

        <Link href="/room">
          <a className={styles.description}>Go to Room! &rarr;</a>
        </Link>
      </main>
    </div>
  );
};

export default Page;
