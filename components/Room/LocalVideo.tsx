import type { NextPage } from 'next'
import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { runHandpose } from '../../utils/runHandpose'

type Props = {
  setLocalStream: Dispatch<SetStateAction<MediaStream | undefined>>
}

const LocalVideo: NextPage<Props> = ({ setLocalStream }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef(null)

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

  runHandpose(localVideoRef, canvasRef)

  return (
    <>
      <div
        style={{
          position: 'relative',
          left: 0,
          right: 0,
          zindex: 9,
          width: 600,
          height: 480,
        }}
      >
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            zindex: 9,
            width: 600,
            height: 480,
          }}
        ></video>
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            zindex: 9,
            width: 600,
            height: 480,
          }}
        />
      </div>
    </>
  )
}

export default LocalVideo
