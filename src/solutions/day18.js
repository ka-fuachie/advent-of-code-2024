import { anonymous as $, getInput } from "../utils.js";

let input = await getInput(18);

let maxSize = 70,
    minFallenAmount = 1024
let coords = input.trim().split("\n").map(line => line.split(",").map(Number))

let corruptedSpaces = new Set(coords.slice(0, minFallenAmount).map(c => c.join(",")))
let directionOffsets = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1]
]

let px = 0, py = 0

/** @type {Node[]} */
let prioQueue = [],
/** @type {Set<string>} */
    visited = new Set(),
/** @type {Node | null} */
    solution = null

prioQueue.push({x: px, y: py, steps: 0, parent: null})

while(prioQueue.length > 0) {
  let node = prioQueue.pop()
  
  if(node.x < 0 || node.x > maxSize) continue
  if(node.y < 0 || node.y > maxSize) continue

  if(node.x === maxSize && node.y === maxSize) {
    solution = node
    break
  }

  for(let offset of directionOffsets) {
    let childNode = {
      x: node.x + offset[0],
      y: node.y + offset[1],
      steps: node.steps + 1,
      parent: node
    }

    if(corruptedSpaces.has(`${childNode.x},${childNode.y}`)) continue

    if(visited.has(`${childNode.x},${childNode.y}`)) continue

    prioQueue.push(childNode)
  }

  visited.add(`${node.x},${node.y}`)

  prioQueue.sort((a, b) => (
    (b.steps * ((maxSize - b.x) + (maxSize - b.y))) -
    (a.steps * ((maxSize - a.x) + (maxSize - a.y)))
  ))
}

// display(solution, maxSize, corruptedSpaces, visited)
console.log(solution?.steps ?? Infinity)


while(minFallenAmount <= coords.length - 1) {
  prioQueue = []
  visited = new Set()
  solution = null

  corruptedSpaces = new Set(coords.slice(0, minFallenAmount).map(c => c.join(",")))
  prioQueue.push({x: px, y: py, steps: 0, parent: null})

  while(prioQueue.length > 0) {
    let node = prioQueue.pop()
    
    if(node.x < 0 || node.x > maxSize) continue
    if(node.y < 0 || node.y > maxSize) continue

    if(node.x === maxSize && node.y === maxSize) {
      solution = node
      break
    }

    for(let offset of directionOffsets) {
      let childNode = {
        x: node.x + offset[0],
        y: node.y + offset[1],
        steps: node.steps + 1,
        parent: node
      }

      if(corruptedSpaces.has(`${childNode.x},${childNode.y}`)) continue

      if(visited.has(`${childNode.x},${childNode.y}`)) continue

      prioQueue.push(childNode)
    }

    visited.add(`${node.x},${node.y}`)

    prioQueue.sort((a, b) => (
      (b.steps * ((maxSize - b.x) + (maxSize - b.y))) -
      (a.steps * ((maxSize - a.x) + (maxSize - a.y)))
    ))
  }

  if(solution == null) break

  minFallenAmount++
}

console.log(coords[minFallenAmount - 1].join(","))

/**
  * @typedef {Object} Node
  * @property {number} x
  * @property {number} y
  * @property {number} steps
  * @property {Node | null} parent
  */

/**
  * @param {Node} endNode
  * @param {number} maxSize
  * @param {Set<string>} corruptedSpaces
  * @param {Set<string>} visited
  */
function display(endNode, maxSize, corruptedSpaces, visited) {
  let pathStyle = (endNode.x === maxSize && endNode.y === maxSize)
    ? "\x1b[42m\x1b[30m": "\x1b[43m\x1b[30m"
  /** @type {Record<string, string>} */
  const DisplayStyle = {
    "#": "\x1b[47m",
    ".": "\x1b[0;90m",
    "*": pathStyle,
    "E": "\x1b[46m\x1b[30m",
    "S": "\x1b[41m\x1b[30m",
    "+": "\x1b[0;100m",
  }

  let map = Array.from({length: maxSize + 1}, (_,i) => (
    Array.from({length: maxSize + 1}, (_,j) => {
      if(corruptedSpaces.has(`${j},${i}`)) return "#"
      if(visited.has(`${j},${i}`)) return "+"
      return "."
    })
  ))

  let node = endNode
  while((node = node.parent) != null) {
    map[node.y][node.x] = "*"
  }

  map[0][0] = "S"
  map[maxSize][maxSize] = "E"

  for(let i = 0; i < map.length; i++) {
    for(let j = 0; j < map[i].length; j++) {
      let c = map[i][j]
      map[i][j] = `${DisplayStyle[c]}${c}\x1b[0m`
    }
  }

  console.log(map.map(row => row.join("")).join("\n"))
}
