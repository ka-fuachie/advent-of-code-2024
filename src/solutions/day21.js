import { getInput } from "../utils.js";

let input = await getInput(21);
// input = `029A
// 980A
// 179A
// 456A
// 379A`

const directionOffsets = {
  "^": [-1, 0],
  ">": [0, 1],
  "v": [1, 0],
  "<": [0, -1],
}

let codes = input.trim().split("\n")

let numericKeymap = ["789", "456", "123", ".0A"],
    arrowKeymap = [".^A", "<v>"]

let totalComplexities = 0
for(let code of codes) {
  let robot1Sequence = code,
      robot2Sequence = getSequence(robot1Sequence, numericKeymap),
      robot3Sequence = getSequence(robot2Sequence, arrowKeymap),
      mySequence = getSequence(robot3Sequence, arrowKeymap)

  console.log(code, mySequence)

  let complexity = mySequence.length * Number(code.match(/\d+/)[0])
  totalComplexities += complexity
}

console.log(totalComplexities)

// totalComplexities = 0
// for(let code of codes) {
//   let robot1Sequence = code,
//       keypadRobotSequence
//
//   for(let i = 0; i < 25; i++) {
//     console.log(i, (keypadRobotSequence ?? robot1Sequence).length)
//     keypadRobotSequence = keypadRobotSequence == null
//       ? getSequence(robot1Sequence, numericKeymap)
//       : getSequence(keypadRobotSequence, arrowKeymap)
//   }
//
//   let mySequence = getSequence(keypadRobotSequence, arrowKeymap)
//
//   console.log(code, mySequence)
//
//   let complexity = mySequence.length * Number(code.match(/\d+/)[0])
//   totalComplexities += complexity
// }
//
// console.log(totalComplexities)

/**
  * @typedef {Object} Node
  * @property {number} row
  * @property {number} column
  * @property {string | null} direction
  * @property {Node | null} parent
  */

/**
  * @param {string} code
  * @param {string[]} targetKeymap
  */
function getSequence(code, targetKeymap) {
  let sequence = ""
  let currentPos = getKeyPos("A", targetKeymap)
  let emptyPos = getKeyPos(".", targetKeymap)

  for(let char of code) {
    let pos = getKeyPos(char, targetKeymap)
    let diff = [
      currentPos[0] - pos[0],
      currentPos[1] - pos[1]
    ]
    let verticalFirst = false
    if(diff[1] < 0) verticalFirst = true
    if((currentPos[0] === emptyPos[0]) && (pos[1] === emptyPos[1])) verticalFirst = true
    if((currentPos[1] === emptyPos[1]) && (pos[0] === emptyPos[0])) verticalFirst = false

    if(verticalFirst) {
      // console.log(targetKeymap[currentPos[0]][currentPos[1]], "=>", targetKeymap[pos[0]][pos[1]])
      sequence += (diff[0] > 0 ? "^": "v").repeat(Math.abs(diff[0]))
      sequence += (diff[1] > 0 ? "<": ">").repeat(Math.abs(diff[1]))
    } else {
      sequence += (diff[1] > 0 ? "<": ">").repeat(Math.abs(diff[1]))
      sequence += (diff[0] > 0 ? "^": "v").repeat(Math.abs(diff[0]))
    }

    sequence += "A"
    currentPos = pos
  }

  return sequence
}

/**
  * @param {string} key
  * @param {string[]} keymap
  */
function getKeyPos(key, keymap) {
  for(let i = 0; i < keymap.length; i++) {
    for(let j = 0; j < keymap[i].length; j++) {
      if(keymap[i][j] !== key) continue
      return [i, j]
    }
  }

  return [-1, -1]
}

/**
  * @param {string[]} map
  * @param {[number, number]} startPos
  * @param {[number, number]} endPos
  * @param {Set<string>} [visited]
  */
function bfs(map, startPos, endPos, visited = new Set()) {
  /** @type {Node[]} */
  let queue = [],
  /** @type {Node | null} */
      solution = null

  queue.push({
    row: startPos[0],
    column: startPos[0],
    direction: null,
    parent: null,
  })

  while(queue.length > 0) {
    let node = queue.shift()

    if(node.row < 0 || node.row >= map.length) continue
    if(node.column < 0 || node.column >= map[node.row].length) continue

    if(map[node.row][node.column] === ".") continue

    if(node.row === endPos[0] && node.column === endPos[1]) {
      solution = node
      break
    }

    for(let direction of Object.keys(directionOffsets)) {
      let offset = directionOffsets[direction]

      let childNode = {
        row: node.row + offset[0],
        column: node.column + offset[1],
        direction,
        parent: node,
      }

      if(visited.has(`${node.row},${node.column}`)) continue

      queue.push(childNode)
    }

    visited.add(`${node.row},${node.column}`)
  }

  return solution
}
