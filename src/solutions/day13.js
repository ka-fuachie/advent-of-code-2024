import { getInput } from "../utils.js";

let input = await getInput(13);
input = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`

const buttonRegExp = /Button\s(A|B):\sX(\+\d+),\sY(\+\d+)/
const prizeRegExp = /Prize:\sX=(\d+),\sY=(\d+)/
const MAX_BUTTON_PRESSES = 100
// const MAX_BUTTON_PRESSES = 6

let machines = input.split("\n\n").map(str => parseMachine(str))
// console.log(machines)
// machines = [
//   {
//     a: {x: 6, y: 8, token: 3},
//     b: {x: 3, y: 4, token: 1},
//     // prize: {x: 305, y: 403}
//     prize: {x: 30, y: 40}
//   }
// ]

let totalMinTokens = 0
for(let machine of machines) {
  let minTokens = getMinTokensToPrize(machine, 100)
  if(minTokens == Infinity) continue
  totalMinTokens += minTokens
}

console.log(totalMinTokens)

// machines = input.split("\n\n").map(str => (
//   parseMachine(str, 10_000_000_00)
// ))
// machines = input.split("\n\n").map(str => (
//   parseMachine(str, 10_000_000_000_000)
// ))
totalMinTokens = 0
for(let machine of machines) {
  let minTokens = getMinTokensToPrize(machine)
  console.log("--", minTokens)
  if(minTokens == Infinity) continue
  totalMinTokens += minTokens
}

console.log(totalMinTokens)

/** @typedef {typeof machines extends (infer U)[]? U: never} Machine */

/**
  * @param {Machine} machine
  * @param {number} [maxButtonPresses]
  * @returns {number}
  */
function getMinTokensToPrize(
  machine,
  maxButtonPresses = Infinity
) {
  let {a, b, prize} = machine

  let aTimes = 0
  while(true) {
    // console.log(aTimes)
    if(aTimes > maxButtonPresses) return Infinity
    if(a.x * aTimes > prize.x) return Infinity
    if(a.y * aTimes > prize.y) return Infinity

    if(
      !(((prize.x - (a.x * aTimes)) % b.x) === 0) ||
      !(((prize.y - (a.y * aTimes)) % b.y) === 0)
    ) { aTimes++; continue }

    let bTimes = (prize.x - (a.x * aTimes)) / b.x
    if(bTimes > maxButtonPresses) { aTimes++; continue }

    let computedPrizeX = (a.x * aTimes) + (b.x * bTimes),
        computedPrizeY = (a.y * aTimes) + (b.y * bTimes)
    if(
      (computedPrizeX !== prize.x) ||
      (computedPrizeY !== prize.y)
    ) { aTimes++; continue }

    return (a.token * aTimes) + (b.token * bTimes)
  }
}

/**
  * @param {string} str
  * @param {number} [prizePadding]
  */
function parseMachine(str, prizePadding) {
  let lines = str.split("\n")
  return {
    a: {...parseButton(lines[0]), token: 3},
    b: {...parseButton(lines[1]), token: 1},
    prize: parsePrize(lines[2], prizePadding)
  }
}

/** @param {string} str */
function parseButton(str) {
  let match = str.match(buttonRegExp)
  if(match == null) throw new Error(`Invalid string`)

  return {
    x: Number(match[2]),
    y: Number(match[3])
  }
}

/**
  * @param {string} str
  * @param {number} [padding]
  */
function parsePrize(str, padding = 0) {
  let match = str.match(prizeRegExp)
  if(match == null) throw new Error(`Invalid string`)

  return {
    x: Number(match[1]) + padding,
    y: Number(match[2]) + padding
  }
}
