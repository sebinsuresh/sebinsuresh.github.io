// Sebin Puthenthara Suresh
// 8/14/2018
// Attempt at simulating 3d vertices on a 2d screen
"use strict";

var oneDegree;
var loop;
var index;
var fps;
var speedUp;
var balls;
var ballRadius;
var canvas;
var ctx;
var windowWidth, windowHeight;
var playing;
var keyValues = {
	'ctrlDown' : false,
	'shiftDown' : false,
	'arrowLeftDown' : false,
	'arrowRighftDown' : false,
	'arrowDownDown' : false,
	'arrowUpDown' : false,
	'direction' : "r"
};
//document.addEventListener("onload", initialize(), false);
window.onload = initialize();

// function that sets up things, runs when the document has loaded
function initialize(){
	oneDegree = Math.PI/180;
	index = oneDegree;
	fps = 120;
	speedUp = 1;
	ballRadius = 5;
	playing = false;
	balls = [];
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
	
	canvas = document.createElement("canvas");
	document.body.appendChild(canvas);	
	canvas.style.position = "absolute";
	canvas.style.top = "0px";
	canvas.style.left = "0px";
	canvas.width = windowWidth;
	canvas.height = windowHeight;
	ctx = null;
	if(canvas.getContext){
		ctx = canvas.getContext('2d');
	}
	
	for(var i = 0; i < 8; i++){
		balls[i] = createBall();
		document.body.appendChild(balls[i]);
	}
	
	balls[0].x = -100;
	balls[0].y = 100;
	balls[0].z = 100;
	
	balls[1].x = 100;
	balls[1].y = 100;
	balls[1].z = 100;
	
	balls[2].x = -100;
	balls[2].y = -100;
	balls[2].z = 100;
	
	balls[3].x = 100;
	balls[3].y = -100;
	balls[3].z = 100;
	
	balls[4].x = -100;
	balls[4].y = 100;
	balls[4].z = -100;
	
	balls[5].x = 100;
	balls[5].y = 100;
	balls[5].z = -100;
	
	balls[6].x = -100;
	balls[6].y = -100;
	balls[6].z = -100;
	
	balls[7].x = 100;
	balls[7].y = -100;
	balls[7].z = -100;
	
	
	for(var i = 0; i < balls.length; i++){
		placeBall(balls[i]);
	}	
	play();
	document.body.focus();
}

window.onkeydown = keyDownHandle;
window.onkeyup = keyUpHandle;

// handles the keyDown events
function keyDownHandle(event){
	console.log(event.key + "-pressed");
	if(event.key === " " || event.key ==="Enter"){
		play(); //play/pause
	} else {
		if(event.key=="Shift"){
			keyValues.shiftDown = true;
			if(playing) play(); //pause
		}
		if(event.key=="Control"){
			keyValues.ctrlDown = true;
			if(playing) play(); //pause
		}
		
		if(event.key=="ArrowLeft"){
			keyValues.arrowLeftDown = true;
			if(playing) play(); //pause
		}
		if(event.key=="ArrowRight"){
			keyValues.arrowRightDown = true;
			if(playing) play(); //pause			
		}
		if(event.key=="ArrowUp"){
			keyValues.arrowUpDown = true;
			if(playing) play(); //pause
		}
		if(event.key=="ArrowDown"){
			keyValues.arrowDownDown = true;	
			if(playing) play(); //pause
		}
	}
	
	useKeyValues();
}

// handles the keyUp events
function keyUpHandle(event){
	console.log(event.key + "-released");
	if(event.key=="Shift"){
		keyValues.shiftDown = false;
	}
	if(event.key=="Control"){
		keyValues.ctrlDown = false;
	}
	
	if(event.key=="ArrowLeft"){
		keyValues.arrowLeftDown = false;
	}
	if(event.key=="ArrowRight"){
		keyValues.arrowRightDown = false;		
	}
	if(event.key=="ArrowUp"){
		keyValues.arrowUpDown = false;
	}
	if(event.key=="ArrowDown"){
		keyValues.arrowDownDown = false;		
	}	
	
	useKeyValues();
}

// Uses the keyValues to rotate accordingly
function useKeyValues(){
	speedUp = 1;
	if(keyValues.arrowLeftDown){
		if(keyValues.ctrlDown){
			
		} else {
			
		}
	}
	if(keyValues.arrowRightDown){
		if(keyValues.ctrlDown){
			
		} else {
			
		}
	}
	if(keyValues.arrowUpDown){
		
	}
	if(keyValues.arrowDownDown){
		
	}	
}

// plays/pauses the rotation
function play(){
	if(playing == false){
		loop = window.setInterval(rotateLoop, ~~(1000/fps));
		playing = true;
	} else {
		clearInterval(loop);
		playing = false;
	}	
}

// Creates a div that looks like a circle
// Adds x,y,z elements to this div 
//  (^^This doesn't exist for a normal div element,
//   but javascript is loosely typed and you can simply
//   add elements like that)
function createBall(){
	var created = document.createElement("div");
	created.style.height = 2*ballRadius + 'px';
	created.style.width= 2*ballRadius + 'px';
	created.style.borderRadius = ballRadius + 'px';	
	created.style.background = 'black';
	if(balls.length > 3) created.style.background = 'red';
	created.style.position = 'absolute';
	
	//Euclidean Coordinates
	created.x = 0;	
	created.y = 0;
	created.z = 0;
	
	return created;
}

// draws a canvas lineTo between the balls
function drawLineBetween(ball1, ball2){	
	ctx.beginPath();
	ctx.moveTo(windowWidth/2 + ball1.x + ballRadius, windowHeight/2 + ball1.y + ballRadius);
	ctx.lineTo(windowWidth/2 + ball2.x + ballRadius, windowHeight/2 + ball2.y + ballRadius);
	ctx.stroke();
}

//draws line between balls at given indices
function drawLineBWIndices(index1, index2){
	drawLineBetween(balls[index1],balls[index2]);
}

// This is called repeatedly "fps" times per second 
//  from the initialize() function
function rotateLoop(){	
	rotateAll(index, "x");
	rotateAll(2*index, "y");
	rotateAll(index, "z");
	
	drawLines();	
}

// draw all the lines connecting the balls
function drawLines(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(var i = 0; i < balls.length; i++){
		if(i < 4) drawLineBWIndices(i,i+4);
		if(~~(i/2)%2==0) drawLineBWIndices(i,i+2);
		if(i%2==0)drawLineBWIndices(i,i+1);		
	}
}

// Sets the on-screen cordinates of the ball
// Offset to center of screen
function placeBall(ball){
	ball.style.left = windowWidth/2 + ball.x + 'px';
	ball.style.top = windowHeight/2 + ball.y	+ 'px';	
}

// Takes a vector matrix and sets the coordinates
//  to those values of a given ball
function setBallCoord(ball, vector){
	ball.x = vector[0][0];
	ball.y = vector[1][0];
	ball.z = vector[2][0];
}

//return the x,y,z as a 3x1 ("column") matrix
function getColumnVertex(ball){
	return [
	[ball.x],
	[ball.y],
	[ball.z]
	];
}

// Multiplies a matrix/array N x M and M x P and 
//  returns a N x P matrix/array
function multiplyMatrices(a,b){
	if(a[0].length !== b.length){
		console.log("Matrix multiplication not possible");
		return;
	}
	
	var product = [];
	for(var a_row = 0; a_row < a.length; a_row++){
		product[a_row] = [];
		for(var b_col = 0; b_col < b[0].length; b_col++){
			// each cell of the resulting matrix, 'product'
			var cellABSum = 0; 
			for(var b_row = 0; b_row < b.length; b_row++){
				cellABSum += a[a_row][b_row]*b[b_row][b_col];
			}
			product[a_row][b_col] = cellABSum;
		}
	}
	return product;
}

// These functions return the matrix product of
// the rotation matrix and position vector matrix
// and return a vector matrix
// Angle in radians, rotaion counter-clockwise

// rotate around x axis and return the vector result
function rotateX(ball, angle){
	var rotationMatrix = [
	[1, 0, 				 0],
	[0, Math.cos(angle), -Math.sin(angle)],
	[0, Math.sin(angle), Math.cos(angle)]
	];
	
	return multiplyMatrices(rotationMatrix, getColumnVertex(ball));
}

// rotate around y axis and return the vector result
function rotateY(ball, angle){
	var rotationMatrix = [
	[Math.cos(angle),  0, Math.sin(angle)],
	[0,				   1, 0],
	[-Math.sin(angle), 0, Math.cos(angle)]
	];
	
	return multiplyMatrices(rotationMatrix, getColumnVertex(ball));
}

// rotate around z axis and return the vector result
function rotateZ(ball, angle){
	var rotationMatrix = [
	[Math.cos(angle), -Math.sin(angle), 0],
	[Math.sin(angle), Math.cos(angle),  0],
	[0,				  0,			    1]
	];
	
	return multiplyMatrices(rotationMatrix, getColumnVertex(ball));
}

// Rotate all the balls
// axis passed as a string
function rotateAll(angle, axis){
	if(axis==="x"||axis==="X"){
		for(var i = 0; i<balls.length; i++){
			var vector = rotateX(balls[i],angle);
			setBallCoord(balls[i],vector);
			placeBall(balls[i]);
		}
	}
	if(axis==="y"||axis==="Y"){
		for(var i = 0; i<balls.length; i++){
			var vector = rotateY(balls[i],angle);
			setBallCoord(balls[i],vector);
			placeBall(balls[i]);
		}
	}
	if(axis==="z"||axis==="Z"){
		for(var i = 0; i<balls.length; i++){
			var vector = rotateZ(balls[i],angle);
			setBallCoord(balls[i],vector);
			placeBall(balls[i]);			
		}
	}
}

