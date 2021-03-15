import Character from "../objects/Character";
import Player from "../objects/Player";

export default function dummyController(obj: Character, player: Player, distance: number) {
  if (
    (player.flipX ? obj.x < player.x : obj.x > player.x) &&
    distance < player.range &&
    player.weaponRotation != 0
  ) {
    obj.health = obj.health - player.damage;
    obj.scene.goreEmitter.emitParticleAt(obj.x, obj.y, 10);
  }
}
