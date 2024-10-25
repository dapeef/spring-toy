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

canvas.onmousedown = game.mouseDown.bind(game);
canvas.onmousemove = game.mouseMove.bind(game);
canvas.onmouseup = game.mouseUp.bind(game);

const randEnum = Math.floor(Math.random() * Object.keys(DemoType).length / 2)
game.createDemo(randEnum);

game.start();
