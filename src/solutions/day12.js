import { getInput } from "../utils.js";

let input = await getInput(12);
// input = `AAAA
// BBCD
// BBCC
// EEEC`
// input = `OOOOO
// OXOXO
// OOOOO
// OXOXO
// OOOOO`

let farm = input.split("\n").filter(line => line != "")

/** @type {Set<string>} */
let mappedNodes = new Set(),
/** @type {Region[]} */
    regions = []

for(let row = 0; row < farm.length; row++) {
  for(let column = 0; column < farm[row].length; column++) {
    let node = getNode(row, column)
    if(mappedNodes.has(node)) continue

    let type = farm[row][column]
    let region = getRegion(type, node, farm)

    regions.push({type, nodes: region})
    for(let node of region) {
      mappedNodes.add(node)
    }
  }
}

console.log(getTotalPrice(regions))
console.log(getTotalPriceWithDiscount(regions))

/** 
  * @typedef {Object} Region
  * @property {string} type
  * @property {string[]} nodes
  */

/**
  * @param {string} type
  * @param {string} node
  * @param {string[]} map
  * @param {string[]} [region]
  * @param {Set<string>} [visited]
  */
function getRegion(
  type,
  node,
  map,
  region = [],
  visited = new Set()
) {
  let [row, column] = getPosition(node)

  if(row <  0 || row >= map.length) return
  if(column < 0 || column >= map[row].length) return
  if(type != map[row][column]) return

  if(visited.has(node)) return

  region.push(node)
  visited.add(node)

  getRegion(type, getNode(row - 1, column), map, region, visited)
  getRegion(type, getNode(row + 1, column), map, region, visited)
  getRegion(type, getNode(row, column - 1), map, region, visited)
  getRegion(type, getNode(row, column + 1), map, region, visited)

  return region
}

/** @param {Region[]} regions */
function getTotalPrice(regions) {
  return regions.reduce((total, region) => (
    total + (getArea(region) * getPerimeter(region))
  ), 0)
}

/** @param {Region[]} regions */
function getTotalPriceWithDiscount(regions) {
  return regions.reduce((total, region) => (
    total + (getArea(region) * getSidesCount(region))
  ), 0)
}

/** @param {Region} region */
function getArea(region) {
  return region.nodes.length
}

/** @param {Region} region */
function getPerimeter(region) {
  let nodeSet = new Set(region.nodes)
  let perimeter = 0

  for(let node of region.nodes) {
    let [row, column] = getPosition(node)
    if(!nodeSet.has(getNode(row - 1, column))) perimeter++
    if(!nodeSet.has(getNode(row + 1, column))) perimeter++
    if(!nodeSet.has(getNode(row, column - 1))) perimeter++
    if(!nodeSet.has(getNode(row, column + 1))) perimeter++
  }

  return perimeter
}

/** @param {Region} region */
function getSidesCount(region) {
  let nodeSet = new Set(region.nodes)
  let perimeter = 0

  for(let node of region.nodes) {
    let [row, column] = getPosition(node)
    if(!nodeSet.has(getNode(row - 1, column))) perimeter++
    if(!nodeSet.has(getNode(row + 1, column))) perimeter++
    if(!nodeSet.has(getNode(row, column - 1))) perimeter++
    if(!nodeSet.has(getNode(row, column + 1))) perimeter++
  }

  return perimeter
}

/** @param {string} node */
function getPosition(node) {
  let match = node.match(/\[(-?\d+),\s(-?\d+)\]/)
  if(match == null) throw new Error("Invalid node")
  return /** @type {const} */([
    Number(match[2]),
    Number(match[1])
  ])
}

/**
  * @param {number|string} row
  * @param {number|string} column
  */
function getNode(row, column) {
  return `[${column}, ${row}]`
}
