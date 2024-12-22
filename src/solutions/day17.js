import { getInput } from "../utils.js";

let input = await getInput(17);

// input = `Register A: 729
// Register B: 0
// Register C: 0
//
// Program: 0,1,5,4,3,0`
//
// input = `Register A: 2024
// Register B: 0
// Register C: 0
//
// Program: 0,1,5,4,3,0`

const Opcodes = {
  ADV: 0,
  BXL: 1,
  BST: 2,
  JNZ: 3,
  BXC: 4,
  OUT: 5,
  BDV: 6,
  CDV: 7,
}

let [registersStr, programStr] = input.trim().split("\n\n")

let [ra, rb, rc] = registersStr.split("\n").map(line => {
  let match = line.match(/^Register\s\w:\s(\d+)$/)
  if(match == null) throw new Error(`Invalid format "${line}"`)
  return Number(match[1])
}),
  program = programStr.match(/^Program:\s((\d,)+\d?)$/)[1].split(",").map(Number),
  iptr = 0,
  /** @type {number[]} */
  output = []


display(program, { ra, rb, rc, iptr }, output)
output = simulate(program, { ra, rb, rc, iptr }, output).output

console.log(output.join(","))

// Assuming the last two commands in the program are
// OUT rb
// JNZ 0
// And they are thr only OUT and JNZ commands in the program

// ra = 8 ** (program.length - 1)
ra = 35184406534747
// outer: while(ra < (8 ** program.length)) {
//   rb = 0, rc = 0, iptr = 0, output = []
//   // let outputLimit = 1
//   let outputLimit = Infinity
//
//   inner: while(true) {
//     // console.log(ra, outputLimit)
//     output = simulate(program, { ra, rb, rc, iptr }, output, outputLimit).output
//     let [outputStr, programStr] = [output, program].map(arr => arr.join(","))
//     if(!programStr.startsWith(outputStr)) break inner
//     if(programStr === outputStr) break outer
//     outputLimit++
//   }
//   console.log(ra, output)
//   // break
//   ra++
// }

// display(program, { ra, rb, rc, iptr }, output)
console.log(ra)

/**
  * @param {number[]} program
  * @param {Object} state
  * @param {number} state.ra
  * @param {number} state.rb
  * @param {number} state.rc
  * @param {number} state.iptr
  * @param {number[]} [output]
  */
function simulate(program, {ra, rb, rc, iptr}, output = [], outputLimit = Infinity) {
  while(iptr < program.length && output.length < outputLimit) {
    let opcode = program[iptr], operand = program[iptr + 1]
    display(program, { ra, rb, rc, iptr }, output)

    let combo = (() => {
      if(operand >= 0 && operand <= 3) return operand
      if(operand === 4) return ra
      if(operand === 5) return rb
      if(operand === 6) return rc
      throw new Error(`Invalid operand "${operand}"`)
    })()

    if(opcode === Opcodes.ADV) ra = Math.floor(ra/(2 ** combo))
    if(opcode === Opcodes.BXL) rb^=operand 
    if(opcode === Opcodes.BST) rb = combo % 8
    if(opcode === Opcodes.JNZ && ra !== 0) { iptr = operand; continue } 
    if(opcode === Opcodes.BXC) rb^=rc
    if(opcode === Opcodes.OUT) output.push(combo % 8)
    if(opcode === Opcodes.BDV) rb = Math.floor(ra/(2 ** combo))
    if(opcode === Opcodes.CDV) rc = Math.floor(ra/(2 ** combo))

    iptr+=2
  }

  return {ra, rb, rc, iptr, output}
}

/**
  * @param {number[]} program
  * @param {Object} state
  * @param {number} state.ra
  * @param {number} state.rb
  * @param {number} state.rc
  * @param {number} state.iptr
  * @param {number[]} [output]
  */
function display(program, {ra, rb, rc, iptr}, output = []) {
  console.log("--------")
  console.log("ra:", ra)
  console.log("rb:", rb)
  console.log("rc:", rc)
  console.log("--------")

  for(let i = 0; i < program.length; i+=2) {
    let opcode = program[i], operand = program[i + 1]

    /** @param {number} n */
    const getArrow = n => n === iptr ? "<==": ""

    let combo = (() => {
      if(operand >= 0 && operand <= 3) return operand
      if(operand === 4) return "ra"
      if(operand === 5) return "rb"
      if(operand === 6) return "rc"
      throw new Error(`Invalid operand "${operand}"`)
    })()

    if(opcode === Opcodes.ADV) console.log("ADV", combo, getArrow(i))
    if(opcode === Opcodes.BXL) console.log("BXL", operand, getArrow(i))
    if(opcode === Opcodes.BST) console.log("BST", combo, getArrow(i))
    if(opcode === Opcodes.JNZ) console.log("JNZ", operand, getArrow(i))
    if(opcode === Opcodes.BXC) console.log("BXC", getArrow(i))
    if(opcode === Opcodes.OUT) console.log("OUT", combo, getArrow(i))
    if(opcode === Opcodes.BDV) console.log("BDV", combo, getArrow(i))
    if(opcode === Opcodes.CDV) console.log("CDV", combo, getArrow(i))
  }

  console.log("--------")
  console.log("output:", output.join(","))
  console.log("--------")
}
