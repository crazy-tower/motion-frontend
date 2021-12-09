import React, { useRef } from "react";
import HandPoseVideo from "../../components/handpose_video";

export default function Meeting() {
  return (
    <div className="App">

      <main>
        <h1>Meeting Page</h1>
        <HandPoseVideo/>
      </main>
    </div>
  );
}