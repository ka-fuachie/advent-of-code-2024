import { getInput } from "../utils.js";

let input = await getInput(19);

let [towelsStr, designsStr] = input.trim().split("\n\n")

let towels = towelsStr.split(", "),
    designs = designsStr.split("\n")

let totalPossibleDesigns = 0
for(let design of designs) {
  if(!getIsPossible(design, towels)) continue
  totalPossibleDesigns++
}

console.log(totalPossibleDesigns)


let totalPossibleArrangements = 0
for(let design of designs) {
  totalPossibleArrangements += getPossibleArrangements(design, towels)
}

console.log(totalPossibleArrangements)

/**
  * @param {string} design
  * @param {string[]} towels
  * @param {Map<string, number>} [cache]
  * @returns {number}
  */
function getPossibleArrangements(design, towels, cache = new Map()) {
  if(cache.has(design)) return cache.get(design)

  let possibleArrangements = 0
  for(let towel of towels) {
    if(design === towel) { possibleArrangements++; continue }
    if(!design.startsWith(towel)) continue
    possibleArrangements += getPossibleArrangements(design.slice(towel.length), towels, cache)
  }

  cache.set(design, possibleArrangements)
  return possibleArrangements
}

/**
  * @param {string} design
  * @param {string[]} towels
  * @param {Map<string, boolean>} [cache]
  * @returns {boolean}
  */
function getIsPossible(design, towels, cache = new Map()) {
  if(cache.has(design)) return cache.get(design)

  let isPossible = false
  for(let towel of towels) {
    if(isPossible) break
    if(design === towel) { isPossible = true; continue }
    if(!design.startsWith(towel)) continue
    isPossible ||= getIsPossible(design.slice(towel.length), towels, cache)
  }

  cache.set(design, isPossible)
  return isPossible
}


/**
  * @typedef {Object} Node
  * @property {string} value
  * @property {string[]} [path]
  */
