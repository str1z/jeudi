import "phaser";
import { anims, atlas, keys } from "../data/dungeon.json";

import DungeonScene from "../scenes/DungeonScene";
import Entity from "./Entity";

export default class Blood extends Entity {
  constructor(scene: DungeonScene, x: number, y: number) {
    super(scene, x, y, "");
    this.play(keys.blood);
    this.depth = -1
  }
}
