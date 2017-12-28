"use strict";

var ball = document.getElementById("ball");
var radius;
var bRadius = 100; //The bigger radius that the ball would revolve around
var fps = 60; // Target
var x, y; // for the ball
var xForward = true, yDownward = true;

function printTest() {
    var text = document.createElement("div");
    text.innerHTML += "test ";
    document.body.appendChild(text);
}
function delayedTest() {
    setInterval(printTest, 500);
}

// might only work on some new browsers - IE8 and older are not supported
function getStyleVal(element, property) {
    var toReturn = window.getComputedStyle(element, null).getPropertyValue(property);
    if (property === "border-radius" && toReturn === "") {
        toReturn = window.getComputedStyle(element, null).getPropertyValue("border-top-left-radius");
    }
    return toReturn;
}

function setRadiusVal() {
    var radius = getStyleVal(ball, "border-radius");
    radius = radius.substring(0, radius.indexOf("px"));
    //console.log("radius: " + radius);
    this.radius = radius;
    ball.style.position = "absolute"; //do this also so don't have to call it every iteration
}

function changeBallPos(x, y) {
    //ball.style.position = "absolute";
    ball.style.left = (x) + 'px';
    ball.style.top = (y) + 'px';
}

function changeBallPos1(x, y) {
    ball.style.position = "absolute";
    ball.style.left = (x - radius) + 'px';
    ball.style.top = (y - radius) + 'px';
}

function changeBallPos2(event) {
    changeBallPos(event.clientX, event.clientY);
}

function setUp() {
    x = bRadius;
    y = 0;
    changeBallPos(x, y);

    setInterval(update, 1000 / fps);
}

var pi = Math.PI;
var step = pi / 2;
var angle = -step;

function update() {
    // this method keeps changing the position of the ball  

    // if (x >= 2 * bRadius)
    //     xForward = false;
    // if (x <= 0)
    //     xForward = true;
    // xForward = (xForward) && (x < 2 * bRadius); // alternate way
    // xForward = !(!(xForward) && (x > 0));
    // if (y >= 2 * bRadius)
    //     yDownward = false;
    // if (y <= 0)
    //     yDownward = true;
    // if (xForward)
    //     x += 5;
    // else
    //     x -= 5;
    // if (yDownward)
    //     y += 5;
    // else
    //     y -= 5;

    angle += 2 * pi / fps; // remember to convert to radian
    
    if (angle >= 3.5 * pi) { //when it completes one revolution
        angle = pi + step;
    }

    x = bRadius * (1 + Math.cos(angle));
    y = bRadius * (1 + Math.sin(angle));

    changeBallPos(x, y);
    //console.log(angle);
}

function setEventListeners() {
    if (document.addEventListener) {
        //document.addEventListener("mousedown", changeBallPos2, false);
    } else if (document.attachEvent) {
        //document.attachEvent("onclick", changeBallPos2);
    }
}

if (window.addEventListener) {
    //window.addEventListener("load", changeBallPos(250, 300), false);.
    window.addEventListener("load", setRadiusVal, false);
    window.addEventListener("load", setUp, false);
} else if (window.attachEvent) {
    window.attachEvent("onload", setRadiusVal);
    window.attachEvent("onload", setUp);
}