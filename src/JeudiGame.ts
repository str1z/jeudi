import "phaser";
import DungeonScene from "./scenes/DungeonScene";
import SettingsScene from "./scenes/SettingsScene";
import MainScene from "./scenes/MainScene";
import StoryScene from "./scenes/StoryScene";
import ScoreScene from "./scenes/ScoreScene";
import BootScene from "./scenes/BootScene";

// declare type GameConfig = Phaser.Core.Config;
declare type GameConfig = {};

export default class JeudiGame extends Phaser.Game {
  scoreSceneData: {
    message: string;
    coins: number;
    msElapsed: number;
  };
  dungeonSceneData: {
    dungeonSeed: number;
    enemiesPerRoom: number;
    chestSpawnRate: number;
    difficultyMultiplier: number;
    dungeonSize: number;
    minRoomSize: number;
    dropRate: number;
    musicVolume: number;
    ambiantLight: number;
  };

  constructor(config: GameConfig) {
    super(config);
    this.dungeonSceneData = {
      dungeonSeed: Math.floor(Math.random() * 256),
      enemiesPerRoom: 3,
      chestSpawnRate: 0.2,
      difficultyMultiplier: 1,
      dungeonSize: 64,
      minRoomSize: 8,
      dropRate: 0.2,
      musicVolume: 1,
      ambiantLight: 0,
    };
    this.scoreSceneData = {
      message: "You what, how!?!",
      coins: 0,
      msElapsed: 0,
    };
    this.addScenes();
  }

  addScenes() {
    this.scene.add("boot", new BootScene(), true);
    this.scene.add("main", new MainScene());
    this.scene.add("story", new StoryScene());
    this.scene.add("settings", new SettingsScene());
    this.scene.add("dungeon", new DungeonScene());
    this.scene.add("score", new ScoreScene());
  }
}
