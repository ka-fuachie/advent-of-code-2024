import { getInput } from "../utils.js";

let input = await getInput(1);

/** @type {number[][]} */
let lists = []
for(let line of input.split("\n")) {
  if(line == "") continue;
  let numbers = line.split(/\s+/).map(Number);
  for(let i = 0; i < numbers.length; i++) {
    (lists[i] ||= []).push(numbers[i]);
  }
}

const sortedLists = lists.map(list => list.sort((a, b) => a - b));

let totalDiff = 0;
for(let i = 0; i < sortedLists[0].length; i++) {
  totalDiff += Math.abs(sortedLists[0][i] - sortedLists[1][i])
}

console.log(totalDiff);

const sortedList1Set = new Set(sortedLists[0]);

let totalSimilarity = 0;
for(let i = 0; i < sortedLists[1].length; i++) {
  if(!sortedList1Set.has(sortedLists[1][i])) continue;
  totalSimilarity += sortedLists[1][i];
}

console.log(totalSimilarity);
