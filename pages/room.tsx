import { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";

const Room: NextPage = () => {
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((mediaStream: MediaStream) => {
        const localVideo = document.querySelector("video");
        if (localVideo) {
          localVideo.srcObject = mediaStream;
        }
      });
  });
  return (
    <>
      <Head>
        <title>Room</title>
      </Head>
      <video autoPlay playsInline></video>
    </>
  );
};

export default Room;
