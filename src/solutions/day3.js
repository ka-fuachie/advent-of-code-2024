import { getInput } from "../utils.js";

let input = await getInput(3);

let mulRegExp = /^mul\((\d{1,3}),(\d{1,3})\)/

let sumOfMultipliers = 0, i = 0
while(i < input.length) {
  const match = input.slice(i).match(mulRegExp)
  if(match == null) { i++; continue }

  let a = Number(match[1]), b = Number(match[2])
  sumOfMultipliers += (a * b)

  i+=match[0].length
}

console.log(sumOfMultipliers)

let doRegExp = /^do\(\)/,
    dontRegExp = /^don't\(\)/

sumOfMultipliers = 0, i = 0
let isMultiplierEnabled = true
while(i < input.length) {
  let match;

  if(!isMultiplierEnabled && (match = input.slice(i).match(doRegExp)) != null) {
    isMultiplierEnabled = true
    i+=match[0].length; continue
  }

  if(isMultiplierEnabled && (match = input.slice(i).match(dontRegExp)) != null) {
    isMultiplierEnabled = false
    i+=match[0].length; continue
  }

  if(isMultiplierEnabled && (match = input.slice(i).match(mulRegExp)) != null) {
    let a = Number(match[1]), b = Number(match[2])
    sumOfMultipliers += (a * b)
    i+=match[0].length; continue
  }

  i++
}

console.log(sumOfMultipliers)
