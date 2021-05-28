import Enemy from "../objects/Enemy";

import handleHealth from "./handleHealth";

const summons = ["imp", "goblin", "tiny_zombie"];

export default function chaserController(obj: Enemy, distance: number) {
  if (!obj.custom.wantedVelocity) obj.custom.wantedVelocity = new Phaser.Math.Vector2(0, 0);
  let player = obj.scene.player;
  // summon enemies
  if (distance < 100) {
    if (Math.random() < 0.01) {
      const i = Math.floor(Math.random() * 3);
      Enemy.createByName(obj.scene, obj.x, obj.y, summons[i]);
    }
    // runaway
    // obj.custom.wantedVelocity = obj.custom.wantedVelocity = player.body.position
    //   .clone()
    //   .subtract(obj.body.position)
    //   .normalize()
    //   .scale(-obj.speed);
  } // follow the player
  else if (distance < 150) {
    obj.custom.wantedVelocity = player.body.position
      .clone()
      .subtract(obj.body.position)
      .normalize()
      .scale(obj.speed);
  } // random walk
  else if (Math.random() < 0.01) {
    Phaser.Math.RandomXY(obj.custom.wantedVelocity, obj.speed);
  }
  // handle health
  handleHealth(obj, player, distance);
  // other
  obj.body.velocity = obj.custom.wantedVelocity.clone();
  obj.updateDirection();
}
