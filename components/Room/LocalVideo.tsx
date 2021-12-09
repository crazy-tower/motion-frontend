import type { NextPage } from 'next'
import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import * as handpose from "@tensorflow-models/handpose";
import { drawHand } from "../../utils/drawHand";
import '@tensorflow/tfjs-backend-webgl';

type Props = {
  setLocalStream: Dispatch<SetStateAction<MediaStream | undefined>>
}

const LocalVideo: NextPage<Props> = ({ setLocalStream }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((mediaStream: MediaStream) => {
        if (localVideoRef.current) {
          setLocalStream(mediaStream)
          localVideoRef.current.srcObject = mediaStream
        }
      })
      .catch((error) => console.error(error))
  }, [localVideoRef, setLocalStream])

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
      typeof localVideoRef.current !== "undefined" &&
      webcamRef.current !== null
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
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  runHandpose();

  return (
    <>
    <video ref={localVideoRef} autoPlay playsInline width={600}></video>
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
    )
}

export default LocalVideo
