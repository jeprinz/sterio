//@flow



import {makeDepthFunction, makeLeftDepthFunction} from "./depthMap"

export type DrawFunction = (number,number, RGB) => void //x,y,rgb
export type DepthFunction = (number,number) => number //x,y, depth (between 0  and 1)

export type RGB = {r: number, g: number, b: number}
export type ColorFunction = () => RGB


export function drawStereogram(drawFunction: DrawFunction, color: ColorFunction, width: number, height: number) {
  const Z = makeLeftDepthFunction(width, height)
  genStereogram(Z, width, height, drawFunction, color, 1/3, 64)
}



export function randomColor() {
  let r= Math.floor(256*Math.random())
  let g= Math.floor(256*Math.random())
  let b= Math.floor(256*Math.random())
  return {r: r, g: g, b: b}
}

export function blue() {
  return {r: 0, g: 0, b: Math.floor(256*Math.random())}
}

export function red() {
  return {r: Math.floor(256*Math.random()), g: 0, b: 0}
}

export function green() {
  return {r: 0, g: Math.floor(Math.random()*256)}
}

// based on https://www.cs.waikato.ac.nz/~ihw/papers/94-HWT-SI-IHW-SIRDS-paper.pdf
function genStereogram(Z: DepthFunction, maxX: number, maxY: number,
  drawPoint: DrawFunction, color: ColorFunction, mu: number, dpi: number) {
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
      if (z == -1) {
        // this point is not even in the far plane
      }
      else {
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
    }

    for (x = maxX - 1; x >= 0; x--) {
      if (same[x] == x) {
        pix[x] = color()
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
