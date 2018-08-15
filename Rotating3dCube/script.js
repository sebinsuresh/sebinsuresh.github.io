// Sebin Puthenthara Suresh
// 8/14/2018
// Attempt at simulating 3d vertices on a 2d screen
"use strict";

var loop;
var index;
var fps;
var balls;
var ballRadius;
var canvas;
var ctx;
var windowWidth, windowHeight;
var playing;
//document.addEventListener("onload", initialize(), false);
window.onload = initialize();

// function that sets up things, runs when the document has loaded
function initialize(){
	index = 0;
	fps = 60;
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
		findBall(balls[i]);
	}	
	play();
}

function play(){
	loop = window.setInterval(rotateLoop, ~~(1000/fps));
	playing = true;
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
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var oneDegree = Math.PI/180;
	rotateAll(oneDegree, "x");
	rotateAll(2*oneDegree, "y");
	rotateAll(oneDegree, "z");
	
	//draw lines
	for(var i = 0; i < balls.length; i++){
		if(i < 4) drawLineBWIndices(i,i+4);
		if(~~(i/2)%2==0) drawLineBWIndices(i,i+2);
		if(i%2==0)drawLineBWIndices(i,i+1);		
	}
}

// Sets the on-screen cordinates of the ball
// Offset to center of screen
function findBall(ball){
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

// rotate around x axis
function rotateX(ball, angle){
	var rotationMatrix = [
	[1, 0, 				 0],
	[0, Math.cos(angle), -Math.sin(angle)],
	[0, Math.sin(angle), Math.cos(angle)]
	];
	
	return multiplyMatrices(rotationMatrix, getColumnVertex(ball));
}

// rotate around y axis
function rotateY(ball, angle){
	var rotationMatrix = [
	[Math.cos(angle),  0, Math.sin(angle)],
	[0,				   1, 0],
	[-Math.sin(angle), 0, Math.cos(angle)]
	];
	
	return multiplyMatrices(rotationMatrix, getColumnVertex(ball));
}

// rotate around z axis
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
			findBall(balls[i]);
		}
	}
	if(axis==="y"||axis==="Y"){
		for(var i = 0; i<balls.length; i++){
			var vector = rotateY(balls[i],angle);
			setBallCoord(balls[i],vector);
			findBall(balls[i]);
		}
	}
	if(axis==="z"||axis==="Z"){
		for(var i = 0; i<balls.length; i++){
			var vector = rotateZ(balls[i],angle);
			setBallCoord(balls[i],vector);
			findBall(balls[i]);
		}
	}
}