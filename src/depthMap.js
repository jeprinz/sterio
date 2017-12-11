//@flow

import type {DepthFunction} from "./genStereogram"

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

export function makeDepthFunction(width: number, height: number): DepthFunction{
  function depth(x: number, y: number) {
      let r = Math.min(width/4, height/4)
      if (Math.pow((x - width/2),2) + Math.pow((y - height/2),2) < Math.pow(r,2)) {
        return Math.sqrt(1 - Math.pow(((x - width/2)/r),2)  - Math.pow(((y - height/2)/r),2))
      }
      else {
          return 0
      }
  }
  return depth
}
