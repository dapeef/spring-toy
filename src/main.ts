import { DemoType } from "./utilities";
import { Game } from "./game";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

function resizeCanvas(): void {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas)
resizeCanvas()


const game = new Game(canvas);

canvas.addEventListener("mousedown", game.mouseDown.bind(game));
canvas.addEventListener("mousemove", game.mouseMove.bind(game));
canvas.addEventListener("mouseup", game.mouseUp.bind(game));
canvas.addEventListener("touchstart", game.mouseDown.bind(game), {passive: false});
canvas.addEventListener("touchmove", game.mouseMove.bind(game), {passive: false});
canvas.addEventListener("touchend", game.mouseUp.bind(game), {passive: false});

const randEnum = Math.floor(Math.random() * Object.keys(DemoType).length / 2)
game.createDemo(randEnum);
// game.createDemo(DemoType.Hexagon);

game.start();
