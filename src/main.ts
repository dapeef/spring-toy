import { Game, Mass, Spring, Vector2 } from "./classes";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

function resizeCanvas(): void {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas)
resizeCanvas()


const game = new Game(canvas);

let mass1 = new Mass();
game.addMass(mass1);

let mass2 = new Mass(new Vector2(300, 300));
game.addMass(mass2);

let spring1 = new Spring(mass1, mass2);
game.addSpring(spring1);

game.start();
