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

let mass1 = new Mass(new Vector2(15, 30));
let mass2 = new Mass(new Vector2(30, 300));
let mass3 = new Mass(new Vector2(300, 30));
game.addMass(mass1);
game.addMass(mass2);
game.addMass(mass3);

let spring1 = new Spring(mass1, mass2);
let spring2 = new Spring(mass2, mass3);
let spring3 = new Spring(mass1, mass3);
game.addSpring(spring1);
game.addSpring(spring2);
game.addSpring(spring3);

game.start();
