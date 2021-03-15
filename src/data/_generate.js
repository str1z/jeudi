const fs = require("fs");

const raw = fs.readFileSync("src/data/dungeon.txt", { encoding: "utf8" });
const tiles = raw.split(/\n+/);
const splittedTiles = tiles.map((t) => t.split(/ +/g));

const frames = {};
const anims = [];
const keys = {};

for (let [key, ...args] of splittedTiles) {
  keys[key] = key;
  const [x, y, w, h, ...animMods] = args.map((n) => (/^\d+$/.test(n) ? +n : n));
  const anim = { end: 1, key };
  if (typeof animMods[0] == "number") anim.end = +animMods.shift();
  for (let animMod of animMods) {
    const [kind, value] = animMod.split("=");
    anim[kind] = +value;
  }
  anims.push(anim);
  for (let i = 0; i < anim.end; i++) {
    const frame = { x: x + w * i, y, w, h };
    frames[key + i] = { frame };
  }
}

const atlas = { frames };
fs.writeFileSync("src/data/dungeon.json", JSON.stringify({ atlas, anims, keys }));
