import Tile from "../objects/Tile";

export default function createTilemap(
  group: Phaser.GameObjects.Group,
  layout: Array<Array<string>>,
  size = 16,
  offX = 0,
  offY = 0,
  deepest = false
) {
  for (let y = 0; y < layout.length; y++) {
    for (let x = 0; x < layout[y].length; x++) {
      const anim = layout[y][x];
      const tile = new Tile(group.scene, offX + x * size, offY + y * size, anim);
      if (deepest) tile.depth = -1000;
      if (anim) group.add(tile, true);
    }
  }
}
