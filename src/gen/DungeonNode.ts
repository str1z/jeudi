export default interface DungeonNode {
  // position
  x: number;
  y: number;
  // dimension
  width: number;
  height: number;
  // which axis
  wallType?: Symbol;
  // at which x or y did we split with a wall
  split?: number;
  // at which x or y did we add a gap in the wall
  gap?: number;
  // yep yep recursive
  node0?: DungeonNode;
  node1?: DungeonNode;
  parent: DungeonNode;
}

/*

So we basically start by choosing the axis we want to split
it depends just on the shape

we then add a wall and a gap in the the wall
then we creat to new nodes at each side of the wall which is the split
we repeat the process recursively for the two nodes

*/
