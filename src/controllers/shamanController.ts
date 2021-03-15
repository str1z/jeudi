import Enemy from "../objects/Enemy";

import handleHealth from "./handleHealth";

export default function chaserController(obj: Enemy) {
  if (!obj.custom.wantedVelocity) obj.custom.wantedVelocity = new Phaser.Math.Vector2(0, 0);
  let distance = Phaser.Math.Distance.BetweenPoints(obj.scene.player, obj);
  let player = obj.scene.player;
  // summon skulls
  if (distance < 100) {
    if (Math.random() < 0.01) {
      Enemy.createByName(obj.scene, obj.x, obj.y, "skull");
    }
  }
  // follow the player
  else if (distance < 150) {
    obj.custom.wantedVelocity = player.body.position
      .clone()
      .subtract(obj.body.position)
      .normalize()
      .scale(obj.speed);
  }
  // random walk
  else if (Math.random() < 0.01) {
    Phaser.Math.RandomXY(obj.custom.wantedVelocity, obj.speed);
  }
  // handle health
  handleHealth(obj, player, distance);
  // other
  obj.body.velocity = obj.custom.wantedVelocity.clone();
  obj.updateDirection();
}
