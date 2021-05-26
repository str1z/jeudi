import "phaser";

import { tilemapUpdateInterval } from "../config.json";
import { anims, keys } from "../data/dungeon.json";

import floatToColor from "../utils/floatToColor";
import createAnims from "../utils/createAnims";

import FloorTilemap from "../objects/FloorTilemap";
import WallTilemap from "../objects/WallTilemap";
import Tile from "../objects/Tile";
import Player from "../objects/Player";
import Enemy from "../objects/Enemy";
import PowerUp from "../objects/PowerUp";
import Chest from "../objects/Chest";
import DungeonMap from "../gen/DungeonMap";
import Character from "../objects/Character";
import Princess from "../objects/Princess";
import Door from "../objects/Door";
import JeudiGame from "../JeudiGame";

export default class DungeonScene extends Phaser.Scene {
  wallTilemap: Phaser.Physics.Arcade.StaticGroup;
  floorTilemap: Phaser.GameObjects.Group;
  entities: Phaser.GameObjects.Group;
  player: Player;
  princess: Princess;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  goreParticles: Phaser.GameObjects.Particles.ParticleEmitterManager;
  goreEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  game: JeudiGame;
  music: Phaser.Sound.BaseSound;
  startTime: number;
  isGameOver: boolean;
  dungeon: DungeonMap;
  spotlight: Phaser.GameObjects.Light;

  constructor() {
    super({});
  }

  createTimers() {
    this.time.addEvent({
      callback: this.updateVisible,
      callbackScope: this,
      delay: tilemapUpdateInterval,
      loop: true,
    });
  }

  createLights() {
    const { ambiantLight } = this.game.dungeonSceneData;
    if (ambiantLight !== 1) {
      this.lights.enable().setAmbientColor(floatToColor(ambiantLight));
      this.spotlight = this.lights.addLight(0, 0, 256, floatToColor(1 - ambiantLight), 1);
      this.floorTilemap.children.each((t: Tile) => t.setPipeline("Light2D"));
      this.wallTilemap.children.each((t: Tile) => t.setPipeline("Light2D"));
    }
  }

  createDungeon() {
    // creating dungeon map blueprint
    this.dungeon = new DungeonMap({
      width: this.game.dungeonSceneData.dungeonSize,
      height: this.game.dungeonSceneData.dungeonSize,
      entranceSize: 4,
      minRoomHeight: this.game.dungeonSceneData.minRoomSize,
      minRoomWidth: this.game.dungeonSceneData.minRoomSize,
      dungeonSeed: "" + this.game.dungeonSceneData.dungeonSeed,
      chestSpawnRate: this.game.dungeonSceneData.chestSpawnRate,
      enemiesPerRoom: this.game.dungeonSceneData.enemiesPerRoom,
    });

    // creating the tiles
    this.floorTilemap = new FloorTilemap(this, this.dungeon.floorMap.data);
    this.wallTilemap = new WallTilemap(this, this.dungeon.wallMap.data);

    // applying lighting effets
    this.createLights();

    // entities
    this.entities = this.add.group();
    new Door(this, 32, 8);
    this.player = new Player(this, 32, 32, "knight_m");
    this.princess = new Princess(this, this.dungeon.princess.x * 16, this.dungeon.princess.y * 16);

    // batch entities
    for (let e of this.dungeon.enemies) Enemy.createByName(this, e.x * 16, e.y * 16, e.name);
    for (let e of this.dungeon.chests) new Chest(this, e.x * 16, e.y * 16);

    // add collisions
    this.physics.add.collider(this.entities, this.wallTilemap);
    this.physics.add.collider(this.entities, this.entities);
    this.physics.world.setBounds(0, 0, this.dungeon.width * 16, this.dungeon.height * 16);
  }

  createGoreParticle() {
    this.goreParticles = this.add.particles("dungeon");
    this.goreParticles.depth = 1e10;
    this.goreEmitter = this.goreParticles.createEmitter({
      frame: "blood0",
      gravityY: 300,
      lifespan: 500,
      scale: { start: 0.4, end: 0 },
      speedY: { min: -10, max: -100 },
      speedX: { min: -100, max: 100 },
    });
    this.goreEmitter.stop();
  }

  create() {
    this.isGameOver = false;
    createAnims(this, "dungeon", anims);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.createTimers();
    this.createDungeon();
    this.createGoreParticle();
    this.createMusic();

    this.startTime = Date.now();
  }

  createMusic() {
    this.music = this.sound.add("dungeon", {
      loop: true,
      volume: this.game.dungeonSceneData.musicVolume,
    });
    this.music.play();
  }

  updateVisible() {
    this.floorTilemap.children.each((child: Tile) => child.updateVisible());
    this.wallTilemap.children.each((child: Tile) => child.updateVisible());
    this.entities.children.each((child: Character) => child.updateVisible && child.updateVisible());
  }

  update() {
    this.entities.children.each((child) => child.update());
  }

  spawnPowerUp(x: number, y: number, key: string, propName: string, propInc = 1) {
    this.entities.add(new PowerUp(this, x, y, key, propName, propInc));
  }

  randomDrop(x: number, y: number) {
    let n = Math.random();
    if (n > 0.95) {
      this.spawnPowerUp(x, y, keys.flask_big_red, "health", 100);
    } else if (n > 0.9) {
      this.spawnPowerUp(x, y, keys.flask_red, "health", 50);
    } else if (n > 0.85) {
      this.spawnPowerUp(x, y, keys.flask_big_green, "damage", 5);
    } else if (n > 0.8) {
      this.spawnPowerUp(x, y, keys.flask_green, "damage", 2);
    } else if (n > 0.75) {
      this.spawnPowerUp(x, y, keys.flask_big_blue, "speed", 5);
    } else if (n > 0.7) {
      this.spawnPowerUp(x, y, keys.flask_blue, "speed", 2);
    } else if (n > 0.65) {
      this.spawnPowerUp(x, y, keys.flask_big_yellow, "range", 2);
    } else if (n > 0.6) {
      this.spawnPowerUp(x, y, keys.flask_yellow, "range", 1);
    } else {
      this.spawnPowerUp(x, y, keys.coin_anim, "coins", 1);
    }
  }

  gameOver(message: string) {
    if (this.isGameOver) return;
    this.isGameOver = true;
    const duration = 3000;
    const tween = this.tweens.add({
      targets: this.music,
      volume: 0,
      duration,
    });
    this.cameras.main.fade(duration).once("camerafadeoutcomplete", () => {
      this.game.scoreSceneData = {
        message,
        coins: this.player.coins,
        msElapsed: Date.now() - this.startTime,
      };
      tween.remove();
      this.music.destroy();
      this.scene.start("score");
    });
  }
}
