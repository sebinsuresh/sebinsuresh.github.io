"use strict";

var eyeball;
var logText;
var centerX, centerY;
// Values from DeviceOrientationEvent
var absolute, alpha, beta, gamma;
var maxYDisplacement_eyeball;
var maxXDisplacement_eyeball;

function clickedOnBall() {
    //console.log(window.getComputedStyle(ball, null).getPropertyValue("left"));
    console.log(eyeball.style.top);
}

function handleOrientation(event) {
    absolute = event.absolute;
    // Represented in degrees
    alpha = event.alpha; //Motion around z-axis, (0,360)deg
    beta = event.beta; //Motion around x-axis, (-180,180)deg
    gamma = event.gamma; //Motion around y-axis, (-90,90)deg

    logText.innerText = "absolute: " + absolute + "\n alpha: " + alpha + "\n beta: " + beta + "\n gamma: " + gamma;
    /* Little hack I read online. use ~~ instead of Math.floor in js for better peformance. */
    var x = ~~(gamma);
    var y = ~~(beta);

    // Keep y in between -30 and 100 deg. 
    if (y < -30) y = -30;
    if (y > 100) y = 100;
    y = y - 35; //Makes y in [-65,65]
    eyeball.style.top = (centerY - 25) + (maxYDisplacement_eyeball * y / 130) + 'px';

    // Keep x in between [-45,45]
    if(x<-45)x=-45;
    if(x>45)x=45;
    eyeball.style.left = (centerX - 25) + (maxXDisplacement_eyeball * x / 90) + 'px';

    logText.innerText += "\nx = " + x + " y = " + y;
}

function initialize() {
    eyeball = document.getElementById("eyeball");
    logText = document.getElementById("logText");
    centerX = window.innerWidth/2;
    centerY = window.innerHeight/2;
    maxYDisplacement_eyeball = 50;
    maxXDisplacement_eyeball = 50;

    eyeball.style.top = centerY - 25 + 'px';
    eyeball.style.left = centerX - 25 + 'px';
    eyeball.addEventListener("click", clickedOnBall, false);
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", handleOrientation, true);
        console.log("deviceorientation supported.");
    }
}

if (document.addEventListener) {
    document.addEventListener("", initialize(), false);
}