import "phaser";
import JeudiGame from "../JeudiGame";
import {width, height} from "../config.json"
export default class ScoreScene extends Phaser.Scene {
  game: JeudiGame;
  inTransition: boolean;
  constructor() {
    super({});
  }

  create() {
    this.inTransition = false;
    const { message, coins, msElapsed } = this.game.scoreSceneData;
    this.add.bitmapText(width / 2, height * 0.45, "atari", "Game Over!", 8).setOrigin(0.5);
    this.add.bitmapText(width / 2, height * 0.5, "atari", message, 16).setOrigin(0.5);

    this.add
      .bitmapText(
        width / 2,
        height * 0.55,
        "atari",
        [
          `in ${Math.round(msElapsed / 1000)} seconds...`,
          "",
          "",
          "",
          "",
          `${coins} coins collected`,
          "",
          "Hit space to restart!",
        ],
        8
      )
      .setOrigin(0.5, 0)
      .setCenterAlign();

    const music = this.sound.add("score", {
      loop: true,
      volume: this.game.dungeonSceneData.musicVolume,
    });
    music.play({ seek: 1.8 });

    this.input.keyboard.addListener("keydown", (e: KeyboardEvent) => {
      if (e.key == " " && !this.inTransition) {
        this.inTransition = true;
        const duration = 2000;
        const tween = this.tweens.add({
          targets: music,
          volume: 0,
          duration,
        });
        this.cameras.main.fade(duration).once("camerafadeoutcomplete", () => {
          tween.remove();
          music.destroy();
          this.scene.start("main");
        });
      }
    });
  }
}
