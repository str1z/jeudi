import Enemy from "../objects/Enemy";

import handleHealth from "./handleHealth";

export default function chaserController(obj: Enemy, distance: number) {
  if (!obj.custom.wantedVelocity) obj.custom.wantedVelocity = new Phaser.Math.Vector2(0, 0);
  
  let player = obj.scene.player;
  // attack player
  if (distance < 20) {
    player.health = player.health - 1;
    obj.scene.goreEmitter.emitParticleAt(player.x, player.y, 1);
  } // follow the player
  else if (distance < 100) {
    obj.custom.wantedVelocity = player.body.position
      .clone()
      .subtract(obj.body.position)
      .normalize()
      .scale(obj.speed);
  } // random walk
  else if (Math.random() > 0.99) {
    Phaser.Math.RandomXY(obj.custom.wantedVelocity, obj.speed);
  }
  // handle health
  handleHealth(obj, player, distance);
  // other
  obj.body.velocity = obj.custom.wantedVelocity.clone();
  obj.updateDirection();
}
