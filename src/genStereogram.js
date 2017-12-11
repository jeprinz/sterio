//@flow

// based on https://www.cs.waikato.ac.nz/~ih.w/papers/94-HWT-SI-IHW-SIRDS-paper.pdf

type DrawFunction = (number,number,number) => void //x,y,value
type DepthFunction = (number,number) => number //x,y, depth (between 0  and 1)

function genStereogram(Z: DepthFunction, maxX: number, maxY: number, drawPoint: DrawFunction, mu: number, dpi: number) {
  dpi = dpi || 100 //dots per inch
  mu = mu || 1/3
  const eyeSeparation = 2.5 // inches (since dpi)
  let E = round(dpi*eyeSeparation)
  let x, y
  for (y = 0; y < maxY; y++) {
    let pix = new Array(maxX)
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
          visible = (Z(t - x, y) < zt) && (Z(t + x, y) < zt)
          t++
        } while ((visible != false) && (zt < 1))
        if (visible) {
          let l = same[left]
          while (l != left && l != right) {
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
      if (same[x] = x) {
        let value = Math.floor(256*Math.random())
        pix[x] = value
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
