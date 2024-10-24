import { Game, Mass, Spring, Vector2 } from "./classes";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

function resizeCanvas(): void {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas)
resizeCanvas()


const game = new Game(canvas);

canvas.onmousedown = game.mouseDown.bind(game);
canvas.onmousemove = game.mouseMove.bind(game);
canvas.onmouseup = game.mouseUp.bind(game);

// game.createDemoSystemTriangle();
// game.createDemoSystemParallelogram();
// game.createDemoSystemSquare();
game.createDemoSystemCenteredSquare();

game.start();
