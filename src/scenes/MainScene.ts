import "phaser";
import JeudiGame from "../JeudiGame";
import { width, height } from "../config.json";
export default class MainScene extends Phaser.Scene {
	game: JeudiGame;
	inTransition: boolean;
	constructor() {
		super({});
	}

	create() {
		this.inTransition = false;
		this.add.bitmapText(width / 2, height / 2, "atari", "Jeudi", 16).setOrigin(0.5);
		this.add.bitmapText(width / 2, height * 0.6, "atari", "dungeon", 8).setOrigin(0.5);
		this.add.bitmapText(width / 2, height * 0.8, "atari", "Hit space!", 8).setOrigin(0.5);

		const music = this.sound.add("main", {
			loop: true,
			volume: this.game.settings.musicVolume,
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
