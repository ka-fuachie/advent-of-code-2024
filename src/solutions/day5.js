import { getInput } from "../utils.js";

let input = await getInput(5);

let [ ordersStr, updatesStr ] = input.split("\n\n")

let orders = new Set(ordersStr.split("\n").filter(str => str != ""))
let updates = updatesStr.split("\n").filter(str => str != "").map(line => line.split(","))

let totalMiddlePageNumber = 0
for(let update of updates) {
  let sortedUpdate = [...update].sort((a, b) => {
    if(orders.has(`${a}|${b}`)) return -1
    if(orders.has(`${b}|${a}`)) return 1
    return 0
  })

  if(!update.every((page, index) => page === sortedUpdate[index])) continue

  totalMiddlePageNumber += Number(update[Math.floor(update.length/2)])
}

console.log(totalMiddlePageNumber)

totalMiddlePageNumber = 0
for(let update of updates) {
  let sortedUpdate = [...update].sort((a, b) => {
    if(orders.has(`${a}|${b}`)) return -1
    if(orders.has(`${b}|${a}`)) return 1
    return 0
  })

  if(update.every((page, index) => page === sortedUpdate[index])) continue

  totalMiddlePageNumber += Number(sortedUpdate[Math.floor(update.length/2)])
}

console.log(totalMiddlePageNumber)
