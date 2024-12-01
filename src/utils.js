import fs from 'node:fs/promises';

/** @param {number} day */
export function getInput(day) {
  return fs.readFile(`src/data/day${day}.txt`, 'utf-8');
}
