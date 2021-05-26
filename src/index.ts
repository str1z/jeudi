import JeudiGame from "./JeudiGame";
import TouchControls from "./TouchControls";
import {width, height} from "./config.json"

export const isMobile = /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);

window.onload = () => {
  new TouchControls();
  new JeudiGame({
    type: Phaser.AUTO,
    width,
    height,
    parent: "game",
    scaleMode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    pixelArt: true,
    fps: {
      min: 10,
      target: 24,
    },
    physics: {
      default: "arcade",
      arcade: {
        // debug: true,
      },
    },
  });
};
