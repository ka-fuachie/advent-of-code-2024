import { getInput } from "../utils.js";

let input = await getInput(11);
// input = "0 1 10 99 999"
// input = "125 17"
// input = "0"

let stones = input.trim().split(" ")

for(let i = 0; i < 25; i++) {
  stones = blink(stones)
}

console.log(stones.length)

stones = input.trim().split(" ")

let graph = new Map()
console.log(blinkAndCountChunked(stones, 75, graph))
// console.log(graph)

/**
  * @param {string[]} nums
  * @param {number} times
  * @param {Map<string, string[]>} [graph]
  */
function blinkAndCountChunked(nums, times, graph = new Map()) {
  if(times === 0) return nums.length

  let count = 0

  for(let num of nums) {
    let children = graph.get(`${num}-${times}`)
    let i = times + 1;

    if(children == null) {
      i = 1
      while(i <= Math.min(times, 10)) {
        children = graph.get(`${num}-${i}`)
        if(children == null) {
          children = blinkCached(graph.get(`${num}-${i - 1}`) ?? [num], graph)
          graph.set(`${num}-${i}`, children)
        }
        // if(children.includes(num)) break
        i++
      }
    }

    count +=  blinkAndCountChunked(children, times - i + 1, graph)
  }

  return count
}

/**
  * @param {string[]} nums
  * @param {Map<string, string[]>} graph
  */
function blinkCached(nums, graph) {
  /** @type {string[]} */
  let newNums = []
  for(let num of nums) {
    let children = graph.get(`${num}-1`)
    if(children != null) {
      newNums.push(...children)
      continue
    }

    if(Number(num) === 0) {
      newNums.push("1")
      graph.set("0-1", ["1"])
      continue
    }
    if(num.length % 2 === 0) {
      let left = num.slice(0, num.length/2)
      let right = num.slice(num.length/2)

      newNums.push(Number(left).toString())
      newNums.push(Number(right).toString())
      graph.set(`${num}-1`, [left, right])
      continue
    }

    let nextNum = (Number(num) * 2024).toString()
    newNums.push(nextNum)
    graph.set(`${num}-1`, [nextNum])
  }

  return newNums
}

/**
  * @param {string[]} nums
  * @param {number} times
  * @param {Map<string, string[]>} [graph]
  */
function blinkAndCount(nums, times, graph = new Map()) {
  if(times === 0) return nums.length

  let count = 0

  for(let num of nums) {
    let children = graph.get(num)
    if(children == null) {
      children = blink([num])
      graph.set(num, children)
    }

    count += blinkAndCount(children, times - 1, graph)
  }

  return count
}

/** @param {string[]} nums */
function blink(nums) {
  /** @type {string[]} */
  let newNums = []
  for(let num of nums) {
    if(Number(num) === 0) { newNums.push("1"); continue }
    if(num.length % 2 === 0) {
      let left = num.slice(0, num.length/2)
      let right = num.slice(num.length/2)

      newNums.push(Number(left).toString())
      newNums.push(Number(right).toString())
      continue
    }

    newNums.push((Number(num) * 2024).toString())
  }

  return newNums
}
