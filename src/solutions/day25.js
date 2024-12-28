import { getInput } from "../utils.js";

let input = await getInput(25);
// input = `#####
// .####
// .####
// .####
// .#.#.
// .#...
// .....
//
// #####
// ##.##
// .#.##
// ...##
// ...#.
// ...#.
// .....
//
// .....
// #....
// #....
// #...#
// #.#.#
// #.###
// #####
//
// .....
// .....
// #.#..
// ###..
// ###.#
// ###.#
// #####
//
// .....
// .....
// .....
// #....
// #.#..
// #.#.#
// #####`

let locks = [], keys = []
for(let schema of input.trim().split("\n\n").map(schema => schema.split("\n"))) {
  if(schema[0].includes("#")) {
    locks.push(
      Array.from({length: 5}, (_, i) => {
        for(let j = 5; j >= 0; j--) {
          if(schema[j][i] != "#") continue
          return j
        }
      })
    )
  } else {
    keys.push(
      Array.from({length: 5}, (_, i) => {
        for(let j = 0; j <= 5; j++) {
          if(schema[j + 1][i] != "#") continue
          return 5 - j
        }
      })
    )
  }
}

let totalFittingKeyLockPairs = 0
for(let lock of locks) {
  keyloop: for(let key of keys) {
    for(let i = 0; i < key.length; i++) {
      if(key[i] + lock[i] <= 5) continue
      continue keyloop
    }
    totalFittingKeyLockPairs++
  }
}

console.log(totalFittingKeyLockPairs)
