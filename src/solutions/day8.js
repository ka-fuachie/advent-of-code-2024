import { getInput } from "../utils.js";

let input = await getInput(8);

let map = input.split("\n").filter(line => line != "")

const signalAntennaRegExp = /[a-zA-Z0-9]/

console.log(getTotalAntinodesCount(map))
console.log(getTotalAntinodesCount(map, true))

/** @typedef {[number, number]} AntennaNode */

/**
  * @param {string[]} map
  * @param {boolean} [withResonance]
  */
function getTotalAntinodesCount(map, withResonance = false) {
  let mapWidth = map[0].length,
      mapHeight = map.length

  /** @type {Set<string>} */
  let serialisedAntinodesSet = new Set(),
  /** @type {Map<string, AntennaNode[]>} */
      antennaMap = new Map()

  for(let row = 0; row < mapHeight; row++) {
    for(let column = 0; column < mapWidth; column++) {
      if(!signalAntennaRegExp.test(map[row][column])) continue

      let antennaLabel = map[row][column]
      let newNode = getAntennaNode(row, column)
      let antennaNodes = antennaMap.get(antennaLabel)
      if(antennaNodes == null) {
        antennaMap.set(antennaLabel, [newNode])
        continue
      }

      for(let node of antennaNodes) {
        let antinodes = (
          !withResonance
            ? getAntennaAntinodes
            : getAntennaAntinodesWithResonance
          )(node, newNode, mapWidth, mapHeight)
        
        for(let antinode of antinodes) {
          serialisedAntinodesSet.add(
            `[${antinode[0]}, ${antinode[1]}]`
          )
        }
      }

      antennaMap.set(antennaLabel, [...antennaNodes, newNode])
    }
  }

  return serialisedAntinodesSet.size
}

/**
  * @param {number} row
  * @param {number} column
  */
function getAntennaNode(row, column) {
  return /** @type {AntennaNode} */([column, row])
}

/**
  * @param {AntennaNode} nodeA 
  * @param {AntennaNode} nodeB
  * @param {number} width
  * @param {number} height
  */
function getAntennaAntinodes(nodeA, nodeB, width, height) {
  let distY = Math.abs(nodeA[1] - nodeB[1]),
      distX = Math.abs(nodeA[0] - nodeB[0])

  let min = [
    Math.min(nodeA[0],nodeB[0]),
    Math.min(nodeA[1],nodeB[1])
  ]

  let antinodes = [nodeA,nodeB].map(node => [
    node[0] === min[0] ? node[0] - distX: node[0] + distX,
    node[1] === min[1] ? node[1] - distY: node[1] + distY
  ])

  return antinodes.filter(node => (
    (node[0] >= 0 && node[0] < width) &&
    (node[1] >= 0 && node[1] < height)
  ))
}

/**
  * @param {AntennaNode} nodeA 
  * @param {AntennaNode} nodeB
  * @param {number} width
  * @param {number} height
  */
function getAntennaAntinodesWithResonance(nodeA, nodeB, width, height) {
  let distY = Math.abs(nodeA[1] - nodeB[1]),
      distX = Math.abs(nodeA[0] - nodeB[0])

  let nodes = [nodeA, nodeB]

  let min = [
    Math.min(nodeA[0],nodeB[0]),
    Math.min(nodeA[1],nodeB[1])
  ]

  let x,y,
      minXNode = nodes.find(node => (
        node[0] === Math.min(nodeA[0], nodeB[0])
      )),
      maxXNode = nodes.find(node => (
        node[0] === Math.max(nodeA[0], nodeB[0])
      ))
  
  let antinodes = []

  x = minXNode[0], y = minXNode[1]
  while(x >= 0 && x < width && y >= 0 && y < height) {
    antinodes.unshift([x,y])
    x-=distX
    y = minXNode[1] === min[1] ? y - distY: y + distY
  }

  x = maxXNode[0], y = maxXNode[1]
  while(x >= 0 && x < width && y >= 0 && y < height) {
    antinodes.push([x,y])
    x+=distX
    y = maxXNode[1] === min[1] ? y - distY: y + distY
  }

  return antinodes
}
