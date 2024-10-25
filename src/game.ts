import { DemoType, Vector2 } from "./utilities";
import { Mass, Spring, ContactSpring } from "./entities";

export class Game {
    private ctx:CanvasRenderingContext2D;
    private mousePosition = new Vector2();

    private lastTime:number; // milliseconds
    private deltaTime:number; // milliseconds
    private maxDeltaTime:number = 50; //milliseconds
    private masses:Mass[];
    private springs:Spring[];
    private entitySprings:Spring[];

    private gravity:number = 5e-4; // pixels/msec/msec
    private maxForce:number = 1e-1;
    private maxSpeed:number = 1e4;

    constructor(private canvas:HTMLCanvasElement) {
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        this.lastTime = 0;
        this.deltaTime = 0;

        this.masses = [];
        this.springs = [];
        this.entitySprings = [];
    }


    public addMass(mass:Mass):void {
        this.masses.forEach(existingMass => {
            let newSpring = new ContactSpring(existingMass, mass, existingMass.maxSize/2 + mass.maxSize/2);
            this.entitySprings.push(newSpring);
            existingMass.addEntitySpring(newSpring);
            mass.addEntitySpring(newSpring)
        });
        
        this.masses.push(mass);
    }
    public addSpring(spring:Spring):void {
        this.springs.push(spring);
        
        spring.mass1.addSpring(spring);
        spring.mass2.addSpring(spring);
    }


    public mouseDown(evt:MouseEvent):void {
        this.mousePosition.x = evt.x;
        this.mousePosition.y = evt.y;

        // Work out whether the mouse click was within any of the masses
        let massesUnderMouse:Mass[] = [];

        this.masses.forEach(mass => {
            if (
                mass.position.x - mass.size.x <= evt.x &&
                mass.position.x + mass.size.x >= evt.x &&
                mass.position.y - mass.size.y <= evt.y &&
                mass.position.y + mass.size.y >= evt.y ) {
                    massesUnderMouse.push(mass);
                }
        });
          
        // Select mass closest to mouse
        if (massesUnderMouse.length > 0) {
            let closestMass:Mass = massesUnderMouse[0];
            let closestMassDistance:number = Infinity;

            massesUnderMouse.forEach(mass =>{
                if (this.mousePosition.minus(mass.position).length() < closestMassDistance) {
                    closestMass = mass;
                    closestMassDistance = this.mousePosition.minus(mass.position).length();
                }
            });

            closestMass.isBeingDragged = true;
            closestMass.relativeMousePosition = this.mousePosition.minus(closestMass.position);
        }
    }
    public mouseMove(evt:MouseEvent):void {
        this.mousePosition.x = evt.x;
        this.mousePosition.y = evt.y;
    }
    public mouseUp(evt:MouseEvent):void {
        this.masses.forEach(mass => mass.isBeingDragged = false);
    }
    
    public createDemo(type:DemoType):void {
        if (type === DemoType.Triangle) {
            let mass1 = new Mass(new Vector2(15, 30));
            let mass2 = new Mass(new Vector2(30, 300));
            let mass3 = new Mass(new Vector2(300, 30));
            this.addMass(mass1);
            this.addMass(mass2);
            this.addMass(mass3);

            let spring1 = new Spring(mass1, mass2);
            let spring2 = new Spring(mass2, mass3);
            let spring3 = new Spring(mass1, mass3);
            this.addSpring(spring1);
            this.addSpring(spring2);
            this.addSpring(spring3);
        }

        if (type === DemoType.Parallelogram) {
            let mass1 = new Mass(new Vector2(30, 30));
            let mass2 = new Mass(new Vector2(30, 300));
            let mass3 = new Mass(new Vector2(300, 30));
            let mass4 = new Mass(new Vector2(300, 300));
            this.addMass(mass1);
            this.addMass(mass2);
            this.addMass(mass3);
            this.addMass(mass4);

            let spring1 = new Spring(mass1, mass2);
            let spring2 = new Spring(mass2, mass3);
            let spring3 = new Spring(mass1, mass3);
            let spring4 = new Spring(mass3, mass4);
            let spring5 = new Spring(mass2, mass4);
            this.addSpring(spring1);
            this.addSpring(spring2);
            this.addSpring(spring3);
            this.addSpring(spring4);
            this.addSpring(spring5);
        }

        if (type === DemoType.Square) {
            let mass1 = new Mass(new Vector2(30, 30));
            let mass2 = new Mass(new Vector2(30, 300));
            let mass3 = new Mass(new Vector2(300, 30));
            let mass4 = new Mass(new Vector2(300, 300));
            this.addMass(mass1);
            this.addMass(mass2);
            this.addMass(mass3);
            this.addMass(mass4);

            let spring1 = new Spring(mass1, mass2);
            let spring2 = new Spring(mass1, mass4, 200*Math.sqrt(2));
            let spring3 = new Spring(mass2, mass4);
            let spring4 = new Spring(mass3, mass4);
            let spring5 = new Spring(mass1, mass3);
            let spring6 = new Spring(mass2, mass3, 200*Math.sqrt(2));
            this.addSpring(spring1);
            this.addSpring(spring2);
            this.addSpring(spring3);
            this.addSpring(spring4);
            this.addSpring(spring5);
            this.addSpring(spring6);
        }

        if (type === DemoType.CenteredSquare) {
            let mass1 = new Mass(new Vector2(30, 30));
            let mass2 = new Mass(new Vector2(30, 300));
            let mass3 = new Mass(new Vector2(300, 30));
            let mass4 = new Mass(new Vector2(300, 300));
            let mass5 = new Mass(new Vector2(150, 150));
            this.addMass(mass1);
            this.addMass(mass2);
            this.addMass(mass3);
            this.addMass(mass4);
            this.addMass(mass5);

            let spring1 = new Spring(mass1, mass2);
            let spring2 = new Spring(mass1, mass3);
            let spring3 = new Spring(mass2, mass4);
            let spring4 = new Spring(mass3, mass4);
            let spring5 = new Spring(mass1, mass5, 100*Math.sqrt(2));
            let spring6 = new Spring(mass2, mass5, 100*Math.sqrt(2));
            let spring7 = new Spring(mass3, mass5, 100*Math.sqrt(2));
            let spring8 = new Spring(mass4, mass5, 100*Math.sqrt(2));
            this.addSpring(spring1);
            this.addSpring(spring2);
            this.addSpring(spring3);
            this.addSpring(spring4);
            this.addSpring(spring5);
            this.addSpring(spring6);
            this.addSpring(spring7);
            this.addSpring(spring8);
        }
    }

    public start():void {
        requestAnimationFrame(this.mainLoop.bind(this));
    }
    private mainLoop(currentTime:number):void {
        this.deltaTime = Math.min(currentTime - this.lastTime, this.maxDeltaTime);
        this.lastTime = currentTime;

        this.update(this.deltaTime);
        
        this.draw();

        requestAnimationFrame(this.mainLoop.bind(this));
    }
    private update(deltaTime:number):void {
        this.masses.forEach((mass) => mass.update(this.canvas, deltaTime, this.mousePosition, this.masses, this.gravity, this.maxForce, this.maxSpeed));
        this.springs.forEach((spring) => spring.update());
        this.entitySprings.forEach((spring) => spring.update());
    }
    private draw():void {
        // Clear screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.springs.forEach((string) => string.draw(this.ctx));
        this.masses.forEach((mass) => mass.draw(this.ctx));
    }
}
