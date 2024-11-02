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

  unit() {
    if (this.mag() === 0) {
      return new Vector(0, 0);
    } else {
      return new Vector(this.x / this.mag(), this.y / this.mag());
    }
  }

  static dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  normal() {
    return new Vector(-this.y, this.x).unit();
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
    this.pos = new Vector(x, y);
    this.r = r;
    this.vel = new Vector(0, 0);
    this.acc = new Vector(0, 0);
    this.acceleration = 2;
    this.player = false;
    BALLZ.push(this);
  }

  drawBall() {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.fillStyle = "red";
    ctx.fill();
  }

  display() {
    this.vel.drawVec(this.pos.x, this.pos.y, 10, "green");
    this.acc.drawVec(this.pos.x, this.pos.y, 100, "blue");
  }

  reposition() {
    this.acc = this.acc.unit().mult(this.acceleration);
    this.vel = this.vel.add(this.acc);
    this.vel = this.vel.mult(1 - friction);
    this.pos = this.pos.add(this.vel);
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
}

function coll_det_bb(b1, b2) {
  if (b1.r + b2.r >= b2.pos.subtr(b1.pos).mag()) {
    return true;
  } else {
    return false;
  }
}

function pen_res_bb(b1, b2) {
  let dist = b1.pos.subtr(b2.pos);
  let pen_depth = b1.r + b2.r - dist.mag();
  let pen_res = dist.unit().mult(pen_depth / 2);
  b1.pos = b1.pos.add(pen_res);
  b2.pos = b2.pos.add(pen_res.mult(-1));
}

function coll_res_bb(b1, b2) {
  let normal = b1.pos.subtr(b2.pos).unit();
  let relVel = b1.vel.subtr(b2.vel);
  let sepVel = Vector.dot(relVel, normal);
  let new_sepVel = -sepVel;
  let sepVelVec = normal.mult(new_sepVel);
  b1.vel = b1.vel.add(sepVelVec);
  b2.vel = b2.vel.add(sepVelVec.mult(-1));
}

function momentum_display() {
  let momentum = Ball1.vel.add(Ball2.vel).mag();
  ctx.fillText("Momentum" + momentum.toFixed(4), 500, 300);
}

function mainLoop() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  BALLZ.forEach((b, index) => {
    b.drawBall();
    if (b.player) {
      keyControl(b);
    }
    for (let i = index + 1; i < BALLZ.length; i++) {
      if (coll_det_bb(BALLZ[index], BALLZ[i])) {
        pen_res_bb(BALLZ[index], BALLZ[i]);
        coll_res_bb(BALLZ[index], BALLZ[i]);
      }
    }
    b.display();
    b.reposition();
  });
  momentum_display();
  requestAnimationFrame(mainLoop);
}
let Ball1 = new Ball(200, 200, 30);
let Ball2 = new Ball(300, 250, 40);

Ball1.player = true;
requestAnimationFrame(mainLoop);
