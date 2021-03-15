import "phaser";
import Character from "./Character";
import DungeonScene from "../scenes/DungeonScene";

// import chaserController from "../controllers/dummyController";
import chaserController from "../controllers/chaserController";
import necromancerController from "../controllers/necromancerController";
import skullController from "../controllers/skullController";
import shamanController from "../controllers/shamanController";

export default class Enemy extends Character {
  static createByName(scene: DungeonScene, x: number, y: number, name: string) {
    const diffMult = scene.game.dungeonSceneData.difficultyMultiplier;
    switch (name) {
      // big
      case "big_demon":
        return this.createBig(scene, x, y, "big_demon", chaserController, 50, 250 * diffMult);
      case "ogre":
        return this.createBig(scene, x, y, "ogre", chaserController, 50, 250 * diffMult);
      case "big_zombie":
        return this.createBig(scene, x, y, "big_zombie", chaserController, 50, 250 * diffMult);
      // medium
      case "orc":
        return this.create(scene, x, y, "orc", chaserController, 50, 200 * diffMult);
      case "necromancer":
        return this.create(scene, x, y, "necromancer", necromancerController, 50, 200 * diffMult);
      case "skelet":
        return this.create(scene, x, y, "skelet", chaserController, 50, 200 * diffMult);
      case "wogol":
        return this.create(scene, x, y, "wogol", chaserController, 50, 200 * diffMult);
      case "orc_warrior":
        return this.create(scene, x, y, "orc_warrior", chaserController, 50, 200 * diffMult);
      case "orc_shaman":
        return this.create(scene, x, y, "orc_shaman", shamanController, 50, 200 * diffMult);
      case "masked_orc":
        return this.create(scene, x, y, "masked_orc", chaserController, 50, 200 * diffMult);
      case "chort":
        return this.create(scene, x, y, "chort", chaserController, 50, 200 * diffMult);
      // small
      case "zombie":
        return this.createSmall(scene, x, y, "zombie", chaserController, 50, 150 * diffMult);
      case "ice_zombie":
        return this.createSmall(scene, x, y, "ice_zombie", chaserController, 50, 150 * diffMult);
      // wide
      case "muddy":
        return this.createWide(scene, x, y, "muddy", chaserController, 50, 100 * diffMult);
      case "swampy":
        return this.createWide(scene, x, y, "swampy", chaserController, 50, 100 * diffMult);
      // tiny
      case "imp":
        return this.createTiny(scene, x, y, "imp", chaserController, 50, 50 * diffMult);
      case "goblin":
        return this.createTiny(scene, x, y, "goblin", chaserController, 50, 50 * diffMult);
      case "tiny_zombie":
        return this.createTiny(scene, x, y, "tiny_zombie", chaserController, 50, 50 * diffMult);
      // ghost
      case "skull":
        return this.createGhost(scene, x, y, "skull", skullController, 100, 10 * diffMult);
    }
  }

  beforeDestroy() {
    if (Math.random() < this.scene.game.dungeonSceneData.dropRate) {
      this.scene.randomDrop(this.x, this.y + 10);
    }
  }
}
