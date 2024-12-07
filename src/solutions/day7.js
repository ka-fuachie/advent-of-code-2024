import { getInput } from "../utils.js";

let input = await getInput(7);

const ADD = "+"
const MULTIPLY = "*"
const CONCATENATE = "||"

let equations = (
  input
    .split("\n")
    .filter(line => line != "")
    .map(getEquation)
)

let sumOfTrueResults = 0

for(let equation of equations) {
  let [result, operands] = equation

  if(!isPossiblyTrue(result, operands)) continue
  sumOfTrueResults+=result
}

console.log(sumOfTrueResults)

sumOfTrueResults = 0

for(let equation of equations) {
  let [result, operands] = equation

  if(!isPossiblyTrue(result, operands, undefined, true)) continue
  sumOfTrueResults+=result
}

console.log(sumOfTrueResults)

/**
  * @param {number} result
  * @param {number[]} operands
  * @param {string} [operation]
  * @param {boolean} [handleConcatenation]
  * @returns {boolean}
  */
function isPossiblyTrue(result, operands, operation, handleConcatenation = false) {
  if(!handleConcatenation && operation === CONCATENATE) return false

  if(operands.length === 1) {
    return result === operands[0]
  }

  return (
    (
      (operation ?? ADD === ADD) && isPossiblyTrue(
        result - operands[operands.length - 1],
        operands.slice(0, operands.length - 1),
        ADD,
        handleConcatenation
      ) ||
      (operation ?? MULTIPLY === MULTIPLY) && isPossiblyTrue(
        result / operands[operands.length - 1],
        operands.slice(0, operands.length - 1),
        MULTIPLY,
        handleConcatenation
      ) ||
      (operation ?? CONCATENATE === CONCATENATE) && isPossiblyTrue(
        result.toString().endsWith(operands[operands.length - 1].toString())
          ? Number(
              result.toString().slice(
                0, 
                (
                  result.toString().length - 
                  operands[operands.length - 1].toString().length
                )
              )
          )
          : -1,
        operands.slice(0, operands.length - 1),
        CONCATENATE,
        handleConcatenation
      )
    )
  )
}

/** @param {string} text */
function getEquation(text) {
  return /** @type {const} */([
    Number(text.split(":")[0]),
    text.split(":")[1].trim().split(" ").map(Number)
  ])
}
