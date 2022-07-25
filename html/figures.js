

function grn(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function hexToRgbA(hex, alpha) {
  let c;

  c = hex.substring(1).split('');
  if (c.length == 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  c = '0x' + c.join('');

  // @ts-ignore
  return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')}, ${alpha})`;
}


let foregroundColor = '#333';

function maybeYes(callback, probability) {
  if (Math.random() < probability) {
    callback();
  }
}

function variableLineStyle(ctx) {
  ctx.lineWidth = grn(1, 8);
  maybeYes(() => ctx.setLineDash([grn(0, 5), grn(0, 15)]), 0.3);
}

function drawDot({
                   ctx, x, y, radius,
                 }) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}

function createFigure({
                        pointsCount, color, radius, canvasSize, ctx,
                      }) {
  const centerWidth = canvasSize / 2;
  const centerHeight = canvasSize / 2;
  const stepDegree = 360 / pointsCount;
  let currentDegree = 0;
  const points = [];
  const edge = grn(0, 360);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  const angle = (edge * Math.PI) / 180;
  ctx.fillStyle = color;

  ctx.translate(centerWidth, centerHeight);

  ctx.rotate(angle);

  for (let i = 0; i < pointsCount; i++) {
    const xShift = Math.cos(degreesToRadians(currentDegree)) * radius;
    const yShift = Math.sin(degreesToRadians(currentDegree)) * radius;

    const xRandomShift = points[i]?.xRandomShift ?? 0;
    const yRandomShift = points[i]?.yRandomShift ?? 0;

    const newX = xShift + xRandomShift;
    const newY = yShift + yRandomShift;

    points[i] = {
      ...points[i], x: newX, y: newY,
    };

    currentDegree += stepDegree;
  }

  const gradient = ctx.createLinearGradient(points[0].x, points[0].y, points[Math.round(pointsCount / 2)].x, points[Math.round(pointsCount / 2)].y);

  gradient.addColorStop(0, color);
  gradient.addColorStop(1, hexToRgbA(color, 0));
  ctx.fillStyle = gradient;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.closePath();

  ctx.fill();

  ctx.rotate(-angle);

  ctx.restore();
}

function createCircle({
                        ctx, canvasSize,
                      }) {
  ctx.save();
  const dotsRadius = grn(2, 5);
  const pointsCount = grn(3, 9);
  const radius = grn(300, canvasSize / 2);
  ctx.translate(canvasSize / 2, canvasSize / 2);
  ctx.strokeStyle = foregroundColor;
  ctx.fillStyle = foregroundColor;

  variableLineStyle(ctx);

  if (Math.random() > 0.5) {
    const stepDegree = 360 / pointsCount;
    let currentDegree = 0;
    ctx.beginPath();
    const coords = [];

    for (let i = 0; i < pointsCount; i++) {
      const x = Math.cos(degreesToRadians(currentDegree)) * radius;
      const y = Math.sin(degreesToRadians(currentDegree)) * radius;

      coords.push({x, y});
      currentDegree += stepDegree;
    }

    coords.forEach(({x, y}) => {
      drawDot({x, y, radius: dotsRadius, ctx});
    });

    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);

    for (let i = 1; i < pointsCount; i++) {
      const {x, y} = coords[i];
      ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();

    function additionalCircle() {
      ctx.beginPath();
      ctx.arc(0, 0, radius + grn(-50, 10), degreesToRadians(grn(0, 180)), degreesToRadians(grn(0, 180)));

      ctx.stroke();
    }

    maybeYes(additionalCircle, 0.2);
    maybeYes(additionalCircle, 0.2);
    maybeYes(additionalCircle, 0.2);
    maybeYes(additionalCircle, 0.2);
    maybeYes(additionalCircle, 0.2);

    ctx.restore();
  }
}

function createRandomCircles({
                               ctx, canvasSize, recursive = false,
                             }) {
  ctx.save();
  const halfCanvasSize = canvasSize / 2;
  const pointsCount = grn(1, 4);
  const radius = grn(10, halfCanvasSize / 2);

  ctx.translate(halfCanvasSize, halfCanvasSize);

  ctx.strokeStyle = foregroundColor;
  ctx.fillStyle = foregroundColor;
  ctx.globalAlpha = grn(1, 8) / 10;

  variableLineStyle(ctx);

  ctx.beginPath();
  ctx.arc(grn(-40, 40), grn(-40, 40), radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.restore();

  if (recursive) {
    for (let i = 0; i < pointsCount; i++) {
      createRandomCircles({ctx, canvasSize});
    }
  }
}

function createRandomDots({
                            ctx, canvasSize, recursive = false,
                          }) {
  ctx.save();
  const halfCanvasSize = canvasSize / 2;
  const pointsCount = grn(1, 15);
  const radius = grn(5, 10);

  ctx.translate(halfCanvasSize, halfCanvasSize);

  ctx.strokeStyle = foregroundColor;
  ctx.fillStyle = foregroundColor;
  ctx.globalAlpha = grn(1, 10) / 10;

  ctx.beginPath();
  ctx.arc(grn(-halfCanvasSize, halfCanvasSize), grn(-halfCanvasSize, halfCanvasSize), radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();

  if (recursive) {
    for (let i = 0; i < pointsCount; i++) {
      createRandomDots({ctx, canvasSize});
    }
  }
}

function createDotsMatrix({
                            ctx, canvasSize, recursive = false,
                          }) {
  ctx.save();
  const pointsCount = grn(1, 2);
  const rows = grn(2, 9);
  const cols = grn(2, 9);
  const radius = grn(5, 10);

  ctx.translate(grn(-0, canvasSize), grn(-0, canvasSize));

  ctx.strokeStyle = foregroundColor;
  ctx.fillStyle = foregroundColor;

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      ctx.globalAlpha = grn(1, 10) / 10;
      ctx.beginPath();
      ctx.arc(row * radius * 5, col * radius * 5, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  ctx.restore();

  if (recursive) {
    for (let i = 0; i < pointsCount; i++) {
      createDotsMatrix({ctx, canvasSize});
    }
  }
}

function createLine({
                      ctx, canvasSize,
                    }) {
  ctx.save();
  const edge = grn(0, 360);
  ctx.strokeStyle = foregroundColor;
  ctx.fillStyle = foregroundColor;
  // const needToRotate = Math.random() > 0.5;

  const angle = (edge * Math.PI) / 180;
  variableLineStyle(ctx);

  ctx.translate(canvasSize / 2, canvasSize / 2);
  ctx.rotate(angle);

  const margin = grn(100, canvasSize / 3);
  const shift = grn(20, 50);

  ctx.beginPath();
  ctx.moveTo(shift, -canvasSize / 2 + margin);
  ctx.lineTo(shift, canvasSize / 2 - margin);
  ctx.lineWidth = grn(1, 5);
  ctx.stroke();

  maybeYes(() => {
    ctx.lineWidth = grn(1, 10);

    ctx.beginPath();
    ctx.arc(shift, shift + +grn(20, 100), grn(10, 50), 0, 2 * Math.PI);

    if (Math.random() > 0.5) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  }, 0.5);

  maybeYes(() => {
    const margin = grn(100, canvasSize / 3);
    const shift = grn(20, 50);
    ctx.beginPath();
    ctx.moveTo(shift, -canvasSize / 2 + margin);
    ctx.lineTo(shift, canvasSize / 2 - margin);
    ctx.lineWidth = grn(1, 5);
    ctx.stroke();
  }, 0.5);

  const topDotRadius = grn(3, 15);
  const topDotY = -canvasSize / 2 + margin;
  const bottomDotRadius = grn(3, 15);

  maybeYes(() => {
    drawDot({ctx, x: shift, y: topDotY, radius: topDotRadius});
    if (topDotRadius < 10) {
      maybeYes(() => {
        drawDot({
          ctx, x: shift, y: topDotY + 20, radius: topDotRadius - 1,
        });
        drawDot({
          ctx, x: shift, y: topDotY + 40, radius: topDotRadius - 2,
        });
        drawDot({
          ctx, x: shift, y: topDotY + 60, radius: topDotRadius - 3,
        });
      }, 0.2);
    }
  }, 0.5);

  maybeYes(() => {
    drawDot({
      ctx, x: shift, y: canvasSize / 2 - margin, radius: bottomDotRadius,
    });
  }, 0.5);

  ctx.rotate(-angle);
  ctx.restore();
}

function imageGenerator(selector, canvasSize, withFigures, backgroundColor, _foregroundColor) {
  const canvas = document.querySelector(selector);

  let canvasSizeInPixels = canvasSize / 3;
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  canvas.style.width = `${canvasSizeInPixels}px`;
  canvas.style.height = `${canvasSizeInPixels}px`;



  // const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  console.log({canvas})
  foregroundColor = _foregroundColor;

  const ctx = canvas.getContext('2d');



  // ctx.clearRect(0, 0, canvasSize, canvasSize);
  ctx.rect(0, 0, canvasSize, canvasSize);
  ctx.fillStyle = backgroundColor;
  ctx.fill();




  maybeYes(() => {
    createDotsMatrix({
      ctx, canvasSize, recursive: true,
    });
  }, 0.5);

  maybeYes(() => {
    createRandomDots({
      ctx, canvasSize, recursive: true,
    });
  }, 0.5);

  maybeYes(() => {
    createRandomCircles({
      ctx, canvasSize, recursive: true,
    });
  }, 0.5);

  maybeYes(() => {
    createLine({
      ctx, canvasSize,
    });
  }, 0.5);

  withFigures && createFigure({
    pointsCount: grn(3, 5),
    color: '#F27059',
    radius: grn(200, canvasSize / 2),
    canvasSize,
    ctx,
  });

  maybeYes(() => {
    createCircle({
      ctx, canvasSize,
    });
  }, 0.7);

  withFigures && createFigure({
    pointsCount: grn(3, 5),
    color: '#a06cd5',
    radius: grn(100, canvasSize / 2),
    canvasSize,
    ctx,
  });

  maybeYes(() => {
    createCircle({
      ctx, canvasSize,
    });
  }, 0.3);

  maybeYes(() => {
    createCircle({
      ctx, canvasSize,
    });
  }, 0.2);

  withFigures && createFigure({
    pointsCount: grn(3, 5),
    color: '#347fc4',
    radius: grn(50, canvasSize / 2),
    canvasSize,
    ctx,
  });

  withFigures && createFigure({
    pointsCount: grn(3, 5),
    color: '#A9E5BB',
    radius: grn(50, canvasSizeInPixels),
    canvasSize,
    ctx,
  });

  maybeYes(() => {
    createLine({
      ctx, canvasSize,
    });
  }, 0.5);

}


imageGenerator(
  ".js-canvas",
  2000,
  true,
  `transparent`,
  `rgba(51, 51, 51, 0.5)`
);
