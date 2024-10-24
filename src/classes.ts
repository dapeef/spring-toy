export class Vector2 {
    constructor(public x:number = 0, public y:number = 0) {};

    public add(vector:Vector2):void {
        // Add another Vector2 to this Vector2
        this.x += vector.x;
        this.y += vector.y;
    }
    
    public subtract(vector:Vector2):void {
        // Subtract another Vector2 from this Vector2
        this.x -= vector.x;
        this.y -= vector.y;
    }

    public plus(vector:Vector2):Vector2 {
        // Sum this Vector2 with another and return a new Vector2 of the result
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }
    
    public minus(vector:Vector2):Vector2 {
        // Sum this Vector2 with the negative of another and return a new Vector2 of the result
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }

    public times(scalar:number):Vector2 {
        // Sum this Vector2 with the negative of another and return a new Vector2 of the result
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    public length():number {
        // Get length of the vector
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    }

    public normalize():Vector2 {
        return this.times(1/this.length());
    }

    public dot(vector:Vector2):number {
        return this.x * vector.x + this.y * vector.y;
    }
}


export class Mass {
    private springs:Spring[];
    private _velocity:Vector2;

    constructor(private _position:Vector2 = new Vector2(25, 25), private mass:number = 1, private stiffness:number = 1e-7, private damping:number = 1e0, private size:Vector2 = new Vector2(50, 50)) {
        this.springs = [];
        this._velocity = new Vector2();
    }


    public get position() : Vector2 {
        return this._position;
    }
    public get velocity() : Vector2 {
        return this._velocity;
    }
    
    public get left() : number {
        return this._position.x - this.size.x/2;
    }
    
    public get right() : number {
        return this._position.x + this.size.x/2;
    }
    
    public get top() : number {
        return this._position.y - this.size.y/2;
    }
    
    public get bottom() : number {
        return this._position.y + this.size.y/2;
    }

    public get minSize() : number {
        return Math.min(this.size.x, this.size.y);
    }


    public addSpring(spring:Spring):void {
        this.springs.push(spring);
    }
    

    public update(canvas:HTMLCanvasElement, deltaTime:number, gravity:number):void {
        let force = new Vector2();
        // Gravity
        force.add(new Vector2(0, this.mass * gravity));
        // Spring  
        this.springs.forEach(spring => {
            force.add(spring.getElasticForce(this))
            force.add(spring.getDampingForce(this))
        });
        
        let acceleration:Vector2 = force.times(1/this.mass);
        this._velocity.add(acceleration.times(deltaTime));
        this._position.add(this._velocity.times(deltaTime));

        // Bounce off walls
        // if (this.left <= 0) {this._velocity.x = 0; this._position.x = this.size.x/2} // Left
        // if (this.right >= canvas.width) {this._velocity.x = 0; this._position.x = canvas.width - this.size.x/2} // Right
        // if (this.top <= 0) {this._velocity.y = 0; this._position.y = this.size.y/2} // Top
        // if (this.bottom >= canvas.height) {this._velocity.y = 0; this._position.y = canvas.height - this.size.y/2} // Bottom
        // // Bounce off walls
        // if (this._position.x <= 0) {this.velocity.x = 0; this._position.x = this.size.x/2} // Left
        // if (this._position.x >= canvas.width) {this.velocity.x = 0; this._position.x = canvas.width - this.size.x/2} // Right
        // if (this._position.y <= 0) {this.velocity.y = 0; this._position.y = this.size.y/2} // Top
        // if (this._position.y >= canvas.height) {this.velocity.y = 0; this._position.y = canvas.height - this.size.y/2} // Bottom
    }

    public draw(ctx:CanvasRenderingContext2D):void {
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.roundRect(
            this.left,
            this.top,
            this.size.x,
            this.size.y,
            this.minSize / 5
        );
        ctx.fill();
    }
}


export class Spring {
    private length:number = 0;
    private relativePos:Vector2 = new Vector2();
    private elasticForce:Vector2 = new Vector2();
    private dampingForce:Vector2 = new Vector2();

    private defaultWidth = 10;

    constructor(public mass1:Mass, public mass2:Mass, private naturalLength=200, private stiffness:number=1e-4, private damping:number = 1e-3) {
        this.update()
    }

    public getElasticForce(datumMass:Mass):Vector2 {
        if (datumMass === this.mass2) {
            return this.elasticForce;
        } else {
            return this.elasticForce.times(-1);
        }
    }

    public getDampingForce(datumMass:Mass):Vector2 {
        if (datumMass === this.mass2) {
            return this.dampingForce;
        } else {
            return this.dampingForce.times(-1);
        }
    }

    public update():void {
        this.relativePos = this.mass1.position.minus(this.mass2.position);
        this.length = this.relativePos.length();
        let direction = this.relativePos.normalize();
        
        // Elastics
        this.elasticForce = direction.times((this.length - this.naturalLength) * this.stiffness)

        // Damping
        let relativeSpeed:number = this.mass1.velocity.minus(this.mass2.velocity).dot(direction);
        this.dampingForce = direction.times(relativeSpeed * this.damping)
    }

    public draw(ctx:CanvasRenderingContext2D):void {
        ctx.beginPath();

        ctx.moveTo(this.mass1.position.x, this.mass1.position.y);
        ctx.lineTo(this.mass2.position.x, this.mass2.position.y);

        ctx.lineWidth = Math.min(this.defaultWidth * this.naturalLength / this.length, this.mass1.minSize, this.mass2.minSize);
        ctx.strokeStyle = 'gray';

        ctx.stroke();
    }
}


export class Game {
    private ctx:CanvasRenderingContext2D;

    private lastTime:number; // milliseconds
    private deltaTime:number; // milliseconds
    private masses:Mass[];
    private springs:Spring[];

    private gravity:number = 0; //1e-6; // pixels/sec/sec

    constructor(private canvas:HTMLCanvasElement) {
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        this.lastTime = 0;
        this.deltaTime = 0;

        this.masses = [];
        this.springs = [];
    }


    public addMass(mass:Mass):void {
        this.masses.push(mass);
    }

    public addSpring(spring:Spring):void {
        this.springs.push(spring);
        
        spring.mass1.addSpring(spring);
        spring.mass2.addSpring(spring);
    }


    public start():void {
        requestAnimationFrame(this.mainLoop.bind(this));
    }

    private mainLoop(currentTime:number):void {
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(this.deltaTime);
        
        this.draw();

        requestAnimationFrame(this.mainLoop.bind(this));
    }

    private update(deltaTime:number):void {
        console.log(`Update!`);

        this.masses.forEach((mass) => mass.update(this.canvas, deltaTime, this.gravity));
        this.springs.forEach((spring) => spring.update());
    }

    private draw():void {
        // Clear screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.springs.forEach((string) => string.draw(this.ctx));
        this.masses.forEach((mass) => mass.draw(this.ctx));
    }
}
