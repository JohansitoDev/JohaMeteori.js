(function () {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.zIndex = "-1";
  canvas.style.pointerEvents = "none";
  canvas.style.background = "radial-gradient(circle at top, #0c1020 0%, #050508 100%)";

  document.body.prepend(canvas);

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const meteors = [];
  const sparks = [];

  class Meteor {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width * 1.2;
      this.y = Math.random() * -200;
      this.length = Math.random() * 80 + 40;
      this.speed = Math.random() * 10 + 15;
      this.angle = 0.75; 
      this.size = Math.random() * 2 + 1;
    }

    update() {
      this.x -= this.speed * Math.cos(this.angle);
      this.y += this.speed * Math.sin(this.angle);

      if (Math.random() < 0.4) {
        sparks.push(new Spark(this.x, this.y, this.size));
      }

      if (this.y > height || this.x < -100) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      const gradient = ctx.createLinearGradient(
        this.x,
        this.y,
        this.x + this.length * Math.cos(this.angle),
        this.y - this.length * Math.sin(this.angle)
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.1, "rgba(0, 191, 255, 0.5)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = this.size;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x + this.length * Math.cos(this.angle),
        this.y - this.length * Math.sin(this.angle)
      );
      ctx.stroke();
    }
  }

  class Spark {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size * 0.8;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.alpha = 1;
      this.decay = Math.random() * 0.03 + 0.01;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = "#00bfff";
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 6; i++) {
    meteors.push(new Meteor());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = meteors.length - 1; i >= 0; i--) {
      meteors[i].update();
      meteors[i].draw();
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      sparks[i].update();
      sparks[i].draw();
      if (sparks[i].alpha <= 0) {
        sparks.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
