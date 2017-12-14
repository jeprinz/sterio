//@flow



import {makeDepthFunction} from "./depthMap"

export type DrawFunction = (number,number, RGB) => void //x,y,rgb
export type DepthFunction = (number,number) => number //x,y, depth (between 0  and 1)

export type RGB = {r: number, g: number, b: number}

export function drawStereogram(drawFunction: DrawFunction, width: number, height: number) {
  const Z = makeDepthFunction(width, height)
  genStereogram(Z, width, height, drawFunction, 1/3, 64)
}

// based on https://www.cs.waikato.ac.nz/~ihw/papers/94-HWT-SI-IHW-SIRDS-paper.pdf
function genStereogram(Z: DepthFunction, maxX: number, maxY: number,
  drawPoint: DrawFunction, mu: number, dpi: number) {
  /*let u,v
  for (v = 0; v < maxY; v++) {
    for (u = 0; u < maxX; u++) {
      drawPoint(u,v,Math.floor(255*Z(u,v)))
    }
  }
  return*/
  const eyeSeparation = 2.5 // inches (since dpi)
  let E = round(dpi*eyeSeparation)
  let x, y
  for (y = 0; y < maxY; y++) {
    let pix: Array<RGB> = new Array(maxX)
    let same = new Array(maxX) // same[a] = b means a and b are the same color
    let s
    let left, right

    for (x = 0; x < maxX; x++) {
      same[x] = x // by default same[x] = x, which means x can be any color
    }

    for (x = 0; x < maxX; x++) {
      let z = Z(x,y)      //depth
      s = separation(z, mu, E) //how far apart the points should be
      left = Math.floor(x - s/2)
      right = left + s
      if (0 <= left && right < maxX) {
        let visible
        let t = 1
        let zt
        do {
          zt = z + 2*(2 - mu*z)*t/(mu*E) //geometry
          visible = (Z(x - t, y) < zt) && (Z(x + t, y) < zt)
          t++
        } while ((visible != false) && (zt < 1))
        if (visible) {
        //if (true) {
          let l = same[left]
          while ((l != left) && (l != right)) {
            if (l < right) {
              left = l
              l = same[left]
            }
            else {
              same[left] = right
              left = right
              l = same[left]
              right = l
            }
          }
          same[left] = right
        }
      }
    }

    for (x = maxX - 1; x >= 0; x--) {
      if (same[x] == x) {
        let r = Math.floor(256*Math.random())
        let g = Math.floor(256*Math.random())
        let b = Math.floor(256*Math.random())
        //let value = Math.floor(Math.pow(2, 8*Math.random()))
        //let value = Math.floor((x - maxX/2)*(x - maxX/2) % 256)
        pix[x] = {r: r, g: g, b: b}
      }
      else {
        pix[x] = pix[same[x]]
      }
      drawPoint(x,y,pix[x])
    }
  }
}

function separation(z, mu, E) { // computes the separation on the screen between the left- and right-eye pixels corresponding to a point at depth z
  return round((1 - mu*z)*E / (2 - mu*z)) //geometry
}

function round(x) {
  return Math.floor(x + .5)
}
