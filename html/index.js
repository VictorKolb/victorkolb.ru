const maxCanvasSize = 600
const canvas = document.querySelector(".canvas");

const ctx = canvas.getContext("2d");
const canvasSize = window.innerWidth > maxCanvasSize ? maxCanvasSize * 2 : window.innerWidth * 2;
const centerWidth = canvasSize / 2;
const centerHeight = canvasSize / 2;

canvas.width = canvasSize;
canvas.height = canvasSize;
canvas.style.width = `${canvasSize / 2}px`;
canvas.style.height = `${canvasSize / 2}px`;

let root = document.documentElement;

const darkColor = "#333"
const lightColor = "#ddd"
const isDark = Math.random() > 0.5
const accentColor = isDark ? darkColor : lightColor;
const backgroundColor = isDark ? lightColor : darkColor;

root.style.setProperty("--accent", accentColor);
root.style.setProperty("--background", backgroundColor);

ctx.fillStyle = accentColor;
ctx.strokeStyle = accentColor;

let elementsCount = Math.floor(canvasSize / 400)
if (elementsCount <= 1) elementsCount = 2
if (elementsCount >= 5) elementsCount = 5

console.log({elementsCount})

function drawCircles() {
    for (let i = 0; i < elementsCount; i++) {
        ctx.save();
        const figureRadius = grn(2, 10)
        const pointsCount = grn(3, 9);
        const radius = grn(300, canvasSize / 2);
        const stepDegree = 360 / pointsCount;
        let currentDegree = 0;
        ctx.translate(centerWidth, centerHeight);
        ctx.beginPath();
        const coords = []

        for (let i = 0; i < pointsCount; i++) {
            const x = Math.cos(degreesToRadians(currentDegree)) * radius;
            const y = Math.sin(degreesToRadians(currentDegree)) * radius;

            coords.push({x, y})
            currentDegree += stepDegree;
        }

        coords.forEach(({x, y}) => {
            ctx.beginPath();
            ctx.arc(x, y, figureRadius, 0, 2 * Math.PI);
            ctx.fill();
        })

        ctx.beginPath();
        ctx.moveTo(coords[0].x, coords[0].y);

        for (let i = 1; i < pointsCount; i++) {
            const {x, y} = coords[i]
            ctx.lineTo(x, y);

        }
        ctx.closePath();

        ctx.stroke();


        ctx.restore();
    }
}

function drawLines() {
    ctx.save();

    ctx.translate(centerWidth, centerHeight);

    const lines = []
    const pointsCount = grn(2, elementsCount);
    const stepDegree = 360 / pointsCount;

    for (let i = 0; i < pointsCount; i++) {

        lines.push({
            x1: grn(0, canvasSize / 2),
            y1: grn(0, canvasSize / 2),
            x2: grn(0, canvasSize / 2),
            y2: grn(0, canvasSize / 2),
            lineWidth: grn(1, 10),
        })
    }

    for (let i = 0; i < pointsCount; i++) {
        lines.forEach(({x1, y1, x2, y2, lineWidth}) => {
            ctx.lineWidth = lineWidth;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        })
        ctx.rotate(degreesToRadians(stepDegree));
    }


    ctx.restore();
}

drawCircles();
drawLines()

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function grn(max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
}
