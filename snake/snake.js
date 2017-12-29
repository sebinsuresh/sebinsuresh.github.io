"use strict";

var game; // for the setInterval method
var playing = false;
var gameOver = false;
var snake = [];
// dir : 8 - up, 6 - right, 2 - down, 4 - left
var direction = 6;
var step = 25; // 25px per move
var lengthOfSnake = -1;
var fps = 8;
var apple; // the apple
var score = 0;

var textOnScreen = document.createElement("div");
textOnScreen.innerHTML = "Arrow keys to move. P to Pause/Play.";
textOnScreen.style.position = "absolute";
textOnScreen.style.color = "grey";
textOnScreen.style.fontFamily = "Consolas";

var scoreText = document.createElement("div");
scoreText.innerHTML = "Score: ";
scoreText.style.position = "absolute";
scoreText.style.color = "grey";
scoreText.style.fontFamily = "Consolas";
scoreText.style.left = window.innerWidth - 125 + 'px';

function createCell() {
    var cell = document.createElement("div");
    cell.style.width = '25px';
    cell.style.height = '25px';
    cell.style.borderRadius = '5px';
    cell.style.position = "absolute";
    cell.style.left = '100px'; // these are only for the first cell
    cell.style.top = '200px';  // ^^
    cell.style.background = 'white';
    document.body.appendChild(cell);
    snake.push(cell);
    lengthOfSnake++;
}

function moveCell(cell, direction) {
    var x = cell.style.left;
    x = x.substring(0, x.indexOf("px"));
    var y = cell.style.top;
    y = y.substring(0, y.indexOf("px"));

    if (direction === 8) { //up
        if (y >= step) {
            y = Number.parseInt(y) - step;
        } else {
            y = window.innerHeight - (window.innerHeight % step) - step;
        }
    }
    if (direction === 6) { //right
        if (x < window.innerWidth - (window.innerWidth % step) - step) {
            x = Number.parseInt(x) + step;
        } else {
            x = 0;
        }
    }
    if (direction === 2) { //down
        if (y < window.innerHeight - (window.innerHeight % step) - step) {
            y = Number.parseInt(y) + step;
        } else {
            y = 0;
        }
    }
    if (direction === 4) { //left
        if (x >= step) {
            x = Number.parseInt(x) - step;
        } else {
            x = window.innerWidth - (window.innerWidth % step) - step;
        }
    }
    x += 'px';
    y += 'px';

    // see if apple touched
    if (x == apple.style.left && y == apple.style.top) {
        moveApple();
        addChild();
        snake[lengthOfSnake].style.left = snake[lengthOfSnake - 1].style.left;
        snake[lengthOfSnake].style.top = snake[lengthOfSnake - 1].style.top;
        score += 10;
        scoreText.innerHTML = "Score: " + score;
    }
    cell.style.left = x;
    cell.style.top = y;

    // check if it's eating itself
    for (var i = 1; i < snake.length; i++) {
        if (cell.style.left === snake[i].style.left
            && cell.style.top === snake[i].style.top) {
            stop();
            gameOver = true;
            textOnScreen.innerHTML = "Score: " + score +  ". Hit Enter to Restart.";
        }
    }
}

function addChild() {
    createCell();
}

function spawnApple() {
    apple = document.createElement("div");
    apple.style.width = '25px';
    apple.style.height = '25px';
    apple.style.borderRadius = '5px';
    apple.style.position = "absolute";
    apple.style.background = 'red';
    document.body.appendChild(apple);

    moveApple();
}

function moveApple() {
    var randomX = Math.random() * window.innerWidth;
    randomX -= randomX % step;
    if(randomX >= window.innerWidth - (window.innerWidth % step) - step){
        randomX -= step;
    }
    var randomY = Math.random() * window.innerHeight;
    randomY -= randomY % step;
    if(randomY >= window.innerHeight - (window.innerHeight % step) - step){
        randomY -= step;
    }
    apple.style.left = randomX + 'px';
    apple.style.top = randomY + 'px';
}

function mover() {
    for (var i = snake.length - 1; i > 0; i--) {
        snake[i].style.left = snake[i - 1].style.left;
        snake[i].style.top = snake[i - 1].style.top;
    }
    moveCell(snake[0], direction); // move the head of the snake in some direction    
}

function play() {
    game = setInterval(mover, 1000 / fps);
    playing = true;
    gameOver = false;
    textOnScreen.innerHTML = "Arrow keys to move. P to Pause/Play.";
}

function stop() {
    clearInterval(game); // stops the game
    playing = false;
}

function reset(){
    for(var i = 0; i < snake.length; i++){
        document.body.removeChild(snake[i]);
    }
    lengthOfSnake = -1;
    snake = [];
    direction = 6;    
    createCell();
    moveApple();
    score = 0;
    scoreText.innerHTML = "Score: 0";
}

var xDown, yDown;

// Handles the touch start
function handleTouchStart(evt){
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
    if(gameOver){
        for(var i = 0; i < snake.length; i++){
            var x = snake[i].style.left;
            x = x.substring(0, x.indexOf("px"));
            var y = snake[i].style.top;
            y = y.substring(0, y.indexOf("px"));
            x = Number.parseInt(x);
            y = Number.parseInt(y);
            if(xDown >= x && xDown <= (x + step) 
                && yDown >= y && yDown <= (y + step)){
                reset();
                play();  
            }
        }
    }
}

function handleTouchMove(evt){
    if(!xDown || !yDown){
        return;
    }
    
    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    // left/right
    if(Math.abs(xDiff) > Math.abs(yDiff)){
        if(xDiff > 0){
            //alert("left swipe");
            direction = 4;
        } else {
            //alert("right swipe");
            direction = 6;
        }
    } else {
        //up/down
        if(yDiff > 0){
            //alert("up swipe");
            direction = 8;
        } else {
            //alert("down swipe");
            evt.preventDefault();
            direction = 2;
        }
    }

    xDown = null;
    yDown = null;
}

function initialize() {
    createCell();
    play();
    document.body.appendChild(textOnScreen);
    document.body.appendChild(scoreText);
    document.addEventListener("keydown", function (event) {
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
        if (event.keyCode === 82 || event.keyCode == 80) {
            if (playing) {
                stop();
            } else {
                if (!gameOver)
                    play();
            }
        }
        if (event.keyCode === 13 && gameOver){
            //console.log("game over. hit reset or touch the snake")
            reset();
            play();
        }
    });

    spawnApple();

    window.addEventListener("touchstart", handleTouchStart, false);
    window.addEventListener("touchmove", handleTouchMove, false);
}

if (document.addEventListener) {
    document.addEventListener("load", initialize(), false);
}
