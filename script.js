document.getElementById("year").textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll(".reveal");
const parallaxEl = document.querySelector("[data-parallax]");

const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle("is-scrolled", y > 20);

  if (parallaxEl && !reduceMotion) {
    const offset = Math.min(y * 0.35, 140);
    parallaxEl.style.setProperty("--py", `${offset}px`);
  }
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

/* Split Text — brand letter reveal */
document.querySelectorAll("[data-split]").forEach((el) => {
  const text = el.textContent;
  el.setAttribute("aria-label", text);
  el.textContent = "";

  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "char";
    span.style.setProperty("--i", String(i));
    span.textContent = ch === " " ? "\u00A0" : ch;
    el.appendChild(span);
  });
});

/* Callback form — front-end only */
document.querySelector(".callback")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = e.currentTarget.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = "Заявка принята";
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
    e.currentTarget.reset();
  }, 2200);
});

if (!reduceMotion) {
  /* Magnet CTA */
  document.querySelectorAll(".magnet").forEach((el) => {
    const strength = 0.25;
    el.addEventListener("pointermove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.setProperty("--mx", `${x * strength}px`);
      el.style.setProperty("--my", `${y * strength}px`);
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    });
  });

  /* Glare Hover */
  document.querySelectorAll(".glare").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--gx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty("--gy", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });
  });

  /* Spotlight Card */
  document.querySelectorAll(".spotlight").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--sx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty("--sy", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });
  });

  /* Particles — cool electric dust in hero */
  const canvas = document.querySelector(".hero__particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const hero = canvas.closest(".hero");
    let particles = [];
    let raf = 0;
    let running = true;

    const resize = () => {
      const { width, height } = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(24, Math.floor((width * height) / 32000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.5 + Math.random() * 1.6,
        vx: -0.15 + Math.random() * 0.3,
        vy: -0.25 - Math.random() * 0.4,
        a: 0.2 + Math.random() * 0.4,
      }));
    };

    const draw = () => {
      if (!running) return;
      const { width, height } = hero.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -8) {
          p.y = height + 6;
          p.x = Math.random() * width;
        }
        if (p.x < -8) p.x = width + 6;
        if (p.x > width + 8) p.x = -6;

        ctx.beginPath();
        ctx.fillStyle = `rgba(90, 150, 255, ${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) draw();
      else cancelAnimationFrame(raf);
    });
  }
}
