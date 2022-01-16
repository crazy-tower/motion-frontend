import { RefObject } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { someoneLaugh } from './webRTC';

const thresholdHappy = 0.9;

class FaceDetect {
  private setIV: number | null;
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
    this.setIV = null;
  }
  setSetIV(setIV: number) {
    this.setIV = setIV;
  }

  handleToggleFaceMotion(faceMotionEnabled: Boolean) {
    if (faceMotionEnabled) {
      console.log(faceMotionEnabled);
      if (this.setIV) {
        console.log(this.setIV);
        clearInterval(this.setIV);
      }
      this.setIV = null;
      return false;
    } else {
      if (this.setIV == null) {
        this.runFaceDetect();
      }
      return true;
    }
  }

  async runFaceDetect() {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.load(MODEL_URL),
        faceapi.nets.faceLandmark68Net.load(MODEL_URL),
        faceapi.nets.faceExpressionNet.load(MODEL_URL),
      ]);
    };
    await loadModels();
    // console.log('facemodel loaded');

    const IV = window.setInterval(async () => {
      if (
        typeof this.localVideoRef.current !== 'undefined' &&
        this.localVideoRef.current !== null &&
        typeof this.localCanvasRef.current !== 'undefined' &&
        this.localCanvasRef.current !== null
      ) {
        // Get Video Properties
        const video = this.localVideoRef.current;
        const canvas = this.localCanvasRef.current;

        const videoWidth = this.localVideoRef.current.videoWidth;
        const videoHeight = this.localVideoRef.current.videoHeight;

        this.localVideoRef.current.width = videoWidth;
        this.localVideoRef.current.height = videoHeight;

        // Set canvas height and width
        this.localCanvasRef.current.width = videoWidth;
        this.localCanvasRef.current.height = videoHeight;

        const displaySize = { width: videoWidth, height: videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        const detectionsWithExpressions = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        // console.log(detectionsWithExpressions);

        if (detectionsWithExpressions) {
          const resizeDetections = faceapi.resizeResults(
            detectionsWithExpressions,
            displaySize
          );
          if (resizeDetections) {
            faceapi.draw.drawDetections(canvas, resizeDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizeDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizeDetections);
          }

          if (
            detectionsWithExpressions['expressions']['happy'] > thresholdHappy
          ) {
            someoneLaugh(this.room);
          }
        }
      }
    }, 10);
    console.log(IV);
    this.setSetIV(IV);
  }
}

export { FaceDetect };
