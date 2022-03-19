'use strict';


////////////////
// Build Plot //
////////////////

class BuildPlot {
  constructor(rows, cols) {
    // Constructs a new BuildPlot.
    this.rows = rows;
    this.cols = cols;
    this.plot = [];
    this.reset();
  }

  reset() {
    // Resets the BuildPlot to an empty (white) canvas.
    this.plot = [];
    for (let i = 0; i < this.rows; i++) {
      let row = []
      for (let j = 0; j < this.cols; j++) {
        row.push(0);
      }
      this.plot.push(row);
    }
  }

  change(x, y, color) {
    // Given the coordinates of a click, updates the BuildPlot by
    // changing the color of the clicked square.
    this.plot[y][x] = color;
  }

  get_color(row, col) {
    // Gets a color given a row and column.
    return this.plot[row][col]
  }

  set_plot(new_plot) {
    // Sets the canvas of the BuildPlot.
    // Accepts either an 2D array or an array of strings
    // with the same dimensions as the BuildPlot.
    this.plot = [];
    for (let i = 0; i < this.rows; i++) {
      let row = []
      for (let j = 0; j < this.cols; j++) {
        row.push(Number(new_plot[i][j]));
      }
      this.plot.push(row);
    }
  }
  
  get_plot() {
    // Returns the BuildPlot as a 2D array.
    return this.plot;
  }

  compare(other) {
    // Compares a BuildPlot with another BuildPlot with the same dimensions.
    var other_plot = other.get_plot();
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.plot[i][j] != other_plot[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  draw(ctx) {
    // Draws the BuildPlot.
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        let color = this.get_color(row, col);
        ctx.fillStyle = COLORS[color];
				ctx.fillRect(col*SQUARE_SIZE, row*SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
        ctx.fill();
      }
    }
    
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 4;
    ctx.strokeRect(cursorPos[0] * SQUARE_SIZE, cursorPos[1] * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
  }
}




//////////////
// Gameplay //
//////////////

// Make the Timer Progress Bar
function buildTimerBar(time) {
  let decreaseTimerInterval = Math.floor(START_BUILD_TIME / 10);
  let decreaseTimerProgress = Math.floor((time % decreaseTimerInterval) / decreaseTimerInterval * 10) + 1;
  if (time <= 0) {
    decreaseTimerProgress = 0;
  }
  return "⏳(" + "🟢".repeat(decreaseTimerProgress) + "⚪".repeat(10-decreaseTimerProgress) + ")";
}

// Update the Score Display
function updateDisplay() {
  let buildDisplay = `Worth $${buildValue} | ⏳`
  buildStats.innerHTML = `Worth $${buildValue} | ${buildTimerBar(buildTimer)}`;
  totalStats.innerHTML = `Score: $${score} | Time: ${Math.floor(totalTimer/(1000 / TICK_SPEED))}s`;
}

// Update the Selected Color
function setColor(newColor) {
  selectedColor = newColor;
}

function newPlot(oldPlotID) {
  let newPlotID = Math.floor(Math.random() * MODEL_PLOTS.length);
  while (newPlotID == oldPlotID) {
    newPlotID = Math.floor(Math.random() * MODEL_PLOTS.length);
  }
  return newPlotID;
}





/////////////////////
// Setup Variables //
/////////////////////

const COLORS = {
  0: "white",
  1: "red",
  2: "darkorange",
  3: "yellow",
  4: "limegreen",
  5: "royalblue",
  6: "mediumorchid",
  7: "peru",
  8: "black"
};

const ROWS = 10;
const COLS = 10;
const SQUARE_SIZE = 40;
const TICK_SPEED = 50; // In ms
const START_BUILD_VALUE = 500;
const START_BUILD_TIME = 60 * (1000 / TICK_SPEED);  // In ticks
const START_TOTAL_TIME = 300 * (1000 / TICK_SPEED); // In ticks

const MODEL_PLOTS = [
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 7, 7, 7, 7, 7, 7, 0, 0],
    [0, 7, 7, 3, 3, 3, 3, 7, 7, 0],
    [0, 2, 3, 3, 3, 3, 1, 3, 2, 0],
    [0, 2, 3, 1, 3, 3, 3, 3, 2, 0],
    [0, 0, 2, 3, 3, 3, 3, 2, 0, 0],
    [0, 0, 0, 2, 3, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 3, 3, 3, 3, 3, 3, 1, 1],
    [1, 3, 3, 4, 4, 4, 4, 3, 3, 1],
    [1, 3, 4, 4, 5, 5, 4, 4, 3, 1],
    [1, 3, 4, 5, 5, 5, 5, 4, 3, 1],
    [1, 3, 4, 5, 6, 6, 5, 4, 3, 1],
    [1, 3, 4, 5, 6, 6, 5, 4, 3, 1]
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 4, 0, 0, 0, 3, 3, 0, 0],
    [0, 4, 4, 4, 0, 0, 3, 3, 0, 0],
    [0, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [0, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 7, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 7, 0, 0, 1, 1, 1, 1, 0],
    [0, 0, 7, 0, 0, 8, 0, 0, 8, 0],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 6, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 6, 6, 0, 0, 0, 0],
    [0, 0, 0, 0, 6, 6, 6, 0, 0, 0],
    [0, 0, 0, 0, 6, 6, 6, 6, 0, 0],
    [0, 0, 0, 0, 7, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 7, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [5, 5, 1, 1, 1, 1, 1, 1, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
  ]
]

var modelCanvasElement = document.getElementById("modelCanvas");
var userCanvasElement = document.getElementById("userCanvas");
var modelCtx = modelCanvasElement.getContext("2d");
var userCtx = userCanvasElement.getContext("2d");
var buildStats = document.getElementById("buildStats");
var totalStats = document.getElementById("totalStats");
var modelPlot = new BuildPlot(ROWS, COLS);
var userPlot = new BuildPlot(ROWS, COLS);
var plotID = undefined;
var selectedColor = 8;
var score = 0;
var buildValue = 1000;
var buildTimer = START_BUILD_TIME; 
var totalTimer = START_TOTAL_TIME; 
var mouseIsDown = false;
var touchscreenIsDown = false;
var cursorPos = [0, 0];









/////////////////////////
// Handling User Input //
/////////////////////////

// Keyboard Controls
const keypresses = {
  38: [0, -1], // up arrow
  87: [0, -1], // w
  39: [1, 0], // right arrow
  68: [1, 0], // d
  40: [0, 1], // down arrow
  83: [0, 1], // s
  37: [-1, 0], // left arrow
  65: [-1, 0], // a
  32: "place", // spacebar
  49: 1, // 1
  50: 2, // 2
  51: 3, // 3
  52: 4, // 4
  53: 5, // 5
  54: 6, // 6
  55: 7, // 7
  56: 8, // 8
  57: 0 // 9
}


window.addEventListener("keydown", function(event) {
  let action = keypresses[event.keyCode];
  if (action == "place") {
    userPlot.change(cursorPos[0], cursorPos[1], selectedColor);
  } else if (action in [0, 1, 2, 3, 4, 5, 6, 7, 8]) {
    setColor(action);
  } else if (action != undefined) {
    cursorPos[0] += action[0];
    cursorPos[1] += action[1];
    cursorPos[0] = Math.max(cursorPos[0], 0);
    cursorPos[0] = Math.min(cursorPos[0], COLS-1);
    cursorPos[1] = Math.max(cursorPos[1], 0);
    cursorPos[1] = Math.min(cursorPos[1], ROWS-1);
  }
});


/* Mouse Controls (BETA)
function getMousePos(canvas, event) {
  let rect = userCanvasElement.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  x = Math.floor(x);
  y = Math.floor(y);
  x = Math.min(x, 399);
  y = Math.min(y, 399);
  return [x, y];
}

userCanvasElement.addEventListener("mousedown", function(event) {
  mouseIsDown = true;
  let coords = getMousePos(userCanvasElement, event);
  userPlot.change(coords[0], coords[1], selectedColor);
});
*/

/* Mouse Drag Controls (BETA)

userCanvasElement.addEventListener("mouseup", function(event) {
  mouseIsDown = false;
});

userCanvasElement.addEventListener("mousemove", function(event) {
  if (mouseIsDown) {
    let coords = getMousePos(userCanvasElement, event);
    userPlot.change(coords[0], coords[1], selectedColor);
  }
});

/* Beta Disable Handler */



/* Touchscreen Controls (BETA)

userCanvasElement.addEventListener("touchstart", function(event) {
  touchscreenIsDown = true;
  let coords = getMousePos(userCanvasElement, event);
  userPlot.change(coords[0], coords[1], selectedColor);
});

userCanvasElement.addEventListener("touchend", function(event) {
  touchscreenIsDown = false;
});

userCanvasElement.addEventListener("touchmove", function(event) {
  if (touchscreenIsDown) {
    let coords = getMousePos(userCanvasElement, event);
    userPlot.change(coords[0], coords[1], selectedColor);
  }
});

/* Beta Disable Handler */










/////////////////
// Final Setup //
/////////////////

plotID = newPlot(plotID);
modelPlot.set_plot(MODEL_PLOTS[plotID]);




///////////////
// Game Loop //
///////////////

function update() {
  // Update Timers
  totalTimer -= 1;
  buildTimer -= 1;

  // Update Build Value
  buildValue = Math.max(START_BUILD_VALUE * ((Math.floor(buildTimer / START_BUILD_TIME * 10) + 1)/10), 0) + 500;
  
  // Compare User Plot with Model Plot
  if (modelPlot.compare(userPlot)) {
    // Get New Build & Update Score
    userPlot.reset();
    score += buildValue;
    buildValue = START_BUILD_VALUE;
    buildTimer = START_BUILD_TIME;
    plotID = newPlot(plotID);
    modelPlot.set_plot(MODEL_PLOTS[plotID]);
  }

  // Redraw Canvases & Stat Displays
  modelPlot.draw(modelCtx);
  userPlot.draw(userCtx);
  updateDisplay();

  // Check If Time Is Up
  if (totalTimer <= 0) {
    clearInterval(gameloop);
    window.location.href="end.html"
  }
  
  // Debugging
  //console.log("Main Game Loop Updated!");
}

var gameloop = setInterval(function() { update(); }, TICK_SPEED);
//var debugloop = setInterval(function() { console.log("Expected Performance Update!"); }, 250);