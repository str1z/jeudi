import JeudiGame from "./JeudiGame";
import TouchControls from "./TouchControls";

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
};
