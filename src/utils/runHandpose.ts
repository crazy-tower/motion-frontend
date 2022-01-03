import { drawHand } from './drawHand';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';
import { RefObject } from 'react';

const runHandpose = async (
  localVideoRef: RefObject<HTMLVideoElement>,
  canvasRef: RefObject<HTMLCanvasElement>
) => {
  const net = await handpose.load();
  console.log('Handpose model loaded.');
  //  Loop and detect hands
  setInterval(() => {
    detect(net, localVideoRef, canvasRef);
  }, 100);
};

const detect = async (
  net: handpose.HandPose,
  localVideoRef: RefObject<HTMLVideoElement>,
  canvasRef: RefObject<HTMLCanvasElement>
) => {
  // Check data is available
  if (
    typeof localVideoRef.current !== 'undefined' &&
    localVideoRef.current !== null &&
    typeof canvasRef.current !== 'undefined' &&
    canvasRef.current !== null
  ) {
    // Get Video Properties
    const video = localVideoRef.current;
    const videoWidth = localVideoRef.current.videoWidth;
    const videoHeight = localVideoRef.current.videoHeight;

    // Set video width
    localVideoRef.current.width = videoWidth;
    localVideoRef.current.height = videoHeight;

    // Set canvas height and width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    // Make Detections
    const hand = await net.estimateHands(video);
    console.log(hand);

    // Draw mesh
    const ctx = canvasRef.current.getContext('2d');
    drawHand(hand, ctx);
  }
};

export { runHandpose };