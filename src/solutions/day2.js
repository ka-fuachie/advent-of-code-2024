import { getInput } from "../utils.js";

let input = await getInput(2);

let lines = input.split("\n")
let reports = lines
  .filter(line => line != "")
  .map(line => line.split(" ").map(Number))

console.log(reports.filter(report => isReportSafe(report)).length)
console.log(reports.filter(report => isReportSafe(report, true)).length)

/**
  * @param {number[]} report
  * @param {boolean} [withDampener]
  * @returns {boolean}
  */
function isReportSafe(report, withDampener = false) {
  /** @type {"increasing" | "decreasing" | null} */
  let state = null,
  /** @type {number} */
      prevItem;

  for(let i = 0; i < report.length; i++) {
    let item = report[i]
    let test = isItemSafe(item, prevItem, state)
    if(!test.ok) {
      if(withDampener) {
        for(let j = 0; j <= i; j++) {
          if(!isReportSafe(report.filter((_,k) => j != k))) continue
          return true
        }
      }
      return false
    }

    state = test.state
    prevItem = item
  }

  return true
}

/**
  * @param {number} item
  * @param {number} prevItem
  * @param {"increasing" | "decreasing" | null} state
  */
function isItemSafe(item, prevItem, state) {
  if(item == null) return {state, ok: true}

  if(prevItem != null) {
    let isConsistent = (
      (state == null) ||
      (state == "increasing" && item > prevItem) ||
      (state == "decreasing" && item < prevItem)
    )

    let diff = Math.abs(item - prevItem)
    if(!isConsistent || diff > 3 || diff < 1) return {ok: false, state}
  }

  if(state == null && prevItem != null) {
    state = item > prevItem ? "increasing": "decreasing"
  }

  return {state, ok: true}
}
