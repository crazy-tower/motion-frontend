import { RefObject } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { sendMotion } from './webRTC';

const thresholdHappy = 0.9;

class FaceDetect {
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
    FaceDetect.setIV = null;
  }
  static async setSetIV(setIV: number) {
    FaceDetect.setIV = setIV;
  }

  async handleToggleFaceMotion(faceMotionEnabled: Boolean) {
    if (faceMotionEnabled) {
      if (FaceDetect.setIV) {
        clearInterval(FaceDetect.setIV);
        FaceDetect.setIV = null;
      }
    } else {
      if (FaceDetect.setIV == null) {
        await this.runFaceDetect();
      }
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
            sendMotion(this.room, 'happy');
          }
          if (
            detectionsWithExpressions['expressions']['angry'] > thresholdHappy
          ) {
            sendMotion(this.room, 'angry');
          }
          if (
            detectionsWithExpressions['expressions']['sad'] > thresholdHappy
          ) {
            sendMotion(this.room, 'sad');
          }
          if (
            detectionsWithExpressions['expressions']['surprised'] >
            thresholdHappy
          ) {
            sendMotion(this.room, 'surprised');
          }
        }
      }
    }, 10);
    await FaceDetect.setSetIV(IV);
  }
}

export { FaceDetect };
