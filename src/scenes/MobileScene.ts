import "phaser";
import JeudiGame from "../JeudiGame";
import {width, height} from "../config.json"

const notice = `Hi there! You seem to be playing on a mobile device. Touch for space and drag for arrows. Keep the "ambiantLight" option on 1 for the best performance. Have fun!`;

export default class MainScene extends Phaser.Scene {
  game: JeudiGame;
  inTransition: boolean;
  constructor() {
    super({});
  }

  create() {
    this.inTransition = false;
    this.add
      .bitmapText(width / 2, height / 2, "atari", [notice, "", "", "Space (touch) to continue..."], 8)
      .setOrigin(0.5)
      .setMaxWidth(300)
      .setCenterAlign();

    this.input.keyboard.addListener("keydown", (e: KeyboardEvent) => {
      if (e.key == " " && !this.inTransition) {
        this.inTransition = true;
        this.scene.start("main");
      }
    });
  }
}
