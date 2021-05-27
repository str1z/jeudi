import "phaser";
import { anims, atlas, keys } from "../data/dungeon.json";

import DungeonScene from "../scenes/DungeonScene";
import Entity from "./Entity";

export default class PowerUp extends Entity {
  scene: DungeonScene;
  propName: string;
  propInc: number;
  propMax: number;
  constructor(
    scene: DungeonScene,
    x: number,
    y: number,
    key: string,
    propName: string,
    propInc = 1
  ) {
    super(scene, x, y, "");
    this.play(key);
    this.scene.add.existing(this);
    this.depth = 1e4;
    this.propName = propName;
    this.propInc = propInc;
    this.depth = -1
  }
  update() {
    let distance = Phaser.Math.Distance.BetweenPoints(this.scene.player, this);
    if (distance < 15) {
      const player = this.scene.player;
      player[this.propName] = player[this.propName] + this.propInc;
      this.destroy();
    }
  }
}
