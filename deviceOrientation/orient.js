"use strict";

var eyeball;
var logText;
var windowHeight, windowWidth;
// Values from DeviceOrientationEvent
var absolute, alpha, beta, gamma;

function clickedOnBall(){
    //console.log(window.getComputedStyle(ball, null).getPropertyValue("left"));
    console.log(eyeball.style.top);
}

function handleOrientation(event){
    absolute = event.absolute;
    // Represented in degrees
    alpha = event.alpha; //Motion around z-axis, (0,360)deg
    beta = event.beta; //Motion around x-axis, (-180,180)deg
    gamma = event.gamma; //Motion around y-axis, (-90,90)deg

    logText.innerText = "absolute: " + absolute + "\n alpha: " + alpha + "\n beta: " + beta + "\n gamma: " + gamma;
    var x = Math.round(gamma*100)/100;
    var y = Math.round(beta*100)/100;
    if(y<-90)y=-90;
    if(y>90)y=90;
    if(x<-89.9)x=-90;
    if(x>89.9)x=90;
    logText.innerText += "\nx = " + x + " y = " + y;

    eyeball.style.top = windowHeight/2 - 25 + (windowHeight*y/180) + 'px';
    eyeball.style.left = windowWidth/2 - 25 + (windowWidth*x/180) + 'px';
}

function initialize(){
    eyeball = document.getElementById("ball");
    logText = document.getElementById("logText");
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    eyeball.style.top = windowHeight/2 - 25+ 'px';
    eyeball.style.left = windowWidth/2 - 25+ 'px';
    eyeball.addEventListener("click", clickedOnBall, false);     

    window.addEventListener("deviceorientation", handleOrientation, true);
}

if(document.addEventListener){
    document.addEventListener("", initialize(), false);
}