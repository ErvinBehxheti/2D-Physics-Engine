const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const BALLZ = [];

let LEFT, UP, RIGHT, DOWN;
let friction = 0.1;

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  subtr(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  mult(n) {
    return new Vector(this.x * n, this.y * n);
  }

  drawVec(start_x, start_y, n, color) {
    ctx.beginPath();
    ctx.moveTo(start_x, start_y);
    ctx.lineTo(start_x + this.x * n, start_y + this.y * n);
    ctx.strokeStyle = color;
    ctx.stroke();
  }
}

class Ball {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vel = new Vector(0, 0);
    this.acc = new Vector(0, 0);
    this.acceleration = 2;
    this.player = false;
    BALLZ.push(this);
  }

  drawBall() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.fillStyle = "red";
    ctx.fill();
  }

  display() {
    this.vel.drawVec(this.x, this.y, 10, "green");
    this.acc.drawVec(this.x, this.y, 100, "blue");
  }
}

function keyControl(b) {
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

  if (LEFT) {
    b.acc.x = -b.acceleration;
  }
  if (UP) {
    b.acc.y = -b.acceleration;
  }
  if (RIGHT) {
    b.acc.x = b.acceleration;
  }
  if (DOWN) {
    b.acc.y = b.acceleration;
  }

  if (!UP && !DOWN) {
    b.acc.y = 0;
  }

  if (!RIGHT && !LEFT) {
    b.acc.x = 0;
  }
  b.vel = b.vel.add(b.acc);
  b.vel = b.vel.mult(1 - friction);
  b.x += b.vel.x;
  b.y += b.vel.y;
}

function mainLoop() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  BALLZ.forEach((b) => {
    b.drawBall();
    if (b.player) {
      keyControl(b);
    }
    b.display();
  });
  requestAnimationFrame(mainLoop);
}
let Ball1 = new Ball(100, 100, 50);
Ball1.player = true;
requestAnimationFrame(mainLoop);
