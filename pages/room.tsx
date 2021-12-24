import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef } from "react";
import * as handpose from "@tensorflow-models/handpose";
import { drawHand } from "../utils/drawHand";
import '@tensorflow/tfjs-backend-webgl';


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

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      // Get Video Properties
      const video = webcamRef.current;
      const videoWidth = webcamRef.current.videoWidth;
      const videoHeight = webcamRef.current.videoHeight;

      // Set video width
      webcamRef.current.width = videoWidth;
      webcamRef.current.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const hand = await net.estimateHands(video);
      console.log(hand);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  runHandpose();


  return (
    <>
      <Head>
        <title>Room</title>
      </Head>
      <video 
          ref={webcamRef} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
            }}
          autoPlay playsInline></video>
      <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
      />
    </>
  );
};

export default Room;
