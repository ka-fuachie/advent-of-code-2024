import { getInput } from "../utils.js";

let input = await getInput(20);
// input = `###############
// #...#...#.....#
// #.#.#.#.#.###.#
// #S#...#.#.#...#
// #######.#.#.###
// #######.#.#...#
// #######.#.###.#
// ###..E#...#...#
// ###.#######.###
// #...###...#...#
// #.#####.#.###.#
// #.#...#.#.#...#
// #.#.#.#.#.#.###
// #...#...#...###
// ###############`

let racetrack = input.trim().split("\n").map(row => row.split(""))

const directionOffsets = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1]
]

let startRow = -1, startColumn = -1,
    endRow = -1, endColumn = -1

for(let row = 0; row < racetrack.length; row++) {
  for(let column = 0; column < racetrack[row].length; column++) {
    if(racetrack[row][column] === "S") {
      startRow = row
      startColumn = column
    }
    if(racetrack[row][column] === "E") {
      endRow = row
      endColumn = column
    }
  }
}

let solution = bfs(
  racetrack,
  {row: startRow, column: startColumn, time: 0, parent: null},
  {row: endRow, column: endColumn},
)

console.log(solution)

let total100picosecsCheats = 0

let cheats = {}

let node = solution.parent
while(node != null) {
  console.log(node.time)

  for(let offset of directionOffsets) {
    let child = { row: node.row + offset[0], column: node.column + offset[1] }

    if(child.row < 0 || child.row >= racetrack.length) continue
    if(child.column < 0 || child.column >= racetrack[child.row].length) continue

    let newRacetrack = racetrack.map(row => [...row])
    newRacetrack[child.row][child.column] = "."

    let newSolution = bfs(
      newRacetrack,
      node,
      {row: endRow, column: endColumn},
    )

    let timeSaved = solution.time - newSolution.time

    // if(timeSaved > 0) {
    //   cheats[timeSaved] = (cheats[timeSaved] ?? 0) + 1
    // }
    
    if(timeSaved >= 100) {
      total100picosecsCheats++
    }
  }

  node = node.parent
}

console.log(total100picosecsCheats)
// console.log(cheats)

/**
  * @typedef {Object} Node
  * @property {number} row
  * @property {number} column
  * @property {number} time
  * @property {Node | null} parent
  */

/**
  * @param {string[][]} map
  * @param {Node} startNode
  * @param {Pick<Node, "row" | "column">} endNode
  * @param {Map<string, number>} [visited]
  */
function bfs(map, startNode, endNode, visited = new Map()) {
  /** @type {Node[]} */
  let queue = [],
  /** @type {Node | null} */
      solution = null

  queue.push(startNode)

  while(queue.length > 0) {
    let node = queue.shift()

    if(node.row < 0 || node.row >= map.length) continue
    if(node.column < 0 || node.column >= map[node.row].length) continue

    if(map[node.row][node.column] === "#") continue

    if(node.row === endNode.row && node.column === endNode.column) {
      solution = node
      break
    }

    for(let offset of directionOffsets) {
      let childNode = {
        row: node.row + offset[0],
        column: node.column + offset[1],
        time: node.time + 1,
        parent: node,
      }

      let visitedChildTime = visited.get(`${node.row},${node.column}`) ?? Infinity

      if(visitedChildTime < childNode.time) continue

      queue.push(childNode)
    }

    visited.set(`${node.row},${node.column}`, node.time)
  }

  return solution
}
