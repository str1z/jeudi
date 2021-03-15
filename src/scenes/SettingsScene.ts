import "phaser";
import { JeudiGame } from "..";

export default class SettingsScene extends Phaser.Scene {
  game: JeudiGame;
  inTransition: boolean;
  constructor() {
    super({});
  }

  create({ music }) {
    this.inTransition = false;
    this.add.bitmapText(200, 140, "atari", "Settings", 16).setOrigin(0.5);

    const settingsText = this.add
      .bitmapText(200, 170, "atari", "", 8)
      .setCenterAlign()
      .setOrigin(0.5, 0);

    this.add
      .bitmapText(
        200,
        250,
        "atari",
        ["Arrows to move & space to attack", "", "Hit space to start!"],
        8
      )
      .setCenterAlign()
      .setOrigin(0.5, 0);

    const settings = this.game.dungeonSceneData;
    const settingsKeys = Object.keys(settings);
    let settingsCursor = 0;
    const renderSettingsText = () => {
      settingsText.setText(
        settingsKeys.map((k, i) => {
          let line = k + ": " + settings[k].toFixed(1);
          if (i == settingsCursor) return "< " + line + " >";
          return line;
        })
      );
      music.setVolume(settings.musicVolume);
    };

    renderSettingsText();

    const lowers = [0, 1, 0, 0.01, 32, 4, 0, 0];
    const incs = [1, 1, 0.1, 0.1, 1, 1, 0.1, 0.1];
    const uppers = [Infinity, 5, 1, 10, 128, 16, 1, 1];

    this.input.keyboard.addListener("keydown", (e: KeyboardEvent) => {
      if (e.key == "ArrowUp") {
        settingsCursor = Math.max(0, settingsCursor - 1);
      } else if (e.key == "ArrowDown") {
        settingsCursor = Math.min(settingsKeys.length - 1, settingsCursor + 1);
      } else if (e.key == "ArrowLeft") {
        settings[settingsKeys[settingsCursor]] = Math.max(
          lowers[settingsCursor],
          settings[settingsKeys[settingsCursor]] - incs[settingsCursor]
        );
      } else if (e.key == "ArrowRight") {
        settings[settingsKeys[settingsCursor]] = Math.min(
          uppers[settingsCursor],
          settings[settingsKeys[settingsCursor]] + incs[settingsCursor]
        );
      } else if (e.key == " " && !this.inTransition) {
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
          this.scene.start("dungeon");
        });
      }
      renderSettingsText();
    });
  }
}
