import fs from 'node:fs/promises';

/** @param {number} day */
export function getInput(day) {
  return fs.readFile(`src/data/day${day}.txt`, 'utf-8');
}

/**
  * @template {() => any} T
  * @param {(fn: T, ...args: Parameters<T>) => ReturnType<T>} superFn
  */
export function anonymous(superFn) {
  /** @param {Parameters<T>} args */
  function fn(...args) {
    return superFn(fn, ...args)
  }

  return fn
}
