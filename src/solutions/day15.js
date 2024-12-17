import { getInput } from "../utils.js";

let input = await getInput(15);

let [mapString, moves] = input.split("\n\n"),
    warehouse1 = mapString
      .split("\n")
      .filter(line => line != "")
      .map(line => line.split(""))

let playerRow, playerColumn
for(let row = 0; row < warehouse1.length; row ++) {
  for(let column = 0; column < warehouse1[row].length; column ++) {
    if(warehouse1[row][column] !== "@") continue
    playerRow = row
    playerColumn = column
  }
}

for(let cmd of moves) {
  if(cmd === "^") {
    move1(warehouse1, playerRow, playerColumn, cmd) && (playerRow-=1)
  }

  if(cmd === ">") {
    move1(warehouse1, playerRow, playerColumn, cmd) && (playerColumn+=1)
  }

  if(cmd === "v") {
    move1(warehouse1, playerRow, playerColumn, cmd) && (playerRow+=1)
  }

  if(cmd === "<") {
    move1(warehouse1, playerRow, playerColumn, cmd) && (playerColumn-=1)
  }
}

let boxGPSCoordsSum = 0
for(let row = 0; row < warehouse1.length; row ++) {
  for(let column = 0; column < warehouse1[row].length; column ++) {
    if(warehouse1[row][column] !== "O") continue
    boxGPSCoordsSum += (row * 100 + column)
  }
}
console.log(boxGPSCoordsSum)

let warehouse2 = mapString
  .split("\n")
  .filter(line => line != "")
  .map(line => {
    let newRow = []
    for(let node of line) {
      if(node === "@") {
        newRow.push(node)
        newRow.push(".")
        continue
      }

      if(node === "O") {
        newRow.push("[")
        newRow.push("]")
        continue
      }

      newRow.push(node)
      newRow.push(node)
    }
    return newRow
  })

for(let row = 0; row < warehouse2.length; row ++) {
  for(let column = 0; column < warehouse2[row].length; column ++) {
    if(warehouse2[row][column] !== "@") continue
    playerRow = row
    playerColumn = column
  }
}

for(let cmd of moves) {
  if(cmd === "^") {
    move2(warehouse2, playerRow, playerColumn, cmd) && (playerRow-=1)
  }
  if(cmd === ">") {
    move2(warehouse2, playerRow, playerColumn, cmd) && (playerColumn+=1)
  }
  if(cmd === "v") {
    move2(warehouse2, playerRow, playerColumn, cmd) && (playerRow+=1)
  }
  if(cmd === "<") {
    move2(warehouse2, playerRow, playerColumn, cmd) && (playerColumn-=1)
  }
}

boxGPSCoordsSum = 0
for(let row = 0; row < warehouse2.length; row ++) {
  for(let column = 0; column < warehouse2[row].length; column ++) {
    if(warehouse2[row][column] !== "[") continue
    boxGPSCoordsSum += (row * 100 + column)
  }
}
console.log(boxGPSCoordsSum)

function move2(map,row,column,cmd,check = false) {
  if(map.length <= row) return false
  if(map[0].length <= column) return false

  let node = map[row][column]

  if(node === "#") return false
  if(node === ".") return true
 
  if(cmd === "^") {
    if(node === "[") {
      return (
        (
          move2(map, row - 1, column, cmd, true) &&
          move2(map, row - 1, column + 1, cmd, true) &&
          move2(map, row - 1, column, cmd, check) &&
          move2(map, row - 1, column + 1, cmd, check)
        ) && (
          swap(map, row, column, row - 1, column, check) &&
          swap(map, row, column + 1, row - 1, column + 1, check)
        )
      )
    }

    if(node === "]") {
      return (
        (
          move2(map, row - 1, column, cmd, true) &&
          move2(map, row - 1, column - 1, cmd, true) &&
          move2(map, row - 1, column, cmd, check) &&
          move2(map, row - 1, column - 1, cmd, check)
        ) && (
          swap(map, row, column, row - 1, column, check) &&
          swap(map, row, column - 1, row - 1, column - 1, check)
        )
      )
    }

    return (
      move2(map, row - 1, column, cmd, check) &&
      swap(map, row, column, row - 1, column, check)
    )
  }

  if(cmd === ">") {
    return (
      move2(map, row, column + 1, cmd, check) &&
      swap(map, row, column, row, column + 1, check)
    )
  }

  if(cmd === "v") {
    if(node === "[") {
      return (
        (
          move2(map, row + 1, column, cmd, true) &&
          move2(map, row + 1, column + 1, cmd, true) &&
          move2(map, row + 1, column, cmd, check) &&
          move2(map, row + 1, column + 1, cmd, check)
        ) && (
          swap(map, row, column, row + 1, column, check) &&
          swap(map, row, column + 1, row + 1, column + 1, check)
        )
      )
    }

    if(node === "]") {
      return (
        (
          move2(map, row + 1, column, cmd, true) &&
          move2(map, row + 1, column - 1, cmd, true) &&
          move2(map, row + 1, column, cmd, check) &&
          move2(map, row + 1, column - 1, cmd, check)
        ) && (
          swap(map, row, column, row + 1, column, check) &&
          swap(map, row, column - 1, row + 1, column - 1, check)
        )
      )
    }

    return (
      move2(map, row + 1, column, cmd, check) &&
      swap(map, row, column, row + 1, column, check)
    )
  }

  if(cmd === "<") {
    return (
      move2(map, row, column - 1, cmd, check) &&
      swap(map, row, column, row, column - 1, check)
    )
  }

  return false
}

function move1(map,row,column,cmd) {
  if(map.length <= row) return false
  if(map[0].length <= column) return false

  let node = map[row][column]

  if(node === "#") return false
  if(node === ".") return true
 
  if(cmd === "^") {
    return (
      move1(map, row - 1, column, cmd) &&
      swap(map, row, column, row - 1, column)
    )
  }

  if(cmd === ">") {
    return (
      move1(map, row, column + 1, cmd) &&
      swap(map, row, column, row, column + 1)
    )
  }

  if(cmd === "v") {
    return (
      move1(map, row + 1, column, cmd) &&
      swap(map, row, column, row + 1, column)
    )
  }

  if(cmd === "<") {
    return (
      move1(map, row, column - 1, cmd) &&
      swap(map, row, column, row, column - 1)
    )
  }

  return false
}

function swap(map, row1, column1, row2, column2, check = false) {
  if(check) return true
  let temp = map[row1][column1]
  map[row1][column1] = map[row2][column2]
  map[row2][column2] = temp
  return true
}
