import "phaser";

export default function createAnims(scene: Phaser.Scene, spriteKey: string, anims: Array<any>) {
  for (let anim of anims)
    scene.anims.create({
      repeat: 0,
      frameRate: 8,
      ...anim,
      frames: scene.anims.generateFrameNames(spriteKey, {
        end: anim.end - 1,
        prefix: anim.key,
      }),
    });
}
