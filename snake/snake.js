// The code could use some real cleaning up. 
// Will do later

// Snake game
// Uses js
// Doesn't support some old/limited browsers
// Each piece of the body of snake is a 'cell' element
// The cell is an html div element with a width and height, absolute position

"use strict";

var game; // The setInterval function
var playing = false; // true if game is running
var gameOver = false; // true if game is over (snake ate itself)
var snake = []; // array that stores all the cell elements

// direction : 8 - up, 6 - right, 2 - down, 4 - left
var direction = 6; // initial direction is right
var fps = 10; // frames per second, number of time the setInterval function is called per second
var size = 40; // the width of each cell 
var step = 40; // the number of pixels it moves per frame
var lengthOfSnake = -1; // the number of elements - 1, in snake array
var apple; // the apple - another cell object
var score = 0; // score of the player. 10 per apple.
var appleX, appleY; // x and y of apple

// The instruction text - top left
var textOnScreen = document.createElement("div");
textOnScreen.id = "textInfo";
textOnScreen.className = "notBlinking";
// Score text - top right
var scoreBoard = document.createElement("div");
scoreBoard.id = "scoreBoard";
var fpsText = document.getElementById("fps");
var sizeText = document.getElementById("size");
var stepText = document.getElementById("step");

if (document.addEventListener) {
    document.addEventListener("load", initialize(), false);
}

function initialize() {
    createCell();

    document.body.appendChild(textOnScreen);
    document.body.appendChild(scoreBoard);
    
    textOnScreen.innerHTML = "Arrow keys to move. P to Pause/Play.";

    scoreBoard.innerHTML = "Score: 0";
    scoreBoard.style.left = window.innerWidth - 125 + 'px';

    fpsText.style.left = '10px';
    sizeText.style.left = '60px';
    stepText.style.left = '110px';

    spawnApple();
    play();
    document.addEventListener("keydown", keyListener, false);    
    window.addEventListener("touchstart", handleTouchStart, false);
    window.addEventListener("touchmove", handleTouchMove, false);

    fpsText.addEventListener("change", function(event){
        stop();
        fps = Number(fpsText.value);
        play();
    }, false);
    sizeText.addEventListener("change", function(event){
        stop();
        size = Number(sizeText.value);
        reset();
        play();
    }, false);
    stepText.addEventListener("change", function(event){
        stop();
        step = Number(stepText.value);
        play();
    }, false);
}

function createCell() {
    var cell = document.createElement("div");
    cell.id = "cell";
    cell.style.width = size + 'px';
    cell.style.height = size + 'px';
    cell.style.borderRadius = size / 5 + 'px';
    cell.style.left = step + 'px';
    cell.style.top = step + 'px';
    document.body.appendChild(cell);
    snake.push(cell);
    lengthOfSnake++;
}

function play() {
    game = setInterval(mover, 1000 / fps);
    playing = true;
    gameOver = false;
    textOnScreen.innerHTML = "Arrow keys to move. P to Pause/Play.";
    textOnScreen.className = "notBlinking";
    apple.className = "blinking";
}

function stop() {
    clearInterval(game); // stops the game
    apple.className = "";
    playing = false;
}

function reset() {
    for (var i = 0; i < snake.length; i++) {
        document.body.removeChild(snake[i]);
    }
    lengthOfSnake = -1;
    snake = [];
    direction = 6;
    createCell();
    document.body.removeChild(apple);
    spawnApple();
    moveApple();
    score = 0;
    scoreBoard.innerHTML = "Score: 0";
}

function mover() {
    for (var i = snake.length - 1; i > 0; i--) {
        snake[i].style.left = snake[i - 1].style.left;
        snake[i].style.top = snake[i - 1].style.top;
    }
    moveCell(snake[0], direction); // move the head of the snake in some direction    
}

function moveCell(cell, direction) {
    var x = cell.style.left;
    x = x.substring(0, x.indexOf("px"));
    var y = cell.style.top;
    y = y.substring(0, y.indexOf("px"));

    if (direction === 8) { //up
        if (y >= step) {
            y = ~~y - step;
        } else {
            y = window.innerHeight - (window.innerHeight % step) - step;
        }
    }
    if (direction === 6) { //right
        if (x < window.innerWidth - (window.innerWidth % step) - step) {
            x = ~~x + step;
        } else {
            x = 0;
        }
    }
    if (direction === 2) { //down
        if (y < window.innerHeight - (window.innerHeight % step) - step) {
            y = ~~y + step;
        } else {
            y = 0;
        }
    }
    if (direction === 4) { //left
        if (x >= step) {
            x = ~~x - step;
        } else {
            x = window.innerWidth - (window.innerWidth % step) - step;
        }
    }

    // see if apple touched
    if (isAppleTouched(x, y)) {
        moveApple();
        createCell();
        snake[lengthOfSnake].style.left = snake[lengthOfSnake - 1].style.left;
        snake[lengthOfSnake].style.top = snake[lengthOfSnake - 1].style.top;
        score += 10;
        scoreBoard.innerHTML = "Score: " + score;
    }

    cell.style.left = x + 'px';
    cell.style.top = y + 'px';

    // check if it's eating itself
    for (var i = 1; i < snake.length; i++) {
        if (cell.style.left === snake[i].style.left
            && cell.style.top === snake[i].style.top) {
            stop();
            gameOver = true;
            textOnScreen.innerHTML = "Score: " + score + ". Hit Enter to Restart.";
            textOnScreen.className = "blinking";
        }
    }
}

// If any of the 'vertices' of the head of the snake falls within the apple, returns true.
function isAppleTouched(x, y) {
    return isTouching(x, y, appleX, appleY);
}

// Sees if the given (x,y) is inside some cell with (otherX,otherY) coordinate.
// The latter can be either a body cell of the snake or an apple.
function isTouching(x, y, otherX, otherY) {
    x = ~~x;
    y = ~~y;
    otherX = ~~otherX;
    otherY = ~~otherY;

    if (x === otherX && y === otherY) {
        return true;
    }

    var touching = false;
    // If the snake is moving up or down
    if (direction === 8 || direction === 2) {
        if (y > otherY && y < otherY + size) {
            if (x < otherX) {
                touching = (otherX < x + size);
            } else if (x > otherX) {
                touching = (x < otherX + size);
            }
        }
    }
    // moving right or left
    else if (direction === 6 || direction === 4) {
        if(x > otherX && x < otherX + size){
            if(y < otherY){
                touching = (y + size > otherY);
            } else if (y > otherY){                
                touching = (y < otherY + size);
            }
        }
    }

    return touching;
}

function spawnApple() {
    apple = document.createElement("div");
    apple.id = "apple";
    apple.style.width = size + 'px';
    apple.style.height = size + 'px';
    apple.style.borderRadius = size / 5 + 'px';
    document.body.appendChild(apple);
    apple.className = "blinking";

    moveApple();
}

function moveApple() {
    var randomX = Math.random() * window.innerWidth;
    randomX -= randomX % step;
    if (randomX >= window.innerWidth - (window.innerWidth % step) - step) {
        randomX -= step;
    }
    var randomY = Math.random() * window.innerHeight;
    randomY -= randomY % step;
    if (randomY >= window.innerHeight - (window.innerHeight % step) - step) {
        randomY -= step;
    }

    appleX = randomX;
    appleY = randomY;
    apple.style.left = randomX + 'px';
    apple.style.top = randomY + 'px';
}

var xDown, yDown;

// Handles the touch start
function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;

    for (var i = 0; i < snake.length; i++) {
        var x = snake[i].style.left;
        x = x.substring(0, x.indexOf("px"));
        var y = snake[i].style.top;
        y = y.substring(0, y.indexOf("px"));

        x = ~~x;
        y = ~~y;

        // if the snake is touched on
        if (xDown >= x && xDown <= (x + step) && yDown >= y && yDown <= (y + step)) {
            if (gameOver) {
                reset();
                play();
            } else {
                if (playing) {
                    stop();
                } else {
                    play();
                }
            }
        }
    }
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    // left/right
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 20) {
            //alert("left swipe");
            if (direction !== 6)
                direction = 4;
        } else {
            //alert("right swipe");
            if (xDiff < -20 && direction !== 4)
                direction = 6;
        }
    } else {
        //up/down
        if (yDiff > 10) {
            //alert("up swipe");
            if (direction !== 2)
                direction = 8;
        } else {
            //alert("down swipe");
            evt.preventDefault();
            if (yDiff < -20 && direction !== 8)
                direction = 2;
        }
    }

    xDown = xUp;
    yDown = yUp;
}

function keyListener(event) {
    //console.log(event);
    if (event.keyCode === 38 && direction !== 2) {
        direction = 8;
    } else if (event.keyCode === 39 && direction !== 4) {
        direction = 6;
    } else if (event.keyCode === 40 && direction !== 8) {
        direction = 2;
    } else if (event.keyCode === 37 && direction !== 6) {
        direction = 4;
    }
    // Pause and play
    if (event.keyCode === 82 || event.keyCode == 80) {
        if (playing) {
            stop();
        } else {
            if (!gameOver)
                play();
        }
    }
    // Game over - Hit enter
    if (event.keyCode === 13 && gameOver) {
        reset();
        play();
    }
}