document.addEventListener("DOMContentLoaded", () => {
  const bottleWrapper = document.getElementById("bottleWrapper");
  const perfumeBottle = document.getElementById("perfumeBottle");
  const boxWrapper = document.getElementById("boxWrapper");
  const sprayText = document.getElementById("sprayText");

  const canvas = document.getElementById("sprayCanvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let particles = [];
  let isSpraying = false;

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.8) * 5;
      this.vy = (Math.random() - 0.5) * 3 - 1.5;
      this.size = Math.random() * 3 + 1;
      this.alpha = 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.02;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(this.alpha, 0);
      ctx.fillStyle = "#e5c158";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function emitSpray() {
    const rect = bottleWrapper.getBoundingClientRect();
    const sprayX = rect.left + rect.width * 0.5;
    const sprayY = rect.top + rect.height * 0.15;

    for (let i = 0; i < 6; i++) {
      particles.push(new Particle(sprayX, sprayY));
    }
  }

  function animateSpray() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (isSpraying) {
      emitSpray();
    }
    particles.forEach((p, index) => {
      p.update();
      p.draw();
      if (p.alpha <= 0) particles.splice(index, 1);
    });
    requestAnimationFrame(animateSpray);
  }
  animateSpray();

  // Scroll Actions
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = scrollY / totalHeight;

    // Bottle vertical movement
    const topY = 25 + scrollPercent * 40;
    bottleWrapper.style.top = `${topY}%`;

    // Spray Section & Bottle Cap Animation Trigger
    const spraySection = document.getElementById("spray-section");
    const sprayRect = spraySection.getBoundingClientRect();

    if (sprayRect.top < window.innerHeight * 0.6 && sprayRect.bottom > window.innerHeight * 0.4) {
      isSpraying = true;
      sprayText.classList.add("visible");
      // Bottle ka upper cap thoda sa upar move hoga aur spray effect shuru hoga
      perfumeBottle.style.transform = "translateY(-20px) rotate(-5deg)";
    } else {
      isSpraying = false;
      sprayText.classList.remove("visible");
      perfumeBottle.style.transform = "translateY(0px) rotate(0deg)";
    }

    // Product Box Packing Transition
    const productSection = document.getElementById("product-section");
    const productRect = productSection.getBoundingClientRect();

    if (productRect.top < window.innerHeight * 0.5) {
      bottleWrapper.style.opacity = "0";
      bottleWrapper.style.transform = "translate(-50%, -50%) scale(0.7)";

      boxWrapper.style.opacity = "1";
      boxWrapper.style.transform = "translate(-50%, -50%) scale(1)";
    } else {
      bottleWrapper.style.opacity = "1";
      bottleWrapper.style.transform = "translate(-50%, -50%) scale(1)";

      boxWrapper.style.opacity = "0";
      boxWrapper.style.transform = "translate(-50%, -50%) scale(0.6)";
    }
  });
});