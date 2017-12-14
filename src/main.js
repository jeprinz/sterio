//@flow

// This is the main file that will load in the browser

import only from "onlyjs"
import {setupCanvas} from "./graphics"

console.log('hi')

//First set up page

const canvas = only.html({canvas: "", width: 500, height: 500,
  css: {//Border so we can see where canvas is
    borderStyle: "solid"
}});


only.setHtml({div: [
  {p: "Welcome to SterIO, a very intentional pun"},
  canvas
]});

setupCanvas(canvas);//This function passes off control to the graphics code
