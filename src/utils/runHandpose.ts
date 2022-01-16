import { drawHand } from './drawHand';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';
import { RefObject } from 'react';

class HandDetect {
  private static setIV: number | null;
  private localVideoRef: RefObject<HTMLVideoElement>;
  private localCanvasRef: RefObject<HTMLCanvasElement>;

  constructor(
    localVideoRef: RefObject<HTMLVideoElement>,
    localCanvasRef: RefObject<HTMLCanvasElement>
  ) {
    this.localVideoRef = localVideoRef;
    this.localCanvasRef = localCanvasRef;
    HandDetect.setIV = null;
  }
  static async setSetIV(setIV: number) {
    HandDetect.setIV = setIV;
  }

  async handleToggleHandMotion(handMotionEnabled: Boolean) {
    if (handMotionEnabled) {
      if (HandDetect.setIV) {
        clearInterval(HandDetect.setIV);
        HandDetect.setIV = null;
      }
    } else {
      if (HandDetect.setIV == null) {
        await this.runHandDetect();
      }
    }
  }

  async runHandDetect() {
    const net = await handpose.load();
    const IV = window.setInterval(() => {
      this.detect(net, this.localVideoRef, this.localCanvasRef);
    }, 100);
    await HandDetect.setSetIV(IV);
  }

  async detect(
    net: handpose.HandPose,
    localVideoRef: RefObject<HTMLVideoElement>,
    canvasRef: RefObject<HTMLCanvasElement>
  ) {
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
      // console.log(hand);

      // Draw mesh
      const ctx = canvasRef.current.getContext('2d');
      drawHand(hand, ctx);
    }
  }
}

export { HandDetect };
