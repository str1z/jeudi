import "phaser";
import { anims, atlas, keys } from "../data/dungeon.json";

import playerController from "../controllers/playerController";
import Character from "./Character";
import DungeonScene from "../scenes/DungeonScene";

export default class Player extends Character {
  weapon: Phaser.GameObjects.Sprite;
  weaponRotation: number;

  speed: number;
  coins: number;
  damage: number;
  range: number;

  constructor(scene: DungeonScene, x: number, y: number, anim = "knight_m") {
    super(scene, x, y, 10, 10, 3, 20, anim, playerController, 20, 1000);

    this.scene.cameras.main.startFollow(this);

    this.createWeapon(keys.weapon_anime_sword);

    this.speed = 100;
    this.coins = 0;
    this.damage = 5;
    this.range = 30;
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
