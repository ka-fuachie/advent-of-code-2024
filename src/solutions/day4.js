import { getInput } from "../utils.js";

let input = await getInput(4);


const isHorizontalXmasMatch = getXmasMatchFunction({column: true})
const isVerticalXmasMatch = getXmasMatchFunction({row: true})
const isDiagonalXmasMatch = getXmasMatchFunction({row: true, column: true})
const isDiagonalAlternateXmasMatch = getXmasMatchFunction({row: true, column: true, alternate: true})

const isDiagonalDoubleMasMatch = getDoubleMasMatchFunction({row: true, column: true})
const isDiagonalAlternateDoubleMasMatch = getDoubleMasMatchFunction({row: true, column: true, alternate: true})

let lines = input.split("\n")

let totalMatches = 0
for(let i = 0; i < lines.length; i++) {
  for(let j = 0; j < lines[i].length; j++) {
    totalMatches+= getXmasMatches(lines, i, j)
  }
}

console.log(totalMatches)

totalMatches = 0
for(let i = 0; i < lines.length; i++) {
  for(let j = 0; j < lines[i].length; j++) {
    totalMatches+= getDoubleMasMatches(lines, i, j)
  }
}

console.log(totalMatches)

/**
  * @callback MatchFunction
  * @param {string[]} lines
  * @param {number} row
  * @param {number} column
  * @param {boolean} [reverse]
  * @returns {boolean}
  */

/**
  * @param {string[]} lines
  * @param {number} row
  * @param {number} column
  */
function getXmasMatches(lines, row, column) {
  let matches = 0
  if(isHorizontalXmasMatch(lines, row, column)) matches++
  if(isHorizontalXmasMatch(lines, row, column, true)) matches++
  if(isVerticalXmasMatch(lines, row, column)) matches++
  if(isVerticalXmasMatch(lines, row, column, true)) matches++
  if(isDiagonalXmasMatch(lines, row, column)) matches++
  if(isDiagonalXmasMatch(lines, row, column, true)) matches++
  if(isDiagonalAlternateXmasMatch(lines, row, column)) matches++
  if(isDiagonalAlternateXmasMatch(lines, row, column, true)) matches++
  return matches
}

/**
  * @param {string[]} lines
  * @param {number} row
  * @param {number} column
  */
function getDoubleMasMatches(lines, row, column) {
  let matches = 0
  if(
    (isDiagonalDoubleMasMatch(lines, row, column) || isDiagonalDoubleMasMatch(lines, row, column, true)) &&
    (isDiagonalAlternateDoubleMasMatch(lines, row, column) || isDiagonalAlternateDoubleMasMatch(lines, row, column, true))
  ) matches++

  return matches
}

/**
  * @param {object} [increment]
  * @param {boolean} [increment.row]
  * @param {boolean} [increment.column]
  * @param {boolean} [increment.alternate]
  */
function getXmasMatchFunction(increment = {}) {
  /** @type {MatchFunction} */
  return (lines, row, column, reverse = false) => {
    const matchText = "XMAS"
    let i = row, j = column
    
    if(!increment.alternate) {
      for(let k = 0; k < matchText.length; k++) {
        if(matchText[k] != lines[i]?.[j]) {
          return false
        }

        if(increment.row && !reverse) i++
        if(increment.column && !reverse) j++
        if(increment.row && reverse) i--
        if(increment.column && reverse) j--
      }

      return true
    }

    if(increment.alternate) {
      for(let k = 0; k < matchText.length; k++) {
        if(matchText[k] != lines[i]?.[j]) {
          return false
        }

        if(increment.row && !reverse) i--
        if(increment.column && !reverse) j++
        if(increment.row && reverse) i++
        if(increment.column && reverse) j--
      }

      return true
    }
  }
}

/**
  * @param {object} [increment]
  * @param {boolean} [increment.row]
  * @param {boolean} [increment.column]
  * @param {boolean} [increment.alternate]
  */
function getDoubleMasMatchFunction(increment = {}) {
  /** @type {MatchFunction} */
  return (lines, row, column, reverse = false) => {
    const matchText = "MAS"

    if(!increment.alternate) {
      for(let k = 0; k < matchText.length; k++) {
        let i = row, j = column
        let l = k % 2 === 0 ? k/2 : (k+1)/-2

        if(increment.row && !reverse) i+=l
        if(increment.column && !reverse) j+=l
        if(increment.row && reverse) i-=l
        if(increment.column && reverse) j-=l

        if(matchText[l + Math.floor(matchText.length/2)] != lines[i]?.[j]) {
          return false
        }
      }

      return true
    }

    if(increment.alternate) {
      for(let k = 0; k < matchText.length; k++) {
        let i = row, j = column
        let l = k % 2 === 0 ? k/2 : (k+1)/-2

        if(increment.row && !reverse) i-=l
        if(increment.column && !reverse) j+=l
        if(increment.row && reverse) i+=l
        if(increment.column && reverse) j-=l

        if(matchText[l + Math.floor(matchText.length/2)] != lines[i]?.[j]) {
          return false
        }
      }

      return true
    }
  }
}

/**
  * @param {string[]} lines
  * @param {number} row
  * @param {number} column
  * @param {boolean} reverse
  * @param {object} increment
  * @param {boolean} [increment.row]
  * @param {boolean} [increment.column]
  */
function log(lines, row, column, reverse, increment) {
  let MATCH_TEXT = "XMAS"
  let i = row, j = column
  console.log(`------[${i}, ${j}]-----`)
  for(let k = 0; k < MATCH_TEXT.length; k++) {
    process.stdout.write(lines[i]?.[j] ?? "")

    if(increment.row && !reverse) i++
    if(increment.column && !reverse) j++
    if(increment.row && reverse) i--
    if(increment.column && reverse) j--
  }

  process.stdout.write("\n")
}
