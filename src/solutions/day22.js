import { getInput } from "../utils.js";

let input = await getInput(22);

let initialSecretNumbers = input.trim().split("\n").map(Number)

let total2000thSecretNumbers = 0

for(let secretNumber of initialSecretNumbers) {
  for(let i = 0; i < 2000; i++) {
    secretNumber = getSecretNumber(secretNumber)
  }
  total2000thSecretNumbers += secretNumber
}
console.log(total2000thSecretNumbers)


let sequenceMapList = []

for(let secretNumber of initialSecretNumbers) {
  let sequenceMap = new Map()
  let priceList = []

  for(let i = 0; i < 2000; i++) {
    secretNumber = getSecretNumber(secretNumber)
    priceList.push(secretNumber % 10)
    if(i < 4) continue

    let sequence = priceList
      .slice(i - 3, i + 1)
      .map((p, j) => p - priceList[i - 4 + j])
      .join(",")
    if(sequenceMap.has(sequence)) continue
    sequenceMap.set(sequence, priceList[i])
  }

  sequenceMapList.push(sequenceMap)
}

let totalSequenceMap = new Map()

for(let map of sequenceMapList) {
  for(let [sequence, price] of map.entries()) {
    totalSequenceMap.set(sequence, (totalSequenceMap.get(sequence) ?? 0) + price)
  }
}

console.log(Math.max(...totalSequenceMap.values()))


/** @param {number} seed */
function getSecretNumber(seed) {
  let rand = seed
  rand = mod(((rand * 64) ^ rand), 16777216)
  rand = mod((Math.floor(rand / 32) ^ rand), 16777216)
  rand = mod(((rand * 2048) ^ rand), 16777216)

  return rand
}

/**
  * @param {number} num
  * @param {number} base
  */
function mod(num, base) {
  let result = num % base
  if(result < 0) return base + result
  return result
}
