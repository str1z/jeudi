import "phaser";

import DungeonScene from "../scenes/DungeonScene";
import Entity from "./Entity";
import Blood from "./Blood";

export default class Character extends Entity {
  speed: number;
  healthbar: Phaser.GameObjects.Graphics;
  _health: number;
  maxHealth: number;
  anim: string;
  directionX: number;
  directionY: number;
  depthOff: number;
  custom: any;
  animIdle: string;
  animRun: string;
  controller: (t: Character) => void;

  constructor(
    scene: DungeonScene,
    x: number,
    y: number,
    sizeX: number,
    sizeY: number,
    offX: number,
    offY: number,
    anim: string,
    controller: (t: Character) => void,
    speed: number = 10,
    maxHealth: number = 100,
    ghost = false
  ) {
    super(scene, x, y, "");

    this.custom = {};
    this.depthOff = sizeY + offY;
    this.health = this.maxHealth = maxHealth;
    this.animIdle = anim + "_idle_anim";
    this.animRun = anim + "_run_anim";
    this.speed = speed;
    this.controller = controller;

    this.createHealthbar();
    this.play(this.animIdle);

    this.scene.physics.world.enable(this);
    this.body.setSize(sizeX, sizeY);
    this.body.setOffset(offX, offY);
    this.body.setDrag(500, 500);
    this.body.setCollideWorldBounds(true);

    if (ghost) {
      this.body.checkCollision.none = true;
    }

  }

  get health() {
    return this._health;
  }

  set health(value: number) {
    this._health = Math.max(value, 0);
    if (this.maxHealth < this._health) this.maxHealth = this._health;
  }

  createHealthbar() {
    this.health = this.maxHealth;
    this.healthbar = new Phaser.GameObjects.Graphics(this.scene);
    this.scene.add.existing(this.healthbar);
    this.healthbar.depth = 1e6;
  }

  updateHealthbar() {
    this.healthbar.clear();
    if (this.health == this.maxHealth) return;
    this.healthbar.fillStyle(0xaa0000);
    this.healthbar.fillRect(this.x - 12, this.y - 15, 25, 5);
    this.healthbar.fillStyle(0x00aa00);
    this.healthbar.fillRect(this.x - 12, this.y - 15, (25 * this.health) / this.maxHealth, 5);
  }

  updateAnimation() {
    if (this.directionX > 0) {
      this.setFlipX(false);
    } else if (this.directionX < 0) {
      this.setFlipX(true);
    }

    if (this.directionX == this.directionY && this.directionX == 0) {
      this.play(this.animIdle, true);
    } else {
      this.play(this.animRun, true);
    }
  }

  moveUp() {
    this.directionY--;
    this.body.setVelocityY(-this.speed);
  }
  moveDown() {
    this.directionY++;
    this.body.setVelocityY(this.speed);
  }
  moveLeft() {
    this.directionX--;
    this.body.setVelocityX(-this.speed);
  }
  moveRight() {
    this.directionX++;
    this.body.setVelocityX(this.speed);
  }

  updateDirection() {
    this.directionX = Math.sign(this.body.velocity.x);
    this.directionY = Math.sign(this.body.velocity.y);
  }

  update() {

    if (!this.scene || this.scene.isGameOver) return;
    this.directionX = 0;
    this.directionY = 0;
    this.controller(this);
    this.updateHealthbar();
    this.updateAnimation();
    if (this.health <= 0) {
      this.beforeDestroy();
      this.scene.goreEmitter.emitParticleAt(this.x, this.y, 1000);
      new Blood(this.scene, this.x, this.y);
      this.healthbar.destroy();
      this.destroy();
      this.afterDestory();
    }
  }

  beforeDestroy() {}
  afterDestory() {}

  static createBig(
    scene: DungeonScene,
    x: number,
    y: number,
    anim: string,
    controller: (t: Character) => void,
    speed: number,
    maxHealth: number
  ) {
    return new this(scene, x, y, 24, 12, 6, 24, anim, controller, speed, maxHealth);
  }

  static create(
    scene: DungeonScene,
    x: number,
    y: number,
    anim: string,
    controller: (t: Character) => void,
    speed: number,
    maxHealth: number
  ) {
    return new this(scene, x, y, 12, 8, 4, 12, anim, controller, speed, maxHealth);
  }

  static createSmall(
    scene: DungeonScene,
    x: number,
    y: number,
    anim: string,
    controller: (t: Character) => void,
    speed: number,
    maxHealth: number
  ) {
    return new this(scene, x, y, 12, 6, 3, 10, anim, controller, speed, maxHealth);
  }

  static createWide(
    scene: DungeonScene,
    x: number,
    y: number,
    anim: string,
    controller: (t: Character) => void,
    speed: number,
    maxHealth: number
  ) {
    return new this(scene, x, y, 16, 8, 0, 8, anim, controller, speed, maxHealth);
  }

  static createTiny(
    scene: DungeonScene,
    x: number,
    y: number,
    anim: string,
    controller: (t: Character) => void,
    speed: number,
    maxHealth: number
  ) {
    return new this(scene, x, y, 6, 6, 6, 12, anim, controller, speed, maxHealth);
  }

  static createGhost(
    scene: DungeonScene,
    x: number,
    y: number,
    anim: string,
    controller: (t: Character) => void,
    speed: number,
    maxHealth: number
  ) {
    return new this(scene, x, y, 0, 0, 0, 6, anim, controller, speed, maxHealth, true);
  }
}
