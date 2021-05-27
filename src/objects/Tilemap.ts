import "phaser";

export default class Tilemap extends Phaser.GameObjects.RenderTexture {
	constructor(scene: Phaser.Scene, layout: string[][], size = 16, offX = 0, offY = -8) {
		const height = layout.length
		const width = layout[0].length
		super(scene, offX, offY, height * size, width * size);
		scene.add.existing(this);
		this.beginDraw();
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const anim = layout[y][x];
				if (anim) this.batchDrawFrame("dungeon", anim + "0", x * size, y * size);
			}
		}
		this.endDraw();
	}
}
