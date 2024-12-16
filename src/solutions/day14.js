import { getInput } from "../utils.js";

let input = await getInput(14);

const robotRegExp = /p=(-?\d+),(-?\d+)\sv=(-?\d+),(-?\d+)/

let robots = input.split("\n")
      .filter(line => line != "")
      .map(line => {
        let match = line.match(robotRegExp)
        if(match == null) throw new Error("Invalid format")
        return {
          p: [match[1], match[2]].map(Number),
          v: [match[3], match[4]].map(Number),
        }
      })

let mapSize = [101,103]

let quadrants = [0,0,0,0]

for(let robot of robots) {
  let p = getPositionAfterTime(robot.p, robot.v, 100, mapSize)
  
  if(p[0] < Math.floor(mapSize[0]/2) && p[1] < Math.floor(mapSize[1]/2)) {
    quadrants[0] = quadrants[0] + 1
  }
  if(p[0] > Math.floor(mapSize[0]/2) && p[1] < Math.floor(mapSize[1]/2)) {
    quadrants[1] = quadrants[1] + 1
  }
  if(p[0] < Math.floor(mapSize[0]/2) && p[1] > Math.floor(mapSize[1]/2)) {
    quadrants[2] = quadrants[2] + 1
  }
  if(p[0] > Math.floor(mapSize[0]/2) && p[1] > Math.floor(mapSize[1]/2)) {
    quadrants[3] = quadrants[3] + 1
  }
}

console.log(
  quadrants[0] *
  quadrants[1] *
  quadrants[2] *
  quadrants[3]
)

  // display(
  //   robots.map(robot => ({
  //     ...robot,
  //     p: getPositionAfterTime(robot.p, robot.v, 22, mapSize)
  //   })),
  //   mapSize
  // )
// for(let i = 0; i <= 10_500; i+=2) {
//   console.clear()
//
//   for(let j = 0; j <= 1; j++) {
//     display(
//       robots.map(robot => ({
//         ...robot,
//         p: getPositionAfterTime(robot.p, robot.v, i + j, mapSize)
//       })),
//       mapSize
//     )
//   }
//
//   console.log(i)
//
//   await new Promise(r => setTimeout(r, 300))
// }

/**
  * @param {{p: number[]}[]} robots
  * @param {number[]} mapSize
  */
function display(robots, mapSize) {
  let map = Array.from({length: mapSize[1]}, _ => Array(mapSize[0]).fill(0))
  for(let {p} of robots) {
    map[p[1]][p[0]] = map[p[1]][p[0]] + 1
  }

  let pixels = []

  for(let row = 0; row < mapSize[1]; row+=4) {
    let pixelRow = ""

    for(let column = 0; column < mapSize[0]; column+=2) {
      let charCode = 0x2800
      if(map[row]?.    [column]     > 0) charCode += 1 << 0
      if(map[row + 1]?.[column]     > 0) charCode += 1 << 1
      if(map[row + 2]?.[column]     > 0) charCode += 1 << 2
      if(map[row]?.    [column + 1] > 0) charCode += 1 << 3
      if(map[row + 1]?.[column + 1] > 0) charCode += 1 << 4
      if(map[row + 2]?.[column + 1] > 0) charCode += 1 << 5
      if(map[row + 3]?.[column]     > 0) charCode += 1 << 6
      if(map[row + 3]?.[column + 1] > 0) charCode += 1 << 7

      pixelRow += String.fromCharCode(charCode)
    }

    pixels.push(pixelRow)
  }
  console.log(pixels.join("\n"))
}

/**
  * @param {number[]} position
  * @param {number[]} velocity
  * @param {number} time
  * @param {number[]} mapSize
  */
function getPositionAfterTime(position, velocity, time, mapSize) {
  return position.map((p, i) => {
    let v = velocity[i]
    return wrap(p + v * time, mapSize[i])
  })
}

/**
  * @param {number} value
  * @param {number} around
  */
function wrap(value, around) {
  let rem = value % around
  if(rem < 0) return around + rem
  return rem
}
