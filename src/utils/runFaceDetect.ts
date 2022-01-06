import { RefObject } from 'react';
import * as faceapi from '@vladmandic/face-api';

const runFaceDetect = async (
  localVideoRef: RefObject<HTMLVideoElement>,
  localCanvasRef: RefObject<HTMLCanvasElement>
) => {
  const loadModels = async () => {
    const MODEL_URL = '/models';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.load(MODEL_URL),
      faceapi.nets.faceLandmark68Net.load(MODEL_URL),
      faceapi.nets.faceExpressionNet.load(MODEL_URL),
    ]);
  };
  await loadModels();
  console.log('facemodel loaded');

  setInterval(async () => {
    if (
      typeof localVideoRef.current !== 'undefined' &&
      localVideoRef.current !== null &&
      typeof localCanvasRef.current !== 'undefined' &&
      localCanvasRef.current !== null
    ) {
      // Get Video Properties
      const video = localVideoRef.current;
      const canvas = localCanvasRef.current;

      const videoWidth = localVideoRef.current.videoWidth;
      const videoHeight = localVideoRef.current.videoHeight;

      localVideoRef.current.width = videoWidth;
      localVideoRef.current.height = videoHeight;

      // Set canvas height and width
      localCanvasRef.current.width = videoWidth;
      localCanvasRef.current.height = videoHeight;

      const displaySize = { width: videoWidth, height: videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      const detectionsWithExpressions = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      console.log(detectionsWithExpressions);

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
      }
    }
  }, 100);
};

export { runFaceDetect };
