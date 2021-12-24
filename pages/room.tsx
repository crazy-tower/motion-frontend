import type { NextPage } from "next";
import Head from "next/head";
import Room from "../components/Room";

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Room</title>
      </Head>
      <h1>Realtime communication with WebRTC</h1>
      <Room />
    </>
  );
};

export default Page;
