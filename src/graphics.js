// @flow

import {drawStereogram} from "./genStereogram"
import type {DrawFunction, RGB} from "./genStereogram"

//This file sets up canvas and ties stereogram code to frontend code

const WIDTH = 1024;
const HEIGHT = 768;

//Takes an HTML canvas and sets it up with steriogram code
export function setupCanvas(canvas: HTMLCanvasElement){

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  var ctx = canvas.getContext("2d");
  if (ctx == null){
    alert("Failed to initialize canvas.")
  } else {
    (ctx : CanvasRenderingContext2D)//Tell flow what type the ctx object is

    const imageData = new ImageData(WIDTH, HEIGHT)
    const drawFunction = makeDrawPixelFunction(imageData)

    console.log(imageData.data.length)

    //////////////////////////////////////////////////////
    drawStereogram(drawFunction, WIDTH, HEIGHT);
    //////////////////////////////////////////////////////


    ctx.putImageData(imageData, 0, 0, 0, 0, WIDTH, HEIGHT)
  }

}

function makeDrawPixelFunction(imageData: ImageData){
  return function(x: number, y: number, value: RGB){
    const pixel = x + y*WIDTH;
    const arrayElement = pixel*4
    imageData.data[arrayElement] = value.r
    imageData.data[arrayElement + 1] = value.g
    imageData.data[arrayElement + 2] = value.b
    imageData.data[arrayElement + 3] = 255
  }
}
