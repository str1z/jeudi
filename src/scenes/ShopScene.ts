import "phaser";
import JeudiGame from "../JeudiGame";
import { width, height } from "../config.json";
export default class ShopScene extends Phaser.Scene {
	game: JeudiGame;
	inTransition: boolean;
	constructor() {
		super({});
	}

	create({ music }) {
		this.inTransition = false;
		this.add.bitmapText(width / 2, height * 0.35, "atari", "Shop", 16).setOrigin(0.5);

		const dataText = this.add
			.bitmapText(width / 2, height * 0.4, "atari", "", 8)
			.setCenterAlign()
			.setOrigin(0.5, 0);

		this.add
			.bitmapText(
				width / 2,
				height * 0.8,
				"atari",
				["Arrow right to buy upgrade!", "", "Hit space to continue..."],
				8
			)
			.setCenterAlign()
			.setOrigin(0.5, 0);

		const upgrades = this.game.upgrades;
        const data = this.game.data

		const upgradesKeys = Object.keys(upgrades);
		let upgradesCursor = 0;

        const upgradesCost = [3,5,10,1]

		const upgradeSprite = this.add.sprite(width / 2, height * 0.65, null).setScale(4);
        const upgradeSpriteNameMap : {[k in keyof typeof upgrades]: string} = {
            speed: "blue",
            maxHealth: "red",
            damage: "green",
            range: "yellow"
        }
    
		const renderSettingsText = () => {
			dataText.setText(
				[`Coins: ${data.coins}\n`,...upgradesKeys.map((k, i) => {
					let line = k + ": " + upgrades[k].toFixed(1);
					if (i == upgradesCursor) return `${upgradesCost[i]}$ ` + line + " +  ";
					return line;
				})]
			);
			upgradeSprite.play("flask_big_" + upgradeSpriteNameMap[upgradesKeys[upgradesCursor]]);
		};

		renderSettingsText();

		this.input.keyboard.addListener("keydown", (e: KeyboardEvent) => {
			if (this.inTransition) return;
			if (e.key == "ArrowUp") {
				upgradesCursor = Math.max(0, upgradesCursor - 1);
			} else if (e.key == "ArrowDown") {
				upgradesCursor = Math.min(upgradesKeys.length - 1, upgradesCursor + 1);
			} else if (e.key == "ArrowRight") {
                const cost = upgradesCost[upgradesCursor]
				if (data.coins < cost) return
                data.coins -= cost
                upgrades[upgradesKeys[upgradesCursor]] += 1
			} else if (e.key == " ") {
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
			renderSettingsText();
		});
	}
}
