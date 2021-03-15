import "phaser";
import JeudiGame from "../JeudiGame";

export default class MainScene extends Phaser.Scene {
  game: JeudiGame;
  inTransition: boolean;
  constructor() {
    super({});
  }

  create() {
    this.inTransition = false;
    this.add.bitmapText(200, 200, "atari", "Jeudi", 16).setOrigin(0.5);
    this.add.bitmapText(200, 216, "atari", "dungeon", 8).setOrigin(0.5);
    this.add.bitmapText(200, 350, "atari", "Hit space!", 8).setOrigin(0.5);

    const music = this.sound.add("main", {
      loop: true,
      volume: this.game.dungeonSceneData.musicVolume,
    });

    music.play();

    this.input.keyboard.addListener("keydown", (e: KeyboardEvent) => {
      if (e.key == " " && !this.inTransition) {
        this.inTransition = true;
        this.scene.start("story", { music });
      }
    });
  }
}
