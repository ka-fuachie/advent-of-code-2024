import { getInput } from "../utils.js";

let input = await getInput(6);

const OBSTACLE = "#"
const GUARD_UP = "^"
const GUARD_DOWN = "v"
const GUARD_LEFT = "<"
const GUARD_RIGHT = ">"
const OPEN = "."

const visitedNodeRegExp = /\[(\d+),\s(\d+)\]/

let labMap = input.split("\n").filter(line => line != "")

let [
  guardState,
  guardRow,
  guardColumn
] = getGuardInitialStateAndPosition(labMap)

const handleGurdUp = getStateHandler(
  GUARD_UP,
  GUARD_RIGHT,
  -1,0
)
const handleGurdRight = getStateHandler(
  GUARD_RIGHT,
  GUARD_DOWN,
  0,1
)
const handleGurdDown = getStateHandler(
  GUARD_DOWN,
  GUARD_LEFT,
  1,0
)
const handleGurdLeft = getStateHandler(
  GUARD_LEFT,
  GUARD_UP,
  0,-1
)

let visited = new Set(),
    obstaclesApproached = new Set()

while(true) {
  visited.add(getVisitedNode(guardRow, guardColumn));
  [guardRow, guardColumn, guardState] = (
    handleGurdUp(labMap, guardRow, guardColumn, guardState) ??
    handleGurdRight(labMap, guardRow, guardColumn, guardState) ??
    handleGurdDown(labMap, guardRow, guardColumn, guardState) ??
    handleGurdLeft(labMap, guardRow, guardColumn, guardState)
  )

  if(guardState == null) break
}

console.log(visited.size);

let totalLoopPossiblities = 0

for(let visitedNode of visited.values()) {
  let [row,column] = getPositionFromVisitedNode(visitedNode)

  obstaclesApproached = new Set();
  [guardState, guardRow, guardColumn] = (
    getGuardInitialStateAndPosition(labMap)
  )
  if(row === guardRow && column === guardColumn) continue

  let newMap = labMap.map((line, i) => {
    if(i != row) return line
    return line
      .split("")
      .map((char, j) => {
        if(j != column) return char
        return OBSTACLE
      })
      .join("")
  })

  while(true) {
    [guardRow, guardColumn, guardState] = (
      handleGurdUp(newMap, guardRow, guardColumn, guardState) ??
      handleGurdRight(newMap, guardRow, guardColumn, guardState) ??
      handleGurdDown(newMap, guardRow, guardColumn, guardState) ??
      handleGurdLeft(newMap, guardRow, guardColumn, guardState)
    )

    if(guardState != null) continue
    if(guardRow === -1 || guardColumn === -1) break
    totalLoopPossiblities++
    break
  }
}

console.log(totalLoopPossiblities)

/** @param {string[]} map */
function getGuardInitialStateAndPosition(map) {
  let state = "", row = -1, column = -1
  for(let i = 0; i < map.length; i++) {
    for(let j = 0; j < map[i].length; j++) {
      let char = map[i][j]
      if(![GUARD_UP, GUARD_DOWN, GUARD_LEFT, GUARD_RIGHT].includes(char)) continue

      state = char
      row = i
      column = j
    }
  }

  return /** @type {const} */([state, row, column])
}

/**
  * @param {string} state
  * @param {string} nextState
  * @param {number} rowIncrement
  * @param {number} columnIncrement
  */
function getStateHandler(state, nextState, rowIncrement, columnIncrement) {
  /**
    * @param {string[]} map
    * @param {number} row
    * @param {number} column
    * @param {string} currentState
    * @returns {[number, number, string|null]}
    */
  return (map, row, column, currentState) => {
    if(state !== currentState) return

    let nextChar = (
      map[row + rowIncrement]?.[column + columnIncrement]
    )

    if(nextChar == null) return [-1, -1, null]

    if(!isObstacle(nextChar)) {
      return [
        row + rowIncrement,
        column + columnIncrement,
        currentState
      ]
    }

    const obstacleApproachNode = (
      getApproachNode(row, column, currentState)
    )
    if(obstaclesApproached.has(obstacleApproachNode)) {
      return [row, column, null]
    }
    obstaclesApproached.add(obstacleApproachNode)
    return [row, column, nextState]
  }
}

/**
  * @param {number} row
  * @param {number} column
  */
function getVisitedNode(row,column) {
  return `[${column}, ${row}]`
}

/** @param {string} node */
function getPositionFromVisitedNode(node) {
  const match = node.match(visitedNodeRegExp)
  if(match == null) throw new Error(`Invalid visited node "${node}"`)

  return [
    Number(match[2]),
    Number(match[1])
  ]
}

/**
  * @param {number} row
  * @param {number} column
  * @param {string} state
  */
function getApproachNode(row,column,state) {
  return `[${column}, ${row}]|${state}`
}

/** @param {string} [char] */
function isObstacle(char = "") {
  return char === OBSTACLE
}
