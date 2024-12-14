import { getInput } from "../utils.js";

let input = await getInput(13);

const buttonRegExp = /Button\s(A|B):\sX(\+\d+),\sY(\+\d+)/
const prizeRegExp = /Prize:\sX=(\d+),\sY=(\d+)/

let machines = input.split("\n\n").map(str => parseMachine(str))

let totalMinTokens = 0
for(let machine of machines) {
  let minTokens = getMinTokensToPrize(machine, 100)
  if(minTokens == Infinity) continue
  totalMinTokens += minTokens
}

console.log(totalMinTokens)

machines = input.split("\n\n").map(str => (
  parseMachine(str, 10_000_000_000_000)
))
totalMinTokens = 0
for(let machine of machines) {
  let minTokens = getMinTokensToPrize(machine)
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

  // aTimes * a.x + bTimes * b.x = prize.x
  // aTimes * a.y + bTimes * b.y = prize.y
  //
  // (aTimes * a.x + bTimes * b.x) * b.y = prize.x * b.y
  // (aTimes * a.y + bTimes * b.y) * b.x = prize.y * b.x
  //
  // aTimes*a.x*b.y - aTimes*a.y*b.x  = prize.x*b.y - prize.y*b.x
  // 
  // aTimes(a.x*b.y - a.y*b.x) = prize.x*b.y - prize.y*b.x
  //
  // aTimes = (prize.x*b.y - prize.y*b.x)/(a.x*b.y - a.y*b.x)
  //
  // bTimes = (prize.x - aTimes*a.x)/b.x

  let aTimes = (
    (prize.x * b.y - prize.y * b.x)/
    (a.x * b.y - a.y * b.x)
  ),
      bTimes = (prize.x - aTimes * a.x) / b.x

  if(aTimes > maxButtonPresses) return Infinity
  if(!Number.isInteger(aTimes)) return Infinity
  if(bTimes > maxButtonPresses) return Infinity
  if(!Number.isInteger(bTimes)) return Infinity

  return (aTimes * a.token) + (bTimes * b.token)
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
