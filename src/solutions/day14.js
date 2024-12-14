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

// for(let i = 0; i < 1000; i++) {
//   display(
//     robots.map(robot => ({
//       ...robot,
//       p: getPositionAfterTime(robot.p, robot.v, i, mapSize)
//     })),
//     mapSize
//   )
//   console.log({i})
//
//   await new Promise(r => setTimeout(r, 200))
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

  console.clear()
  map
    .map(line => line.map(n => n === 0 ?".": "█"))
    .forEach(line => console.log(line.join("")))
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
