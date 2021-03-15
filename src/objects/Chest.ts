import "phaser";
import { anims, atlas, keys } from "../data/dungeon.json";

import DungeonScene from "../scenes/DungeonScene";
import Entity from "./Entity";

export default class Chest extends Entity {
  constructor(scene: DungeonScene, x: number, y: number) {
    super(scene, x, y, "");
    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    this.body.setSize(17, 12);
    this.body.setOffset(0, 6);
    this.body.setDrag(1000, 1000);
  }

  update() {
    if (!this.visible) return;
    let player = this.scene.player;
    let distance = Phaser.Math.Distance.BetweenPoints(player, this);
    if (
      (player.flipX ? this.x < player.x : this.x > player.x) &&
      distance < player.range &&
      player.weaponRotation != 0
    ) {
      for (let i = Math.random() * 5; i-- > 0; ) {
        this.scene.randomDrop(this.x + Math.random() * 5, this.y + Math.random() * 5);
      }
      this.destroy();
    } else if (distance < player.range) {
      this.play(keys.chest_full_open_anim, true);
    } else this.play(keys.chest_full_open_anim);
  }
}
