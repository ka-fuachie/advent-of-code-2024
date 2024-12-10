import { getInput } from "../utils.js";

let input = await getInput(10);

let islandMap = input.split("\n").filter(line => line != "")

let totalTrailheadScores = 0
for(let row = 0; row < islandMap.length; row++) {
  for(let column = 0; column < islandMap[row].length; column++) {
    totalTrailheadScores += getTrailScore(0, row, column, islandMap)
  }
}

console.log(totalTrailheadScores)

let totalTrailheadRatings = 0
for(let row = 0; row < islandMap.length; row++) {
  for(let column = 0; column < islandMap[row].length; column++) {
    totalTrailheadRatings += getTrailRating(0, row, column, islandMap)
  }
}

console.log(totalTrailheadRatings)

/**
  * @param {number} head
  * @param {number} row
  * @param {number} column
  * @param {string[]} map
  * @param {Set<string>} [visitedPeaksSet]
  * @returns {number}
  */
function getTrailScore(head, row, column, map, visitedPeaksSet = new Set()) {
  if(row < 0 || row >= map.length || column < 0 || column >= map[0].length) return 0
  if(head < 0 || head > 9) return 0

  let current = Number(map[row][column])
  if(head === 9 && current === head) {
    let node = getSerialisedNode(row, column)
    if(visitedPeaksSet.has(node)) return 0
    visitedPeaksSet.add(node)
    return 1
  }

  if(current != head) return 0

  let nextHead = head + 1

  return (
    getTrailScore(nextHead, row - 1, column, map, visitedPeaksSet) +
    getTrailScore(nextHead, row + 1, column, map, visitedPeaksSet) +
    getTrailScore(nextHead, row, column - 1, map, visitedPeaksSet) +
    getTrailScore(nextHead, row, column + 1, map, visitedPeaksSet)
  )
}

/**
  * @param {number} head
  * @param {number} row
  * @param {number} column
  * @param {string[]} map
  * @returns {number}
  */
function getTrailRating(head, row, column, map) {
  if(row < 0 || row >= map.length || column < 0 || column >= map[0].length) return 0
  if(head < 0 || head > 9) return 0

  let current = Number(map[row][column])
  if(head === 9 && current === head) return 1

  if(current != head) return 0

  let nextHead = head + 1

  return (
    getTrailRating(nextHead, row - 1, column, map) +
    getTrailRating(nextHead, row + 1, column, map) +
    getTrailRating(nextHead, row, column - 1, map) +
    getTrailRating(nextHead, row, column + 1, map)
  )
}

/**
  * @param {number} row
  * @param {number} column
  */
function getSerialisedNode(row, column) {
  return `[${column}, ${row}]`
}
