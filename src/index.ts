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
      "Hi there! You seem to be plating on a mobile device... Touch for space and drag for arrow keys. Have fun! Keep ambiant light to 1 for the best performance."
    );
  }
};
