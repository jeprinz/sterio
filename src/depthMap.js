//@flow

let depthMap = new Array(768)
let x, y
for (y = 0; y < depthMap.length; y++) {
  depthMap[y] = new Array(1024)
  for (x = 0; x < depthMap.length; x++) {
    depthMap[y][x] = 0
  }
}

export function Z(x: number, y: number): number {
  return depthMap[y][x]
}
