
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2D");
canvas.width = 1366;
canvas.height = 748;
document.appendChild(canvas);

// BackgroundImage

var bgReady = false;
var fondDesktop = new Image();
fondDesktop.onload = function(){
    bgReady = true;
}
fondDesktop.src = "images/Web1366Fond.png";

//Prof image par defaut

var rivalImg = false;
var rivalDefaut = new Image();
rivalDefaut.width = 50;
rivalDefaut.height = 60;
rivalDefaut.onload = function(){
    rivalImg = true;
}
rivalDefaut.src = "images/old.png";

//SnakeImage par defaut

var snakeImg = false;
var snakeDefaut = new Image();
snakeDefaut.width = 50;
snakeDefaut.height = 100;
snakeDefaut.onload = function(){
    snakeImg = true;
}
snakeDefaut.src = "images/SnakeSmall.png";

