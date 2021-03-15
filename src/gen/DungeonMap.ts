import "phaser";

import MazeTree from "./DungeonTree";
import StateMap from "./StateMap";
import { keys } from "../data/dungeon.json";
import DungeonNode from "./DungeonNode";

interface DungeonMapConfig {
  width: number;
  height: number;
  entranceSize: number;
  minRoomWidth: number;
  minRoomHeight: number;
  dungeonSeed: string;
  enemiesPerRoom: number;
  chestSpawnRate: number;
}

interface Tile {
  x: number;
  y: number;
  key: string;
}

interface Enemy {
  x: number;
  y: number;
  name: string;
}

interface Vec2 {
  x: number;
  y: number;
}

export default class DungeonMap {
  random: Phaser.Math.RandomDataGenerator;
  width: number;
  height: number;
  entranceSize: number;
  tree: MazeTree;
  wallMap: StateMap;
  floorMap: StateMap;
  tiles: Tile[];
  enemies: Enemy[];
  chests: Vec2[];
  princess: Vec2;
  chestSpawnRate: number;
  enemiesPerRoom: number;
  dungeonSeed: string;

  constructor(config: DungeonMapConfig) {
    this.chestSpawnRate = config.chestSpawnRate;
    this.enemiesPerRoom = config.enemiesPerRoom;
    this.width = config.width;
    this.height = config.height;
    this.entranceSize = config.entranceSize;
    this.dungeonSeed = config.dungeonSeed;
    this.random = new Phaser.Math.RandomDataGenerator([config.dungeonSeed]);
    this.tree = new MazeTree({ ...config, random: this.random });
    this.enemies = [];
    this.chests = [];

    this.generateFloorMap();
    this.generateWallMap();
    // this.printWallMap();
  }

  randomNodeXY(node) {
    return {
      x: this.random.between(node.x + 2, node.x + node.width - 2),
      y: this.random.between(node.y + 2, node.y + node.height - 2),
    };
  }

  generateFloorMap() {
    this.floorMap = new StateMap(this.width, this.height);
    this.floorMap.forAll((_, x: number, y: number) => {
      this.floorMap.set(
        x,
        y,
        this.random.weightedPick([
          keys.floor_1,
          keys.floor_1,
          keys.floor_1,
          keys.floor_2,
          keys.floor_2,
          keys.floor_3,
          keys.floor_4,
          keys.floor_5,
          keys.floor_6,
          keys.floor_7,
          keys.floor_8,
        ])
      );
    });
  }

  generateWallMap() {
    this.wallMap = new StateMap(this.width, this.height);
    let nodes: DungeonNode[] = [];
    this.tree.traverse((node) => nodes.push(node));
    nodes = this.random.shuffle(nodes);
    for (let node of nodes) {
      if (node.split) {
        if (node.wallType == MazeTree.HORIZONTAL) {
          const wallY = node.y + node.split;
          this.wallMap.fillRect(node.x + 1, wallY, node.gap - 1, 1, keys.block);
          const wall1Width = node.width - node.gap - this.entranceSize;
          this.wallMap.fillRect(
            node.x + node.gap + this.entranceSize,
            wallY,
            wall1Width,
            1,
            keys.block
          );
        } else {
          const wallX = node.x + node.split;
          this.wallMap.fillRect(wallX, node.y, 1, node.gap, keys.block);
          const wall1Height = node.height - node.gap - this.entranceSize;
          this.wallMap.fillRect(
            wallX,
            node.y + node.gap + this.entranceSize,
            1,
            wall1Height,
            keys.block
          );
        }
      } else {
        for (let i = this.enemiesPerRoom; i-- > 0; )
          this.enemies.push({
            ...this.randomNodeXY(node),
            name: this.random.pick([
              "big_demon",
              "big_zombie",
              "ogre",
              "zombie",
              "necromancer",
              "skelet",
              "wogol",
              "orc_warrior",
              "orc_shaman",
              "chort",
              "ice_zombie",
              "muddy",
              "swampy",
              "masked_orc",
              "imp",
              "tiny_zombie",
              "goblin",
            ]),
          });
        if (this.random.frac() < this.chestSpawnRate) this.chests.push(this.randomNodeXY(node));
      }
    }
    this.wallMap.fillRect(0, 0, this.width, 1, keys.block);
    this.wallMap.fillRect(0, 0, 1, this.height, keys.block);
    this.wallMap.fillRect(0, this.height - 1, this.width, 1, keys.block);
    this.wallMap.fillRect(this.width - 1, 0, 1, this.height, keys.block);
    this.princess = this.randomNodeXY(nodes[0]);
  }

  printWallMap() {
    console.log(this);
    let str = "";
    for (let row of this.wallMap.data) {
      for (let char of row) str += char ? "8" : " ";
      str += "\n";
    }
    console.log(str);
  }
}
