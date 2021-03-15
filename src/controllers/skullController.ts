import Enemy from "../objects/Enemy";

import handleHealth from "./handleHealth";

export default function skullController(obj: Enemy) {
  if (!obj.custom.wantedVelocity) obj.custom.wantedVelocity = new Phaser.Math.Vector2(0, 0);
  let distance = Phaser.Math.Distance.BetweenPoints(obj.scene.player, obj);
  let player = obj.scene.player;
  // attack player
  if (distance < 10) {
    player.health = player.health - 0.5;
    obj.scene.goreEmitter.emitParticleAt(player.x, player.y, 1);
  } // follow the player
  obj.custom.wantedVelocity = player.body.position
    .clone()
    .subtract(obj.body.position)
    .normalize()
    .scale(obj.speed);

  // handle health
  handleHealth(obj, player, distance);
  // other
  obj.body.velocity = obj.custom.wantedVelocity.clone();
  obj.updateDirection();
}
