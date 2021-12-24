import type { NextPage } from "next";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

type Props = {
  setLocalStream: Dispatch<SetStateAction<MediaStream | undefined>>;
};

const LocalVideo: NextPage<Props> = ({ setLocalStream }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((mediaStream: MediaStream) => {
        if (localVideoRef.current) {
          setLocalStream(mediaStream);
          localVideoRef.current.srcObject = mediaStream;
        }
      })
      .catch((error) => console.error(error));
  }, [localVideoRef, setLocalStream]);

  return <video width={600} ref={localVideoRef} autoPlay playsInline></video>;
};

export default LocalVideo;
