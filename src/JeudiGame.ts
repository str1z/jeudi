import "phaser";
import DungeonScene from "./scenes/DungeonScene";
import SettingsScene from "./scenes/SettingsScene";
import MainScene from "./scenes/MainScene";
import StoryScene from "./scenes/StoryScene";
import ScoreScene from "./scenes/ScoreScene";
import BootScene from "./scenes/BootScene";
import MobileScene from "./scenes/MobileScene";
import ShopScene from "./scenes/ShopScene";
import { isMobile } from ".";

// declare type GameConfig = Phaser.Core.Config;
declare type GameConfig = {};

export default class JeudiGame extends Phaser.Game {
	scoreSceneData: {
		message: string;
		coins: number;
		msElapsed: number;
	};
	settings: {
		dungeonSeed: number;
		enemiesPerRoom: number;
		chestSpawnRate: number;
		difficultyMultiplier: number;
		dungeonSize: number;
		minRoomSize: number;
		dropRate: number;
		musicVolume: number;
		ambiantLight: number;
		player: number;
		weapon: number;
	};
	upgrades: {speed: number; damage: number; range: number, maxHealth: number };
  data: { coins: number; };

	constructor(config: GameConfig) {
		super(config);
		this.settings = {
			dungeonSeed: Math.floor(Math.random() * 256),
			enemiesPerRoom: 3,
			chestSpawnRate: 0.2,
			difficultyMultiplier: 1,
			dungeonSize: 64,
			minRoomSize: 8,
			dropRate: 0.2,
			musicVolume: 1,
			ambiantLight: isMobile ? 1 : 0,
			player: 0,
			weapon: 0,
		};
		this.upgrades = {
      speed: 100,
			damage: 5,
			range: 30,
      maxHealth: 1000
		};
    this.data = {
      coins: 0
    }
		this.scoreSceneData = {
			message: "You what, how!?!",
			coins: 0,
			msElapsed: 0,
		};
		this.addScenes();
	}

	addScenes() {
		this.scene.add("boot", new BootScene(), true);
		this.scene.add("mobile", new MobileScene());
		this.scene.add("main", new MainScene());
		this.scene.add("story", new StoryScene());
		this.scene.add("settings", new SettingsScene());
		this.scene.add("dungeon", new DungeonScene());
		this.scene.add("score", new ScoreScene());
		this.scene.add("shop", new ShopScene());
	}
}
