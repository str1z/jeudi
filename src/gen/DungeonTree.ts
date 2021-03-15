import "phaser";

import DungeonNode from "./DungeonNode";

const HORIZONTAL = Symbol("HORIZONTAL");
const VERTICAL = Symbol("VERTICAL");

interface MazeTreeConfig {
  width: number;
  height: number;
  entranceSize: number;
  minRoomWidth: number;
  minRoomHeight: number;
  random: Phaser.Math.RandomDataGenerator;
}

export default class MazeTree {
  static HORIZONTAL = HORIZONTAL;
  static VERTICAL = VERTICAL;

  random: Phaser.Math.RandomDataGenerator;
  width: number;
  height: number;
  minRoomWidth: number;
  minRoomHeight: number;
  entranceSize: number;
  node: DungeonNode;

  constructor(config: MazeTreeConfig) {
    this.random = config.random;
    this.width = config.width;
    this.height = config.height;
    this.minRoomWidth = config.minRoomWidth;
    this.minRoomHeight = config.minRoomHeight;
    this.entranceSize = config.entranceSize;
    this.node = { x: 0, y: 0, width: this.width, height: this.height, parent: null };
    this.divideNode(this.node);
  }
  setNodeAxis(node: DungeonNode) {
    if (node.width < node.height) node.wallType = HORIZONTAL;
    else if (node.height < node.width) node.wallType = VERTICAL;
    else node.wallType = this.random.pick([HORIZONTAL, VERTICAL]);
  }
  // setNodeAxis(node: DungeonNode) {
  //   if (!node.parent) node.wallType = this.random.pick([HORIZONTAL, VERTICAL]);
  //   else node.wallType = node.parent.wallType == HORIZONTAL ? VERTICAL : HORIZONTAL;
  // }
  createUpDownNodes(node: DungeonNode) {
    node.node0 = {
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.split,
      parent: node,
    };
    node.node1 = {
      x: node.x,
      y: node.y + node.split,
      width: node.width,
      height: node.height - node.split,
      parent: node,
    };
  }
  createLeftRightNodes(node: DungeonNode) {
    node.node0 = {
      x: node.x,
      y: node.y,
      width: node.split,
      height: node.height,
      parent: node,
    };
    node.node1 = {
      x: node.x + node.split,
      y: node.y,
      width: node.width - node.split,
      height: node.height,
      parent: node,
    };
  }
  createAndDevideChildNodes(node: DungeonNode) {
    if (node.wallType == HORIZONTAL) this.createUpDownNodes(node);
    else this.createLeftRightNodes(node);
    this.divideNode(node.node0);
    this.divideNode(node.node1);
  }

  divideNode(node: DungeonNode) {
    this.setNodeAxis(node);
    let splitRange, gapRange, minRoom;
    if (node.wallType == HORIZONTAL) {
      splitRange = node.height;
      minRoom = this.minRoomHeight;
      gapRange = node.width;
    } else {
      splitRange = node.width;
      minRoom = this.minRoomWidth;
      gapRange = node.height;
    }
    if (splitRange < minRoom * 2) return;

    if (!node.parent || node.wallType == node.parent.wallType)
      node.split = this.random.integerInRange(minRoom, splitRange - minRoom);
    else {
      const isPreLonger = node.parent.gap > splitRange - node.parent.gap + this.entranceSize;
      if (isPreLonger) {
        node.split = this.random.integerInRange(minRoom, node.parent.gap);
      } else {
        node.split = this.random.integerInRange(
          node.parent.gap + this.entranceSize,
          splitRange - minRoom + 1
        );
      }
    }
    node.gap = this.random.integerInRange(0, gapRange - this.entranceSize - 1);
    this.createAndDevideChildNodes(node);
  }
  traverseNode(node: DungeonNode, fn: (node: DungeonNode) => void) {
    fn(node);
    if (node.node0) this.traverseNode(node.node0, fn);
    if (node.node1) this.traverseNode(node.node1, fn);
  }
  traverse(fn: (node: DungeonNode) => void) {
    this.traverseNode(this.node, fn);
  }
}
