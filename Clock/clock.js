"use strict";

var clockRadius = 250;
var clockPosX;
var clockPosY;
var clockCircle;
var PI_OVER_180 = Math.PI / 180;
var secondHand;
var minuteHand;
var hourHand;
var loop;
var centerButton;
var mode;

function setLines() {
    for (var i = 0; i < 12; i++) {
        var currLine = document.getElementById(i);
        //currLine.style.top = (parseInt(clockPosY, 10) + clockRadius) + (clockRadius * Math.sin((i * 30 - 90) * PI_OVER_180)) + 'px';
        currLine.style.top = (clockRadius * Math.sin((i * 30 - 90) * PI_OVER_180)) + 'px';
        currLine.style.left = (clockRadius * Math.cos((i * 30 - 90) * PI_OVER_180)) + 'px';
        currLine.style.transform = "rotate(" + (i * 30 + 90) + "deg)";
    }
}

function drawHands() {
    var currentTime = new Date(Date.now());
    //console.log(currentTime);
    if (mode !== 1) {
        secondHand.style.transform = "rotate(" + ((6 * (currentTime.getSeconds() + currentTime.getMilliseconds() / 1000)) - 90) + "deg)";
        minuteHand.style.transform = "rotate(" + ((6 * (currentTime.getMinutes() + currentTime.getSeconds() / 60)) - 90) + "deg)";
        hourHand.style.transform = "rotate(" + ((30 * (currentTime.getHours() + currentTime.getMinutes() / 60)) - 90) + "deg)";
    } else {
        secondHand.style.transform = "rotate(" + ((6 * (currentTime.getSeconds())) - 90) + "deg)";
        minuteHand.style.transform = "rotate(" + ((6 * (currentTime.getMinutes())) - 90) + "deg)";
        hourHand.style.transform = "rotate(" + ((30 * (currentTime.getHours() + currentTime.getMinutes() / 60)) - 90) + "deg)";
    }

}

function buttonClicked() {
    if (mode === 1) {
        clearInterval(loop);
        mode = 0;
    } else if (mode === 0) {
        mode = 120;
        clearInterval(loop);
        loop = setInterval(drawHands, 1000 / mode);
    } else if (mode === 120) {
        mode = 60;
        clearInterval(loop);
        loop = setInterval(drawHands, 1000 / mode);
    } else if (mode === 60) {
        mode = 30;
        clearInterval(loop);
        loop = setInterval(drawHands, 1000 / mode);
    } else if (mode === 30) {
        mode = 1;
        clearInterval(loop);
        loop = setInterval(drawHands, 1000 / mode);
    }

}

function initialize() {
    clockCircle = document.getElementById("circle");
    secondHand = document.getElementById("second");
    minuteHand = document.getElementById("minute");
    hourHand = document.getElementById("hour");
    centerButton = document.getElementById("centerButton");

    clockPosX = window.getComputedStyle(clockCircle, null).left;
    clockPosY = window.getComputedStyle(clockCircle, null).top;
    setLines();

    mode = 30;
    loop = setInterval(drawHands, 1000 / mode);
    centerButton.addEventListener("click", buttonClicked, false);
}

if (window.addEventListener) {
    window.addEventListener("load", initialize(), false);
}