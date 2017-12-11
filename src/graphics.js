// @flow

//This file sets up canvas and ties stereogram code to frontend code

const WIDTH = 500;
const HEIGHT = 500;

//Takes an HTML canvas and sets it up with steriogram code
export function setupCanvas(canvas: HTMLCanvasElement){

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  var ctx = canvas.getContext("2d");
  if (ctx == null){
    alert("Failed to initialize canvas.")
  } else {
    (ctx : CanvasRenderingContext2D)//Tell flow what type the ctx object is
    ctx.fillStyle = 'rgb(23, 100, 30)'
    ctx.fillRect(1, 1, 10, 10)

    const imageData = new ImageData(WIDTH, HEIGHT)
    const drawFunction = makeDrawPixelFunction(imageData)
    ctx.putImageData(imageData, 0, 0, 0, 0)
  }

}

function makeDrawPixelFunction(imageData: ImageData){
  return function(x: number, y: number, value: number){
    const pixel = x + y*WIDTH;
    const arrayElement = pixel*3
    imageData.data[arrayElement] = value
    imageData.data[arrayElement + 1] = value
    imageData.data[arrayElement + 2] = value
  }
}
