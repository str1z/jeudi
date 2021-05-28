import "phaser";
import playerController from "../controllers/playerController";
import { keys } from "../data/dungeon.json";
import DungeonScene from "../scenes/DungeonScene";
import Character from "./Character";

export default class Player extends Character {
	weapon: Phaser.GameObjects.Sprite;
	weaponRotation: number;

	speed: number;
	damage: number;
	range: number;
	coins: number;

	constructor(scene: DungeonScene, x: number, y: number, anim: string, weaponSprite: string, maxHealth: number, speed: number, damage: number, range: number) {
		super(scene, x, y, 10, 10, 3, 20, anim, playerController, 20, maxHealth);

		this.scene.cameras.main.startFollow(this);

		this.createWeapon(weaponSprite);

		this.maxHealth = maxHealth
		this.speed = speed;
		this.damage = damage;
		this.range = range;
		this.coins = 0;
	}
	createWeapon(anim: string) {
		this.weapon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "");
		this.weapon.play(anim);
		this.scene.add.existing(this.weapon);
		this.weaponRotation = 0;
		this.weapon.depth = 1e5;
		this.weapon.setOrigin(0.5, 1);
	}

	updateWeapon() {
		this.weapon.x = this.x + (this.flipX ? -12 : 12);
		this.weapon.y = this.y + 10;
		if (this.weaponRotation > 0) this.weaponRotation += 0.3;
		if (this.weaponRotation > Math.PI) this.weaponRotation = 0;
		this.weapon.rotation = this.flipX ? -this.weaponRotation : this.weaponRotation;
	}

	beforeDestroy() {
		this.weapon.destroy();
	}

	afterDestory() {
		this._scene.gameOver("You died");
	}
}
