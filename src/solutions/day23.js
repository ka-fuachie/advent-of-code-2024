import { getInput } from "../utils.js";

let input = await getInput(23);

let connectionMap = new Map()

for(let connection of input.trim().split("\n")) {
  let [pc1, pc2] = connection.split("-")
  
  if(connectionMap.has(pc1)) connectionMap.get(pc1).add(pc2)
  else connectionMap.set(pc1, new Set([pc2]))
  if(connectionMap.has(pc2)) connectionMap.get(pc2).add(pc1)
  else connectionMap.set(pc2, new Set([pc1]))
}

let groups = new Set()
for(let [pc, connections] of connectionMap.entries()) {
  for(let pc2 of connections) {
    for(let pc3 of connections) {
      if(pc2 === pc3) continue
      if(!connectionMap.get(pc2).has(pc3)) continue
      groups.add([pc,pc2,pc3].sort().join(","))
    }
  } 
}

const numberOfGroupsWithT = [...groups].map(group => group.split(",")).filter(group => (
  group.some(pc => pc.startsWith("t"))
)).length
console.log(numberOfGroupsWithT)

let fullGroups = new Set([...connectionMap.keys()])
for(let pc of connectionMap.keys()) {
  for(let group of fullGroups) {
    if(group.includes(pc)) continue
    let groupItems = group.split(",")
    let newGroup = groupItems.filter(item => connectionMap.get(item).has(pc))
    newGroup.push(pc)
    fullGroups.add(newGroup.sort().join(","))
  }
}

let fullGroupsList = [...fullGroups]
let maxGroup = fullGroupsList.reduce((max, current) => {
  if(current.split(",").length > max.split(",").length) return current
  return max
}, "")
console.log(maxGroup)
