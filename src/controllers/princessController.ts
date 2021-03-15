import Enemy from "../objects/Enemy";
import handleHealth from "./handleHealth";

export default function princessController(obj: Enemy) {
  if (!obj.custom.wantedVelocity) obj.custom.wantedVelocity = new Phaser.Math.Vector2(0, 0);
  let distance = Phaser.Math.Distance.BetweenPoints(obj.scene.player, obj);
  let player = obj.scene.player;
  // follow the player
  if (distance < 100) {
    obj.custom.wantedVelocity = player.body.position
      .clone()
      .subtract(obj.body.position)
      .normalize()
      .scale(obj.speed);
  } // random walk
  else if (Math.random() > 0.99) {
    Phaser.Math.RandomXY(obj.custom.wantedVelocity, obj.speed * 3);
  }
  // handle health
  handleHealth(obj, player, distance);
  // other
  obj.body.velocity = obj.custom.wantedVelocity.clone();
  obj.updateDirection();
}
