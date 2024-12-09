import { getInput } from "../utils.js";

let input = await getInput(9);

let denseDiskMap = input

const FREE_SPACE = "."

/** @type {(number|string)[]} */
let extractedDiskMap = [],
    currentFileID = 0
for(let i = 0; i < denseDiskMap.length; i++) {
  let size = Number(denseDiskMap[i])

  if(i % 2 == 0) {
    extractedDiskMap.push(...Array(size).fill(currentFileID))
    currentFileID++
  } else {
    extractedDiskMap.push(...Array(size).fill(FREE_SPACE))
  }
}

let compactedDiskmap = extractedDiskMap.slice(),
    head = 0, tail = compactedDiskmap.length - 1

while(head < tail) {
  if(compactedDiskmap[head] !== FREE_SPACE) {
    head++
    continue
  }
  if(compactedDiskmap[tail] === FREE_SPACE) {
    tail--
    continue
  }

  let temp = compactedDiskmap[head]
  compactedDiskmap[head] = compactedDiskmap[tail]
  compactedDiskmap[tail] = temp
}

console.log(getDiskmapChecksum(compactedDiskmap))

compactedDiskmap = extractedDiskMap.slice(),
head = 0
/** @type {{head: number, size: number}[]} */
let availableContigiousFreeSpaceList = [],
/** @type {number|null} */
    availableContigiousFreeSpace = null,
/** @type {number|null} */
    availableContigiousFreeSpaceHead = null

while(head < compactedDiskmap.length - 1) {
  let currentHead = compactedDiskmap[head]

  if(currentHead === FREE_SPACE && availableContigiousFreeSpaceHead == null) {
    availableContigiousFreeSpaceHead = head
    availableContigiousFreeSpace = 1
    head++
    continue
  }
  if(currentHead === FREE_SPACE && availableContigiousFreeSpaceHead != null) {
    availableContigiousFreeSpace++
    head++
    continue
  }
  if(currentHead !== FREE_SPACE && availableContigiousFreeSpaceHead == null) {
    head++
    continue
  }
  if(currentHead !== FREE_SPACE && availableContigiousFreeSpaceHead != null) {
    availableContigiousFreeSpaceList.push({
      head: availableContigiousFreeSpaceHead,
      size: availableContigiousFreeSpace
    })
    availableContigiousFreeSpaceHead = null
    availableContigiousFreeSpace = null
    continue
  }
}

tail = compactedDiskmap.length - 1
/** @type {number|null} */
let currentFileSize = null,
/** @type {number|null} */
    currentFileTail = null

while(tail >= 0) {
  let currentTail = compactedDiskmap[tail],
      tailFileID = currentTail !== FREE_SPACE
        ? currentTail
        : null,
      currentFileID = currentFileTail != null
        ? compactedDiskmap[currentFileTail]
        : null

  if(currentTail !== FREE_SPACE && currentFileTail == null) {
    currentFileTail = tail
    currentFileSize = 1
    tail--
    continue
  }
  if(
    currentTail !== FREE_SPACE && currentFileTail != null &&
    (tailFileID != null && currentFileID != null && tailFileID === currentFileID)
  ) {
    currentFileSize += 1
    tail--
    continue
  }

  if(currentTail === FREE_SPACE && currentFileTail == null) {
    tail--
    continue
  }

  if(
    (
      (tailFileID != null && currentFileID != null && tailFileID !== currentFileID) ||
      currentTail === FREE_SPACE
    ) && 
    currentFileTail != null
  ) {
    for(let freeSpace of availableContigiousFreeSpaceList) {
      if(currentFileSize > freeSpace.size) continue
      if(currentFileTail < freeSpace.head) break

      for(let i = 0; i < currentFileSize; i++) {
        let temp = compactedDiskmap[freeSpace.head + i]
        compactedDiskmap[freeSpace.head + i] = 
          compactedDiskmap[currentFileTail - i]
        compactedDiskmap[currentFileTail - i] = temp
      }

      freeSpace.size -= currentFileSize
      freeSpace.head += currentFileSize
      availableContigiousFreeSpaceList.filter(freeSpace => freeSpace.size > 0)
      break
    }

    currentFileTail = null
    currentFileSize = null
    continue
  }
}
console.log(getDiskmapChecksum(compactedDiskmap))

/** @param {(number|string)[]} diskmap */
function getDiskmapChecksum(diskmap) {
  let checksum = 0;
  for(let i = 0; i < diskmap.length; i++) {
    if(diskmap[i] === FREE_SPACE) continue
    checksum += (Number(diskmap[i]) * i)
  }

  return checksum
}
