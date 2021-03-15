import JeudiGame from "./JeudiGame";
import TouchControls from "./TouchControls";

export const isMobile = /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);

window.onload = () => {
  new TouchControls();
  new JeudiGame({
    type: Phaser.AUTO,
    width: 400,
    height: 400,
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
  if (isMobile) {
    alert(
      `Hi there! You seem to be playing on a mobile device. Touch for space and drag for arrows. Keep the "ambiantLight" option on 1 for the best performance. Have fun!`
    );
  }
};
