import "phaser";

export default class Tile extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;
  constructor(scene: Phaser.Scene, x: number, y: number, anim: string) {
    super(scene, x, y, "");
    if (anim) this.play(anim);
    this.depth = this.y + 24;
  }

  updateVisible() {
    const inView = Phaser.Geom.Rectangle.Overlaps(
      this.scene.cameras.main.worldView,
      this.getBounds()
    );
    if (inView != this.visible) this.visible = inView;
  }
}
