import React from "react";
import { Composition } from "remotion";
import { PTBoardReel } from "./PTBoardReel";

export const RemotionRoot = () => {
  return (
    <Composition
      id="PTBoardReel"
      component={PTBoardReel}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
