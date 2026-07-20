/* ==========================================================
   Custom cursor — spring physics (shared)
   mass: 0.1 | damping: 10 | stiffness: 131
   ========================================================== */
(function () {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!finePointer.matches) return;

  document.documentElement.classList.add('has-custom-cursor');

  function createSpring({ mass, damping, stiffness }, initial = 0) {
    let value = initial;
    let velocity = 0;
    let target = initial;
    return {
      set(v) { target = v; },
      update(dt) {
        const force = -stiffness * (value - target);
        const damper = -damping * velocity;
        const acceleration = (force + damper) / mass;
        velocity += acceleration * dt;
        value += velocity * dt;
        return value;
      },
      get() { return value; },
    };
  }

  const SPRING = { mass: 0.1, damping: 10, stiffness: 131 };
  const SCALE_SPRING = { mass: 0.2, damping: 12, stiffness: 260 };

  let cursorDot = document.getElementById('cursorDot');
  if (!cursorDot) {
    cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorDot.id = 'cursorDot';
    cursorDot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursorDot);
  }

  const springX = createSpring(SPRING, window.innerWidth / 2);
  const springY = createSpring(SPRING, window.innerHeight / 2);
  const springScale = createSpring(SCALE_SPRING, 1);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let hovering = false;
  let visible = false;

  const HOVER_SELECTOR = 'a, button, [role="button"], [data-cursor-hover], input, textarea, select, label, .pill-link, .social-pill, .scroll-top-btn, .nav-link, .nav-toggle';

  function isHoverTarget(el) {
    return !!(el && el.closest && el.closest(HOVER_SELECTOR));
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) {
      visible = true;
      cursorDot.classList.add('is-ready');
    }
    hovering = isHoverTarget(e.target);
  });

  document.addEventListener('mouseover', (e) => {
    if (isHoverTarget(e.target)) hovering = true;
  });

  document.addEventListener('mouseout', (e) => {
    if (isHoverTarget(e.target) && !isHoverTarget(e.relatedTarget)) {
      hovering = false;
    }
  });

  let lastTime = performance.now();

  function tick(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.032);
    lastTime = now;

    springX.set(mouseX);
    springY.set(mouseY);
    springScale.set(hovering ? 2.4 : 1);

    const x = springX.update(dt);
    const y = springY.update(dt);
    const scale = springScale.update(dt);

    cursorDot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
