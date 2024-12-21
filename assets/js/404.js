const CANVAS_HEIGHT = 2;
const SNOWFLAKE_AMOUNT = 200;
const SNOWFLAKE_SIZE = {
  min: 2,
  max: 4,
};
const SNOWFLAKE_SPEED = {
  min: 1,
  max: 3,
};
const CANVAS_SELECTOR = ".snowverlay";

let animationFrame;

// Shared utilities
const setupCanvas = () => {
  const canvas = document.querySelector(CANVAS_SELECTOR);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }

  const setCanvasSize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * CANVAS_HEIGHT;
  };

  setCanvasSize();
  window.addEventListener("resize", setCanvasSize);

  return { canvas, ctx };
};

const createSnowflake = (canvas, isAnimated = true, index = 0) => ({
  x: Math.random() * canvas.width,
  y: isAnimated
    ? -20 - (index * canvas.height) / SNOWFLAKE_AMOUNT
    : Math.random() * canvas.height,
  size:
    Math.random() * (SNOWFLAKE_SIZE.max - SNOWFLAKE_SIZE.min) +
    SNOWFLAKE_SIZE.min,
  speed:
    Math.random() * (SNOWFLAKE_SPEED.max - SNOWFLAKE_SPEED.min) +
    SNOWFLAKE_SPEED.min,
  opacity: isAnimated ? null : Math.random() * 0.5 + 0.2,
});

const drawSnowflake = (ctx, flake, canvas) => {
  ctx.beginPath();
  ctx.fillStyle = `rgba(140, 140, 140, ${
    flake.opacity ?? 1 - flake.y / canvas.height
  })`;
  ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
  ctx.fill();
};

const renderStaticSnow = () => {
  const setup = setupCanvas();
  if (!setup) return;
  const { canvas, ctx } = setup;

  Array(SNOWFLAKE_AMOUNT)
    .fill(undefined)
    .map(() => createSnowflake(canvas, false))
    .forEach((flake) => drawSnowflake(ctx, flake, canvas));
};

const startSnowAnimation = () => {
  const setup = setupCanvas();
  if (!setup) {
    return;
  }

  const { canvas, ctx } = setup;

  const snowflakes = Array(SNOWFLAKE_AMOUNT)
    .fill(undefined)
    .map((_event, index) => createSnowflake(canvas, true, index));

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snowflakes.forEach((flake) => {
      flake.y += flake.speed;
      flake.x += Math.sin(flake.y / 30) * 0.5;

      if (flake.y > canvas.height) {
        flake.y = 0;
        flake.x = Math.random() * canvas.width;
      }

      drawSnowflake(ctx, flake, canvas);
    });

    animationFrame = requestAnimationFrame(animate);
  };

  animate();

  return () => {
    cancelAnimationFrame(animationFrame);
  };
};

const init = () => {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handleMotionPreference = (event) => {
    if (event.matches) {
      renderStaticSnow();
    } else {
      startSnowAnimation();
    }
  };

  mediaQuery.addEventListener("change", handleMotionPreference);
  handleMotionPreference(mediaQuery);
};

document.addEventListener("DOMContentLoaded", init);
