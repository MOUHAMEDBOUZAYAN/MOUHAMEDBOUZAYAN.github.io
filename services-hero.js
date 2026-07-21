(function () {
  const hero = document.getElementById('servicesHero');
  const trail = document.getElementById('servicesHeroTrail');
  if (!hero || !trail || typeof gsap === 'undefined') return;

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!finePointer.matches) return;

  const images = [
    '1.webp', '2.webp', '3.webp', '4.webp', '5.webp', '6.webp',
    '7.webp', '9.webp', '10.webp', '11.webp', '12.webp', '13.webp',
    '14.webp', '15.webp', '17.webp',
  ].map((file) => `images/Header-services/${file}`);

  let imgIndex = 0;
  let lastSpawn = 0;
  const spawnInterval = 105;
  const maxItems = 14;

  function removeOldest() {
    const old = trail.firstElementChild;
    if (!old) return;
    gsap.killTweensOf(old);
    old.remove();
  }

  function spawnImage(clientX, clientY) {
    const now = performance.now();
    if (now - lastSpawn < spawnInterval) return;
    lastSpawn = now;

    while (trail.children.length >= maxItems) {
      removeOldest();
    }

    const rect = hero.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const size = 88 + Math.random() * 64;
    const rot = -12 + Math.random() * 24;
    const driftX = -18 + Math.random() * 36;
    const driftY = -22 + Math.random() * 18;

    const item = document.createElement('div');
    item.className = 'services-hero-float';
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    item.style.width = `${size.toFixed(0)}px`;

    const img = document.createElement('img');
    img.src = images[imgIndex % images.length];
    img.alt = '';
    img.draggable = false;
    imgIndex += 1;

    item.appendChild(img);
    trail.appendChild(item);

    gsap.set(item, {
      xPercent: -50,
      yPercent: -50,
      opacity: 0,
      scale: 0.42,
      rotation: rot - 10,
      x: driftX,
      y: driftY + 14,
      filter: 'blur(8px)',
    });

    gsap.to(item, {
      opacity: 1,
      scale: 1,
      rotation: rot,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.95,
      ease: 'power3.out',
      onComplete: () => {
        gsap.to(item, {
          opacity: 0,
          scale: 0.9,
          y: -32,
          rotation: rot + 6,
          filter: 'blur(5px)',
          duration: 0.85,
          ease: 'power2.inOut',
          delay: 0.45,
          onComplete: () => item.remove(),
        });
      },
    });
  }

  hero.addEventListener('mousemove', (e) => spawnImage(e.clientX, e.clientY));
  hero.addEventListener('mouseenter', (e) => spawnImage(e.clientX, e.clientY));
})();
