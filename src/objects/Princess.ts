import "phaser";
import Character from "./Character";
import princessController from "../controllers/princessController";
import DungeonScene from "../scenes/DungeonScene";

export default class Princess extends Character {
  constructor(scene: DungeonScene, x: number, y: number) {
    super(scene, x, y, 12, 8, 3, 20, "elf_f", princessController, 50, 500);
  }
  beforeDestroy() {
    this.scene.gameOver("You killed the princess");
  }
}
