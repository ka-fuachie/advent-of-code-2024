import { getInput } from "../utils.js";

let input = await getInput(16);

const directions = ["^", ">", "v", "<"]
/** @type {Record<string, number[]>} */
const directionOffsets = {
  "^": [-1, 0],
  ">": [0, 1],
  "v": [1, 0],
  "<": [0, -1]
}
/** @type {Record<string, string>} */
const oppositeDirections = {
  ">": "<",
  "<": ">",
  "^": "v",
  "v": "^"
}

let maze = input
  .split("\n")
  .filter(line => line != "")
  .map(line => line.split("").filter(c => c != ""))

let startRow = -1, startColumn = -1,
    endRow = -1, endColumn = -1,
    startDirection = ">"
for(let row = 0; row < maze.length; row++) {
  for(let column = 0; column < maze[row].length; column++) {
    if(startRow != -1 && endRow != -1) break
    if(maze[row][column] === "S") {
      startRow = row
      startColumn = column
    }
    if(maze[row][column] === "E") {
      endRow = row
      endColumn = column
    }
  }
}

let prioQueue = [
  getNode(startRow, startColumn, startDirection, 0)
],
    visited = new Map()
let lowestCost = Infinity

while(prioQueue.length > 0) {
  let node = prioQueue.shift()

  if(node.row === endRow && node.column === endColumn) {
    lowestCost = Math.min(node.cost, lowestCost)
    continue
  }

  if(lowestCost < node.cost) continue

  for(let direction of directions) {
    let offsets = directionOffsets[direction]
    let childRow = node.row + offsets[0],
        childColumn = node.column + offsets[1]

    if(childRow < 0 || childRow >= maze.length) continue
    if(childColumn < 0 || childColumn >= maze[childRow].length) continue
    if(maze[childRow][childColumn] === "#") continue

    let additionalCost = 1 + getRotationCost(node.direction, direction)

    if(additionalCost >= 2000 && node.cost > 0) continue

    let childCost = node.cost + additionalCost
    let visitedChildCost = visited.get(`${childRow}|${childColumn}|${direction}`) ?? Infinity
    if(visitedChildCost < childCost) continue

    prioQueue.push(
      getNode(
        childRow,
        childColumn,
        direction,
        childCost,
        node
      )
    )
  }
  visited.set(`${node.row}|${node.column}|${node.direction}`, node.cost)

  prioQueue.sort((a, b) => a.cost - b.cost)
}

console.log(lowestCost)

prioQueue = [
  getNode(startRow, startColumn, startDirection, 0)
],
visited = new Map()
lowestCost = Infinity

let solutions = []

while(prioQueue.length > 0) {
  let node = prioQueue.shift()

  if(node.row === endRow && node.column === endColumn) {
    lowestCost = Math.min(node.cost, lowestCost)
    solutions.push(node)
    continue
  }

  if(lowestCost < node.cost) continue

  for(let direction of directions) {
    let offsets = directionOffsets[direction]
    let childRow = node.row + offsets[0],
        childColumn = node.column + offsets[1]

    if(childRow < 0 || childRow >= maze.length) continue
    if(childColumn < 0 || childColumn >= maze[childRow].length) continue
    if(maze[childRow][childColumn] === "#") continue

    let additionalCost = 1 + getRotationCost(node.direction, direction)

    if(additionalCost >= 2000 && node.cost > 0) continue

    let childCost = node.cost + additionalCost
    let visitedChildCost = visited.get(`${childRow}|${childColumn}|${direction}`) ?? Infinity
    if(visitedChildCost < childCost) continue

    prioQueue.push(
      getNode(
        childRow,
        childColumn,
        direction,
        childCost,
        node
      )
    )
  }
  visited.set(`${node.row}|${node.column}|${node.direction}`, node.cost)

  prioQueue.sort((a, b) => a.cost - b.cost)
}

let bestPathsNodes = new Set()
for(let solution of solutions) {
  let node = solution
  bestPathsNodes.add(`${node.row}|${node.column}`)

  while((node = node.parent) != null) {
    bestPathsNodes.add(`${node.row}|${node.column}`)
  }
}
console.log(bestPathsNodes.size)

/**
  * @param {string[][]} map
  * @param {Node} endNode
  * @param {Map<string, number>} visited
  */
function display(map, endNode, visited) {
  let solutionStyle = "\x1b[42m\x1b[30m",
      pathStyle = (endNode.row === endRow && endNode.column === endColumn)
        ? solutionStyle: "\x1b[43m\x1b[30m"
  /** @type {Record<string, string>} */
  const DisplayStyle = {
    "#": "\x1b[47m",
    ".": "\x1b[0;90m",
    ">": pathStyle,
    "v": pathStyle,
    "<": pathStyle,
    "^": pathStyle,
    "E": solutionStyle,
    "S": "\x1b[41m\x1b[30m",
    "+": "\x1b[0;100m",
  }

  let displayMap = map.map(row => [...row])
  let node = endNode
  while((node = node.parent) != null) {
    displayMap[node.row][node.column] = node.direction
  }
  displayMap[endNode.row][endNode.column] = endNode.direction
  displayMap[startRow][startColumn] = "S"
  displayMap[endRow][endColumn] = "E"

  for(let node of visited.keys()) {
    let [r,c] = node.split("|").map(Number)
    if(displayMap[r][c] != ".") continue
    displayMap[r][c] = "+"
  }

  for(let i = 0; i < displayMap.length; i++) {
    for(let j = 0; j < displayMap[i].length; j++) {
      let c = displayMap[i][j]
      displayMap[i][j] = `${DisplayStyle[c]}${c}\x1b[0m`
    }
  }

  console.log(displayMap.map(row => row.join("")).join("\n"))
}

/**
  * @typedef {Object} Node
  * @property {number} row
  * @property {number} column
  * @property {number} cost
  * @property {string} direction
  * @property {Node | null} parent
  */

/**
  * @param {string} direction
  * @param {string} newDirection
  */
function getRotationCost(direction, newDirection) {
  if(direction === newDirection) return 0
  if(direction === oppositeDirections[newDirection]) return 2000
  return 1000
}

/**
  * @param {Node["row"]} row
  * @param {Node["column"]} column
  * @param {Node["direction"]} direction
  * @param {Node["cost"]} cost
  * @param {Node["parent"]} [parent]
  */
function getNode(row, column, direction, cost, parent = null) {
  return { row, column, direction, cost, parent }
}
