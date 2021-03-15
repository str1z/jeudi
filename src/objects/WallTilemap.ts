import "phaser";

import createTilemap from "../utils/createTilemap";
import Tile from "./Tile";

export default class WallTilemap extends Phaser.Physics.Arcade.StaticGroup {
  constructor(scene: Phaser.Scene, layout: string[][], size = 16, offX = 8, offY = 8) {
    super(scene.physics.world, scene);
    createTilemap(this, layout, size, offX, offY);
    this.children.each((tile: Tile) => {
      tile.body.setSize(16, 24);
      tile.body.setOffset(0, 8);
    });
  }
}
