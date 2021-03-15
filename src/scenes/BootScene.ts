import "phaser";
import { isMobile } from "..";
import { atlas } from "../data/dungeon.json";

function createLoadingBar(label: string, progress: number, barLength: number) {
  const text = ((progress * 100).toFixed(2) + "%").padEnd(7);
  const bar = " [" + ("=".repeat(progress * barLength) + ">").padEnd(barLength + 1) + "]";
  return label + "\n" + text + bar;
}

export default class BootScene extends Phaser.Scene {
  loading: Phaser.GameObjects.Text;
  fileProgresses: { [key: string]: number };
  totalProgress: number;
  constructor() {
    super({});
  }

  renderLoading() {
    const fileUrls = Object.keys(this.fileProgresses);
    const bars = fileUrls.map((url) => createLoadingBar(url, this.fileProgresses[url], 30));
    this.loading.setText([
      ...bars,
      createLoadingBar("Total loading progress", this.totalProgress, 30),
    ]);
  }

  preload() {
    this.fileProgresses = {};
    this.loading = this.add.text(0, 0, "");
    this.load.on("progress", (progress) => {
      this.totalProgress = progress;
      this.renderLoading();
    });

    this.load.on("fileprogress", (file: any) => {
      this.fileProgresses[file.url] = file.percentComplete;
      this.renderLoading();
    });

    this.load.on("complete", () => {
      this.scene.start(isMobile ? "mobile" : "main");
    });

    this.load.path = "assets/";

    this.load.bitmapFont("atari", "fonts/atari_classic.png", "fonts/atari_classic.xml");
    this.load.atlas("dungeon", "spritesheets/dungeon.png", atlas);
    this.load.audio("main", "audio/chiptune_rising_of_the_shield_hero.mp3");
    this.load.audio("chiptune_dungeon", "audio/chiptune_bad_apple.mp3");
    this.load.audio("metal_dungeon", "audio/metal_bad_apple.mp3");
    this.load.audio("score", "audio/piano_elaina_ending.mp3");
  }
}
