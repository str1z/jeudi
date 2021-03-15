import "phaser";

import createTilemap from "../utils/createTilemap";

export default class FloorTilemap extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene, layout: string[][], size = 16, offX = 8, offY = 0) {
    super(scene);
    createTilemap(this, layout, size, offX, offY, true);
  }
}
