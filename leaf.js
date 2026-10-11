(() => {
  window.__oliveLeaves?.destroy?.();

  [
    'olive-leaves',
    'olive-leaves-style',
    'olive-opacity',
    'olive-lime-colors',
    'olive-photo-colors',
    'olive-dark-leaves'
  ].forEach(id => document.getElementById(id)?.remove());

  const main = document.querySelector('main');
  const cover = document.querySelector('.cover');

  if (!main || !cover) return;

  const CONFIG = {
    count: 12,
    diagonalCount: 12,

    minSize: 6,
    maxSize: 7.5,

    minDuration: 7000,
    maxDuration: 12000,

    minFallDuration: 9000,
    maxFallDuration: 14000,

    minPause: 400,
    maxPause: 1400,

    // Original leaf body colors
    colors: [
      '#829b72',
      '#91a487',
      '#788e70',
      '#a0b394',
      '#718868',
      '#879b78',
      '#97aa8b'
    ]
  };

  const rand = (min, max) =>
    min + Math.random() * (max - min);

  // ==========================================
  // STYLES
  // ==========================================

  const style = document.createElement('style');
  style.id = 'olive-leaves-style';

  style.textContent = `
    #v2-leaves {
      display: none !important;
    }

    #olive-leaves {
      position: fixed;
      top: 0;
      height: 100dvh;
      overflow: hidden;
      pointer-events: none !important;
      z-index: 10;
      contain: layout paint;
    }

    #olive-leaves * {
      pointer-events: none !important;
    }

    #olive-leaves .olive-leaf {
      position: absolute;

      width: calc(var(--size) * 2.5);
      height: calc(var(--size) * 1.8);

      background: transparent;
      border: 0;
      border-radius: 0;

      opacity: 1 !important;
      visibility: hidden;

      transform-origin: center;
      will-change: transform;
    }

    #olive-leaves svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    /* Original body fill + approved dark details */

    #olive-leaves .leaf-blade {
      fill: var(--leaf-color);
      stroke: #2E6810;
      stroke-width: 0.8;
      stroke-linejoin: round;
    }

    #olive-leaves .leaf-highlight {
      fill: #B8E64A;
      opacity: 0.12;
    }

    #olive-leaves .leaf-shadow {
      fill: #245D0D;
      opacity: 0.38;
    }

    #olive-leaves .leaf-vein {
      fill: none;
      stroke: #75AC27;
      stroke-width: 1.3;
      stroke-linecap: round;
      opacity: 0.65;
    }

    #olive-leaves .leaf-side-veins {
      fill: none;
      stroke: #60951E;
      stroke-width: 0.85;
      stroke-linecap: round;
      opacity: 0.55;
    }

    #olive-leaves .leaf-stem {
      fill: none;
      stroke: #477D15;
      stroke-width: 1.6;
      stroke-linecap: round;
    }

    @media (prefers-reduced-motion: reduce) {
      #olive-leaves {
        display: none;
      }
    }
  `;

  document.head.append(style);

  // ==========================================
  // ANIMATION LAYER
  // ==========================================

  const layer = document.createElement('div');

  layer.id = 'olive-leaves';
  layer.setAttribute('aria-hidden', 'true');

  document.body.append(layer);

  // ==========================================
  // ORIGINAL SVG SHAPES
  // ==========================================

  const shapes = [
    `M11 34 C14 18 35 5 66 9
     C57 25 43 44 23 44
     C16 42 12 39 11 34 Z`,

    `M11 33 C20 9 42 6 65 12
     C57 25 46 41 25 42
     C17 41 12 38 11 33 Z`,

    `M12 36 C14 18 38 3 64 8
     C60 28 43 46 24 45
     C17 44 13 41 12 36 Z`
  ];

  function createLeafSVG(index) {
    return `
      <svg
        viewBox="0 0 72 52"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          class="leaf-stem"
          d="M2 40 Q7 37 13 34"
        />

        <path
          class="leaf-blade"
          d="${shapes[index % shapes.length]}"
        />

        <path
          class="leaf-shadow"
          d="
            M18 39 Q40 46 63 14
            Q53 34 36 41
            Q25 46 18 39 Z
          "
        />

        <path
          class="leaf-highlight"
          d="
            M17 29 C28 13 43 11 59 11
            C49 15 38 23 25 32
            Q19 35 17 29 Z
          "
        />

        <path
          class="leaf-vein"
          d="M13 35 Q32 31 61 12"
        />

        <path
          class="leaf-side-veins"
          d="
            M25 30 Q25 23 30 19
            M36 26 Q42 31 48 30
            M46 21 Q47 17 52 14
            M20 33 Q25 39 31 40
          "
        />
      </svg>
    `;
  }

  // ==========================================
  // CREATE LEAVES
  // ==========================================

  const roles = [
    ...Array(CONFIG.diagonalCount).fill('diagonal'),
    ...Array(
      CONFIG.count - CONFIG.diagonalCount
    ).fill('fall')
  ];

  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [roles[i], roles[j]] = [roles[j], roles[i]];
  }

  const leaves = [];
  const animations = new Map();

  let destroyed = false;

  for (let i = 0; i < CONFIG.count; i++) {
    const leaf = document.createElement('span');

    leaf.className = 'olive-leaf';

    // Final approved size
    leaf.style.setProperty(
      '--size',
      `${rand(CONFIG.minSize, CONFIG.maxSize)}px`
    );

    // Original individual leaf colors
    const color = CONFIG.colors[
      Math.floor(Math.random() * CONFIG.colors.length)
    ];

    leaf.style.setProperty('--leaf-color', color);

    leaf.innerHTML = createLeafSVG(i);

    layer.append(leaf);

    leaves.push({
      element: leaf,
      role: roles[i]
    });
  }

  // ==========================================
  // LEAF MOVEMENT
  // ==========================================

  function animateLeaf(item, delay = 0) {
    if (destroyed) return;

    const leaf = item.element;

    const width = layer.clientWidth;
    const height = layer.clientHeight;

    if (!width || !height) return;

    const margin = 90;

    let startX;
    let startY;
    let endX;
    let endY;
    let duration;

    // ========================================
    // DIAGONAL: RIGHT TO LEFT
    // ========================================

    if (item.role === 'diagonal') {
      startX = width + margin;
      endX = -margin;

      // Random entry height
      startY = rand(0.02, 0.82) * height;

      // Always downward
      endY = startY + rand(0.20, 0.42) * height;

      duration = rand(
        CONFIG.minDuration,
        CONFIG.maxDuration
      );
    }

    // ========================================
    // VERTICAL FALL
    // ========================================

    else {
      startX = rand(0.10, 0.90) * width;
      startY = -margin;

      // Slight drift to the left only
      endX = startX - rand(0, 35);
      endY = height + margin;

      duration = rand(
        CONFIG.minFallDuration,
        CONFIG.maxFallDuration
      );
    }

    const dx = endX - startX;
    const dy = endY - startY;

    // ========================================
    // RANDOM ROTATION
    // ========================================

    const startAngle = rand(0, 360);

    const rotationDirection =
      Math.random() < 0.5 ? -1 : 1;

    const rotation =
      rotationDirection * rand(120, 300);

    // ========================================
    // GENTLE WIND VARIATIONS
    // ========================================

    const swayX = item.role === 'diagonal'
      ? [
          0,
          rand(-12, 12),
          rand(-18, 18),
          rand(-12, 12),
          0
        ]
      : [0, 0, 0, 0, 0];

    const progress = [0, 0.25, 0.5, 0.75, 1];

    // Start outside the screen
    leaf.style.left = `${startX}px`;
    leaf.style.top = `${startY}px`;
    leaf.style.visibility = 'visible';

    const keyframes = progress.map((t, i) => ({
      offset: t,

      transform: `
        translate3d(
          ${dx * t + swayX[i]}px,
          ${dy * t}px,
          0
        )
        rotate(${startAngle + rotation * t}deg)
      `
    }));

    const animation = leaf.animate(keyframes, {
      duration,
      delay,
      easing: 'linear',
      iterations: 1,
      fill: 'both'
    });

    animations.set(leaf, animation);

    animation.onfinish = () => {
      animations.delete(leaf);

      if (destroyed) return;

      animation.cancel();

      animateLeaf(
        item,
        rand(CONFIG.minPause, CONFIG.maxPause)
      );
    };

    if (document.hidden) {
      animation.pause();
    }
  }

  // ==========================================
  // START AND STOP
  // ==========================================

  function stopAnimations() {
    animations.forEach(animation => {
      animation.onfinish = null;
      animation.cancel();
    });

    animations.clear();
  }

  function startAnimations() {
    stopAnimations();

    const order = [...leaves];

    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [order[i], order[j]] = [order[j], order[i]];
    }

    order.forEach((item, index) => {
  if (index < 6) {
    // Start six leaves already in motion.
    animateLeaf(item, 0);

    const animation = animations.get(item.element);

    if (animation) {
      const duration = animation.effect.getTiming().duration;

      // Begin partway through each leaf's flight.
      animation.currentTime = duration * rand(0.25, 0.48);
    }
  } else {
    // Remaining leaves enter naturally from offscreen.
    animateLeaf(item, rand(500, 2500));
  }
});
  }

  // ==========================================
  // KEEP LEAVES INSIDE WEDDING DAY COVER ONLY
  // ==========================================

  let frameId = null;
  let previousWidth = null;
  let previousHeight = null;

  function align() {
    if (destroyed) return;

    const mainRect = main.getBoundingClientRect();
    const coverRect = cover.getBoundingClientRect();

    const width = mainRect.width;
    const height = layer.clientHeight || innerHeight;

    layer.style.left = `${mainRect.left}px`;
    layer.style.width = `${width}px`;

    const top = Math.min(
      height,
      Math.max(0, mainRect.top)
    );

    const bottom = Math.max(
      top,
      Math.min(height, coverRect.bottom)
    );

    layer.style.clipPath = `inset(
      ${top}px
      0
      ${Math.max(0, height - bottom)}px
      0
    )`;

    layer.style.visibility =
      bottom > top ? 'visible' : 'hidden';

    if (
      previousWidth !== null &&
      (
        Math.abs(width - previousWidth) > 2 ||
        Math.abs(height - previousHeight) > 32
      )
    ) {
      startAnimations();
    }

    previousWidth = width;
    previousHeight = height;

    frameId = null;
  }

  function schedule() {
    if (frameId === null) {
      frameId = requestAnimationFrame(align);
    }
  }

  align();
  startAnimations();

  window.addEventListener(
    'scroll',
    schedule,
    { passive: true }
  );

  window.addEventListener(
    'resize',
    schedule,
    { passive: true }
  );

  // ==========================================
  // RESIZE OBSERVER
  // ==========================================

  let observer = null;

  if (typeof ResizeObserver === 'function') {
    observer = new ResizeObserver(schedule);

    observer.observe(main);
    observer.observe(cover);
  }

  // ==========================================
  // PAUSE WHEN TAB IS HIDDEN
  // ==========================================

  function handleVisibility() {
    animations.forEach(animation => {
      if (document.hidden) {
        animation.pause();
      } else {
        animation.play();
      }
    });
  }

  document.addEventListener(
    'visibilitychange',
    handleVisibility
  );

  // ==========================================
  // CLEANUP
  // ==========================================

  window.__oliveLeaves = {
    destroy() {
      destroyed = true;

      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);

      document.removeEventListener(
        'visibilitychange',
        handleVisibility
      );

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      observer?.disconnect();

      stopAnimations();

      layer.remove();
      style.remove();

      delete window.__oliveLeaves;
    }
  };
})();
