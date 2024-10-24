import { Mass, Vector2 } from "./classes";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

function resizeCanvas(): void {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas)
resizeCanvas()


let test_mass:Mass = new Mass(new Vector2(300, 300));
test_mass.draw(ctx);

console.log('Bosh');
