const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let x = 100;
let y = 100;

let LEFT, UP, RIGHT, DOWN;

function drawBall(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.strokeStyle = "black";
  ctx.stroke();
  ctx.fillStyle = "red";
  ctx.fill();
}

canvas.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") {
    LEFT = true;
  }
  if (e.code === "ArrowUp") {
    UP = true;
  }
  if (e.code === "ArrowRight") {
    RIGHT = true;
  }
  if (e.code === "ArrowDown") {
    DOWN = true;
  }
});

canvas.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft") {
    LEFT = false;
  }
  if (e.code === "ArrowUp") {
    UP = false;
  }
  if (e.code === "ArrowRight") {
    RIGHT = false;
  }
  if (e.code === "ArrowDown") {
    DOWN = false;
  }
});

function move() {
  if (LEFT) {
    x--;
  }
  if (UP) {
    y--;
  }
  if (RIGHT) {
    x++;
  }
  if (DOWN) {
    y++;
  }
}

function mainLoop() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  move();
  drawBall(x, y, 20);
  requestAnimationFrame(mainLoop)
}

requestAnimationFrame(mainLoop)