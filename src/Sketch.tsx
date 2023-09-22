import * as React from 'react';
import { useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useWindowSize } from './useWindowSize';

const NUM_STARS = 200;

const Sketch = () => {
  const { scrollY } = useScroll();

  const { width, height } = useWindowSize();
  const windowWidth: number = width as number;
  const windowHeight: number = height as number;

  const prefersReducedMotion = useReducedMotion();

  const speed = useTransform(scrollY, [0, windowHeight * 3], [1, 50]);

  const requestId = React.useRef<number | undefined>(undefined);

  const ref = React.useCallback(
    (canvas: HTMLCanvasElement | null) => {
      stop();

      const ctx = canvas?.getContext('2d');
      if (canvas) {
        canvas.width = windowWidth;
        canvas.height = windowHeight;

        if (window.devicePixelRatio > 1) {
          const currentWidth = canvas.width;
          const currentHeight = canvas.height;

          canvas.width = currentWidth * window.devicePixelRatio;
          canvas.height = currentHeight * window.devicePixelRatio;
          canvas.style.width = currentWidth + 'px';
          canvas.style.height = currentHeight + 'px';

          ctx?.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
      }

      const canvasWidth = canvas?.width as number;
      const canvasHeight = canvas?.height as number;

      function randomX() {
        return Math.random() * canvasWidth - canvasWidth / 2;
      }

      function randomY() {
        return Math.random() * canvasHeight - canvasHeight / 2;
      }

      function randomZ() {
        return Math.random() * canvasWidth;
      }

      const stars: Array<Star> = [];
      const colors = [
        [87, 171, 255],
        [242, 224, 136],
        [255, 189, 122],
        [122, 235, 141],
        [166, 148, 255],
      ];

      const widthScale = windowWidth / 1440
      
      type Star = ReturnType<typeof createStar>;
      function createStar() {
        let x = randomX();
        let y = randomY();
        let z = randomZ();
        let prevZ = z;
        const color =
          Math.random() < 0.75
            ? [245, 249, 252]
            : colors[Math.floor(Math.random() * colors.length)];

        return {
          update() {
            if (!prefersReducedMotion) {
              z = z - speed.get() * widthScale;
              
              if (z < 1) {
                z = canvasWidth;
                x = randomX();
                y = randomY();
                prevZ = z;
              }
            }
          },

          show() {
            const alpha = 1 - z / canvasWidth;
            const newColor = `rgba(${color[0]}, ${color[1]}, ${
              color[2]
            }, ${alpha})`;

            const rad = (canvasWidth / 60) * (1 - z / canvasWidth);

            const scaledX = (canvasWidth * x) / z;
            const scaledY = (canvasHeight * y) / z;

            const prevX = (canvasWidth * x) / prevZ;
            const prevY = (canvasHeight * y) / prevZ;

            prevZ = z;

            if (ctx) {
              ctx.lineWidth = rad;
              ctx.lineCap = 'round';
              ctx.strokeStyle = newColor;
              ctx.beginPath();
              ctx.moveTo(prevX, prevY);
              ctx.lineTo(scaledX, scaledY);
              ctx.stroke();
            }
          },
        };
      }

      for (let i = 0; i < NUM_STARS; i++) {
        stars.push(createStar());
      }

      function draw() {
        requestId.current = undefined;

        ctx?.setTransform(1, 0, 0, 1, 0, 0);
        ctx?.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx?.translate(canvasWidth / 2, canvasHeight / 2);
        for (const star of stars) {
          star.update();
          star.show();
        }

        start();
      }

      function start() {
        if (requestId.current === undefined) {
          requestId.current = window.requestAnimationFrame(draw);
        }
      }

      function stop() {
        if (requestId.current !== undefined) {
          window.cancelAnimationFrame(requestId.current);
          requestId.current = undefined;
        }
      }

      draw();
    },
    [prefersReducedMotion, speed, windowHeight, windowWidth],
  );

  return <canvas ref={ref} />;
};

export default Sketch;