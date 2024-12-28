import { getInput } from "../utils.js";

let input = await getInput(24);
// input = `x00: 1
// x01: 1
// x02: 1
// y00: 0
// y01: 1
// y02: 0
//
// x00 AND y00 -> z00
// x01 XOR y01 -> z01
// x02 OR y02 -> z02`

let [valueDefs, logicDefs] = input.trim().split("\n\n")

let circuitMap = new Map(), circuitMapValueCache = new Map()

for(let def of valueDefs.split("\n")) {
  let [key, value] = def.split(": ")
  circuitMap.set(key, BigInt(value))
}

for(let def of logicDefs.split("\n")) {
  let [input1, op, input2, _, output] = def.split(" ")
  circuitMap.set(output, { inputs: [input1, input2], op })
}

let zValue = 0n
let i = 0n
while(true) {
  let zKey = "z" + i.toString().padStart(2, "0")
  if(!circuitMap.has(zKey)) break

  zValue += (getValue(zKey) << i)
  i++
}

console.log(zValue)

// let xValue = 0n, yValue = 0n
// i = 0n
// while(true) {
//   let xKey = "x" + i.toString().padStart(2, "0")
//   if(!circuitMap.has(xKey)) break
//   xValue += (getValue(xKey) << i)
//   i++
// }
// i = 0n
// while(true) {
//   let yKey = "y" + i.toString().padStart(2, "0")
//   if(!circuitMap.has(yKey)) break
//   yValue += (getValue(yKey) << i)
//   i++
// }
//
// let expectedZ = xValue + yValue, binZ, binEZ
// console.log(expectedZ)
// console.log(binZ = zValue.toString(2))
// console.log(binEZ = expectedZ.toString(2))
// let deb = ""
// for(let j = 0; j < binZ.length; j++) {
//   if(binZ[j] === binEZ[j]) { deb.concat(" "); continue }
//   console.log(j)
//   deb.concat("|")
// }
// console.log(deb)

// i = 0n
// while(true) {
//   let zKey = "z" + i.toString().padStart(2, "0")
//   if(!circuitMap.has(zKey)) break
//
//   let stack = [zKey],
//       solutions = new Set()
//   while(stack.length > 0) {
//     let node = stack.pop()
//
//     if(node.match(/^x\d+$/) != null) {
//       solutions.add(node)
//       continue
//     }
//
//     let value = circuitMap.get(node)
//     if(typeof value === "bigint") continue
//
//     stack.push(...value.inputs)
//   }
//
//   // console.log(zKey, [...solutions].sort())
//
//   i++
// }

function getValue(key) {
  let value = circuitMap.get(key)
  if(typeof value === "bigint") return value
  if(circuitMapValueCache.has(key)) return circuitMapValueCache.get(key)

  value = compute(
    value.op,
    value.inputs.map(getValue)
  )

  circuitMapValueCache.set(key, value)
  return value
}

function compute(op, inputs) {
  if(op === "AND") return inputs[0] & inputs[1]
  if(op === "OR") return inputs[0] | inputs[1]
  if(op === "XOR") return inputs[0] ^ inputs[1]

  throw new Error("Invalid op")
}
