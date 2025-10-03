const canvas = document.getElementById("StarCanvas");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Star {
  constructor() {
    this.reset();
  }

  reset() {
    const sidebar = document.querySelector("aside");
    const sidebarWidth = sidebar ? sidebar.offsetWidth : 0;

    this.x = sidebarWidth + Math.random() * (canvas.width - sidebarWidth);
    // only in bottom 1/3 of the page
    this.baseY = canvas.height * (2/3) + Math.random() * (canvas.height / 3);
    this.y = this.baseY;

    this.radius = 1 + Math.random() * 1.5; // smaller stars
    this.opacity = Math.random(); 
    this.opacityDirection = Math.random() < 0.5 ? 1 : -1; 
    this.speedX = Math.random() * 0.03 - 0.015; // slower horizontal drift
    this.speedY = Math.random() * 0.05 - 0.025; // slower vertical float
    this.twinkleSpeed = 0.002 + Math.random() * 0.003; // slower fading
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // bounce vertically within a small range around baseY
    if (this.y < this.baseY - 10 || this.y > this.baseY + 10) {
      this.speedY *= -1;
    }

    // fading in/out
    this.opacity += this.twinkleSpeed * this.opacityDirection;
    if (this.opacity >= 1) this.opacityDirection = -1;
    if (this.opacity <= 0.1) this.opacityDirection = 1;
  }

  draw() {
    ctx.save();
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
    gradient.addColorStop(0, `rgba(255,255,255,${this.opacity})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }
}

function createStars(count) {
  for (let i = 0; i < count; i++) {
    stars.push(new Star());
  }
}

// Fewer stars
createStars(15);
animate();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(star => {
    star.update();
    star.draw();
  });
  requestAnimationFrame(animate);
}
