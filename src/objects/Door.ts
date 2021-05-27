import "phaser";
import { anims, atlas, keys } from "../data/dungeon.json";

import DungeonScene from "../scenes/DungeonScene";
import Entity from "./Entity";

export default class Door extends Entity {
  constructor(scene: DungeonScene, x: number, y: number) {
    super(scene, x, y, "");
    this.scene.add.existing(this);
  }

  update() {
    if (!this.visible) return;
    let princess = this.scene.princess;
    let distance = Phaser.Math.Distance.BetweenPoints(princess, this);
    if (distance < 100) {
      this.play(keys.doors_leaf_open, true);
    } else this.play(keys.doors_leaf_closed);
    if (distance < 50) {
      this.scene.gameOver("You saved the princess");
    }
  }
}
