import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

const Page: NextPage = () => {
  const [room, setRoom] = useState<string>();

  return (
    <div className={styles.container}>
      <Head>
        <title>Room | motion</title>
        <meta name="description" content="Join room" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <h1 className="text-white text-6xl">Join room</h1>

        <form className="p-5">
          <label htmlFor="room" className="text-white text-lg">
            <div>{process.env.NEXT_PUBLIC_FRONTEND_SERVER}/</div>
            <div>
              <input
                type="text"
                name="room"
                id="room"
                placeholder="room-name"
                onChange={(event) => setRoom(event.target.value)}
                className="px-5 py-4 rounded text-black"
              />
            </div>
          </label>
        </form>
        <Link href={`/${room}`}>
          <a>
            <button
              type="button"
              className="bg-indigo-700 hover:bg-indigo-900 text-white text-xl py-2 px-4 rounded-lg"
            >
              Join!
            </button>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Page;
