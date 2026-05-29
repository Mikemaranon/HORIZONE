class StarField {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.stars = [];
    this.pointer = { x: 0, y: 0 };
    this.resize();
    this.bindEvents();
    this.createStars();
    this.animate();
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.resize();
      this.createStars();
    });
    window.addEventListener("pointermove", (event) => {
      this.pointer.x = (event.clientX / window.innerWidth - 0.5) * 16;
      this.pointer.y = (event.clientY / window.innerHeight - 0.5) * 16;
    });
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.height = this.canvas.height = window.innerHeight * window.devicePixelRatio;
  }

  createStars() {
    const amount = Math.floor(window.innerWidth / 5);
    this.stars = Array.from({ length: amount }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      radius: Math.random() * 1.8 + 0.2,
      speed: Math.random() * 0.35 + 0.08,
      alpha: Math.random() * 0.7 + 0.15,
    }));
  }

  animate() {
    const ctx = this.context;
    ctx.clearRect(0, 0, this.width, this.height);
    const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
    gradient.addColorStop(0, "rgba(0, 136, 255, 0.22)");
    gradient.addColorStop(1, "rgba(0, 213, 255, 0.04)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    for (const star of this.stars) {
      star.y += star.speed * window.devicePixelRatio;
      if (star.y > this.height) star.y = 0;
      ctx.beginPath();
      ctx.arc(star.x + this.pointer.x, star.y + this.pointer.y, star.radius * window.devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(130, 220, 255, ${star.alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(() => this.animate());
  }
}

class RevealController {
  constructor() {
    this.observer = new IntersectionObserver(this.handleEntries.bind(this), { threshold: 0.18 });
    document.querySelectorAll("[data-reveal]").forEach((element) => this.observer.observe(element));
  }

  handleEntries(entries) {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("visible");
      this.observer.unobserve(entry.target);
    }
  }
}

class MagneticElements {
  constructor() {
    document.querySelectorAll(".magnetic").forEach((element) => this.bindElement(element));
  }

  bindElement(element) {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });
    element.addEventListener("pointerleave", () => {
      element.style.transform = "translate(0, 0)";
    });
  }
}

class TiltCard {
  constructor() {
    const card = document.querySelector(".tilt-card");
    if (!card) return;
    card.addEventListener("pointermove", (event) => this.tilt(event, card));
    card.addEventListener("pointerleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  }

  tilt(event, card) {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  }
}

new StarField(document.getElementById("horizon-field"));
new RevealController();
new MagneticElements();
new TiltCard();
