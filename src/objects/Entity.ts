import "phaser";
import { anims, atlas, keys } from "../data/dungeon.json";

import DungeonScene from "../scenes/DungeonScene";

export default class Entity extends Phaser.GameObjects.Sprite {
  _scene: DungeonScene;
  scene: DungeonScene;
  body: Phaser.Physics.Arcade.Body;
  constructor(scene: DungeonScene, x: number, y: number, tex = "") {
    super(scene, x, y, tex);
    this._scene = scene;
    scene.entities.add(this, true);
  }
  updateVisible() {
    const inView = Phaser.Geom.Rectangle.Overlaps(
      this.scene.cameras.main.worldView,
      this.getBounds()
    );
    if (inView != this.visible) {
      this.visible = inView;
    }
  }
}
