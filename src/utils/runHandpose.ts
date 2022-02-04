import { drawHand } from './drawHand';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';
import { RefObject } from 'react';
import GestureEstimator from './fingerpose/GestureEstimator';
import VictoryGesture from './fingerpose/gestures/Victory';
import ThumbsUpGesture from './fingerpose/gestures/ThumbsUp';
import { sendMotion } from './webRTC';

class HandDetect {
  private static setIV: number | null;
  private localVideoRef: RefObject<HTMLVideoElement>;
  private localCanvasRef: RefObject<HTMLCanvasElement>;
  private room: string;

  constructor(
    localVideoRef: RefObject<HTMLVideoElement>,
    localCanvasRef: RefObject<HTMLCanvasElement>,
    room: string
  ) {
    this.localVideoRef = localVideoRef;
    this.localCanvasRef = localCanvasRef;
    this.room = room;
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

      if (hand.length > 0) {
        const GE = new GestureEstimator([VictoryGesture, ThumbsUpGesture]);
        const gesture = await GE.estimate(hand[0].landmarks, 4);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          const confidence = gesture.gestures.map(
            (prediction: any) => prediction.score
          );
          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          );
          if (confidence[maxConfidence] > 9) {
            if (gesture.gestures[maxConfidence].name === 'victory') {
              sendMotion(this.room, 'victory');
            }
            if (gesture.gestures[maxConfidence].name === 'thumbs_up') {
              sendMotion(this.room, 'thumbs_up');
            }
          }
        }
      }
    }
  }
}

export { HandDetect };
