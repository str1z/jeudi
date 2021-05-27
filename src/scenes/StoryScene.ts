import "phaser";
import JeudiGame from "../JeudiGame";
import { atlas, keys } from "../data/dungeon.json";
import { width, height } from "../config.json";

const storyText = `Once upon a time, some Thursday of some week of some year, some brave adventurer must save his/her beloved princess from the dangers of a bloody dungeon. Red potions give you health, blue for speed, yellow for range and green for strength. Coins make you richer!`;

export default class StoryScene extends Phaser.Scene {
	game: JeudiGame;
	inTransition: boolean;
	constructor() {
		super({});
	}

	create({ music }) {
		this.inTransition = false;
		this.add.bitmapText(width / 2, height * 0.3, "atari", "Story", 16).setOrigin(0.5);

		this.add
			.bitmapText(
				width / 2,
				height * 0.4,
				"atari",
				[storyText, "", "", "Basically, bring her back!"],
				8
			)
			.setOrigin(0.5, 0)
			.setMaxWidth(300)
			.setCenterAlign();

		this.add.sprite(width / 2, height * 0.65, null).setScale(2).play("elf_f_run_anim");

		this.add
			.bitmapText(width / 2, height * 0.8, "atari", "Hit space to continue!", 8)
			.setOrigin(0.5);

		this.input.keyboard.addListener("keydown", (e: KeyboardEvent) => {
			if (e.key == " " && !this.inTransition) {
				this.inTransition = true;
				this.scene.start("settings", { music });
			}
		});
	}
}
