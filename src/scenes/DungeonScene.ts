import "phaser";
import { tileSize } from "../config.json";
import { keys } from "../data/dungeon.json";
import DungeonMap from "../gen/DungeonMap";
import JeudiGame from "../JeudiGame";
import Chest from "../objects/Chest";
import Door from "../objects/Door";
import Enemy from "../objects/Enemy";
import Player from "../objects/Player";
import PowerUp from "../objects/PowerUp";
import Princess from "../objects/Princess";
import Tilemap from "../objects/Tilemap";
import floatToColor from "../utils/floatToColor";
import getPlayerSpriteName from "../utils/getPlayerSpriteName";
import getWeaponSpriteName from "../utils/getWeaponSpriteName";

export default class DungeonScene extends Phaser.Scene {
	wallCollider: Phaser.Physics.Arcade.Collider;
	entityCollider: Phaser.Physics.Arcade.Collider;
	wallTilemap: Phaser.GameObjects.RenderTexture;
	floorTilemap: Phaser.GameObjects.RenderTexture;
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

	createLights() {
		const { ambiantLight } = this.game.dungeonSceneData;
		if (ambiantLight !== 1) {
			this.lights.enable().setAmbientColor(floatToColor(ambiantLight));
			this.spotlight = this.lights.addLight(0, 0, 256, floatToColor(1 - ambiantLight), 1);
			this.floorTilemap.setPipeline("Light2D");
			this.wallTilemap.setPipeline("Light2D");
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
		this.floorTilemap = new Tilemap(this, this.dungeon.floorMap.data, tileSize, 0, -8);
		this.floorTilemap.depth = -2;
		this.wallTilemap = new Tilemap(this, this.dungeon.wallMap.data, tileSize, 0, -8);

		// applying lighting effets
		this.createLights();

		// entities
		this.entities = this.add.group();
		new Door(this, tileSize * 2, 8);
		const playerSprite = getPlayerSpriteName(this.game.dungeonSceneData.player);
		const weaponSprite = getWeaponSpriteName(this.game.dungeonSceneData.weapon)
		this.player = new Player(this, tileSize * 2, tileSize * 2, playerSprite, weaponSprite);
		this.princess = new Princess(
			this,
			this.dungeon.princess.x * tileSize,
			this.dungeon.princess.y * tileSize
		);

		// batch entities
		for (let e of this.dungeon.enemies)
			Enemy.createByName(this, e.x * tileSize, e.y * tileSize, e.name);
		for (let e of this.dungeon.chests) new Chest(this, e.x * tileSize, e.y * tileSize);

		// wall bounds
		const wallBounds = this.dungeon.wallBounds.map(([x, y, width, height]) => {
			const entity = this.physics.add.staticImage(
				x * tileSize + (width * tileSize) / 2,
				y * tileSize + (height * tileSize) / 2,
				""
			);
			entity.setVisible(false);
			entity.body.setSize(width * tileSize, height * tileSize + tileSize);
			this.physics.world.add(entity.body);
			return entity;
		});

		// add collisions
		this.wallCollider = this.physics.add.collider(this.entities, wallBounds);
		this.entityCollider = this.physics.add.collider(this.entities, this.entities);
		this.physics.world.setBounds(
			0,
			0,
			this.dungeon.width * tileSize,
			this.dungeon.height * tileSize
		);
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

		this.cursors = this.input.keyboard.createCursorKeys();

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
