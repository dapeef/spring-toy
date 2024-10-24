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

    public multiplyBy(scalar:number):void {
        // Sum this Vector2 with the negative of another and return a new Vector2 of the result
        this.x *= scalar
        this.y *= scalar;
    }

    public normalize():void {
        this.multiplyBy(1/this.length());
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

    public normalized():Vector2 {
        if (this.length() === 0) {
            return this
        } else {
            return this.times(1/this.length());
        }
    }

    public dot(vector:Vector2):number {
        return this.x * vector.x + this.y * vector.y;
    }

    public clamp(magnitude:number):void {
        if (this.length() > magnitude) {
            this.normalize()
            this.multiplyBy(magnitude);
        }
    }

    public copy():Vector2 {
        return new Vector2(this.x, this.y);
    }
}


export class Mass {
    private springs:Spring[];
    private _velocity:Vector2;
    public isBeingDragged:boolean = false;
    public relativeMousePosition:Vector2 = new Vector2();

    constructor(private _position:Vector2 = new Vector2(25, 25), private mass:number = 1, private stiffness:number = 1e-7, private damping:number = 1e0, private _size:Vector2 = new Vector2(50, 50), private dragCoefficient:number = 5e-4) {
        this.springs = [];
        this._velocity = new Vector2();
    }


    public get position() : Vector2 {
        return this._position;
    }
    public get velocity() : Vector2 {
        return this._velocity;
    }
    public get size() : Vector2 {
        return this._size;
    }
    
    public get left() : number {
        return this._position.x - this._size.x/2;
    }
    public get right() : number {
        return this._position.x + this._size.x/2;
    }
    public get top() : number {
        return this._position.y - this._size.y/2;
    }
    public get bottom() : number {
        return this._position.y + this._size.y/2;
    }

    public get minSize() : number {
        return Math.min(this._size.x, this._size.y);
    }

    public addSpring(spring:Spring):void {
        this.springs.push(spring);
    }
    
    public update(canvas:HTMLCanvasElement, deltaTime:number, mousePosition:Vector2, gravity:number, maxForce:number, maxSpeed:number):void {
        if (this.isBeingDragged) {
            const oldPosition = this._position.copy();
            this._position = mousePosition.minus(this.relativeMousePosition);
            this._velocity = this._position.minus(oldPosition).times(1/deltaTime);
        } else {
            let force = new Vector2();
            // Gravity
            force.add(new Vector2(0, this.mass * gravity));
            // Spring  
            this.springs.forEach(spring => {force.add(spring.getForce(this))});
            
            // Bounce off walls
            let contactSprings:ContactSpring[] = [];
            if (this.left <= 0)                 {contactSprings.push(new ContactSpring(this, new Mass(new Vector2(-this._size.x/2                , this._position.y)), this._size.x))} // Left
            if (this.right >= canvas.width)     {contactSprings.push(new ContactSpring(this, new Mass(new Vector2(canvas.width+this._size.x/2    , this._position.y)), this._size.x))} // Right
            if (this.top <= 0)                  {contactSprings.push(new ContactSpring(this, new Mass(new Vector2(this._position.x, -this._size.y/2                )), this._size.y))} // Top
            if (this.bottom >= canvas.height)   {contactSprings.push(new ContactSpring(this, new Mass(new Vector2(this._position.x, canvas.height+this._size.y/2   )), this._size.y))} // Bottom
            contactSprings.forEach(spring => {
                force.add(spring.getForce(this))});
            
            // Air resistance
            force.add(this._velocity.normalized().times(-this.dragCoefficient * Math.pow(this._velocity.length(), 2)));
            
            // Compute differential equations
            let acceleration:Vector2 = force.times(1/this.mass);
            this._velocity.add(acceleration.times(deltaTime));
            this._velocity.clamp(maxSpeed);
            this._position.add(this._velocity.times(deltaTime));

            // Put hard limit on walls
            if (this.right <= 0)            {this._velocity.x = 0; this._position.x = -this.size.x/2 + 1} // Left
            if (this.left >= canvas.width)  {this._velocity.x = 0; this._position.x = canvas.width + this.size.x/2 - 1} // Right
            if (this.bottom <= 0)           {this._velocity.y = 0; this._position.y = -this.size.y/2 + 1} // Top
            if (this.top >= canvas.height)  {this._velocity.y = 0; this._position.y = canvas.height + this.size.y/2 - 1} // Bottom
        }
    }

    public draw(ctx:CanvasRenderingContext2D):void {
        ctx.strokeStyle = "black";
        ctx.beginPath();
        // ctx.roundRect(
        //     this.left,
        //     this.top,
        //     this._size.x,
        //     this._size.y,
        //     this.minSize / 5
        // );
        ctx.ellipse(
            this._position.x,
            this._position.y,
            this._size.x/2,
            this._size.y/2,
            0,
            0, 2*Math.PI
        )
        ctx.fill();
    }
}


export class Spring {
    protected length:number = 0;
    protected relativePos:Vector2 = new Vector2();
    protected elasticForce:Vector2 = new Vector2();
    protected dampingForce:Vector2 = new Vector2();
    protected force:Vector2 = new Vector2();

    protected defaultWidth = 10;

    constructor(public mass1:Mass, public mass2:Mass, protected naturalLength = 200, protected stiffness:number = 1e-4, protected damping:number = 1e-3) {
        this.update();
    }

    public getForce(datumMass:Mass):Vector2 {
        if (datumMass === this.mass2) {
            return this.force;
        } else {
            return this.force.times(-1);
        }
    }

    public update():void {
        this.relativePos = this.mass1.position.minus(this.mass2.position);
        this.length = this.relativePos.length();
        let direction = this.relativePos.normalized();
        
        // Elastics
        this.elasticForce = direction.times((this.length - this.naturalLength) * this.stiffness)

        // Damping
        let relativeSpeed:number = this.mass1.velocity.minus(this.mass2.velocity).dot(direction);
        this.dampingForce = direction.times(relativeSpeed * this.damping)

        // Total force
        this.force = this.elasticForce.plus(this.dampingForce);
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

class ContactSpring extends Spring {
    private hertzExponent:number = 2;
    private penaltyExponent:number = .5;

    constructor(public mass1:Mass, public mass2:Mass, protected naturalLength:number, protected stiffness:number = 1e-5, protected damping:number = 1e-2) {
        super(mass2, mass1, naturalLength, stiffness, damping);
        this.update();
    }

    public update():void {
        this.relativePos = this.mass1.position.minus(this.mass2.position);
        this.length = this.relativePos.length();
        let direction = this.relativePos.normalized();
        
        // Elastics
        const hooke = Math.pow(this.naturalLength - this.length, this.hertzExponent) * this.stiffness;
        const penalty = 1 + 1 / Math.pow(this.length, this.penaltyExponent);
        this.elasticForce = direction.times(hooke * penalty).times(-1);

        // Damping
        let relativeSpeed:number = this.mass1.velocity.minus(this.mass2.velocity).dot(direction);
        this.dampingForce = direction.times(relativeSpeed * this.damping)

        // Total force
        this.force = this.elasticForce.plus(this.dampingForce);
    }
}


export class Game {
    private ctx:CanvasRenderingContext2D;
    private isMouseDown:boolean = false;
    private mousePosition = new Vector2();

    private lastTime:number; // milliseconds
    private deltaTime:number; // milliseconds
    private maxDeltaTime:number = 50; //milliseconds
    private masses:Mass[];
    private springs:Spring[];

    private gravity:number = 5e-4; // pixels/msec/msec
    private maxForce:number = 1e-1;
    private maxSpeed:number = 1e4;

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


    public mouseDown(evt:MouseEvent):void {
        this.isMouseDown = true;
        this.mousePosition.x = evt.x;
        this.mousePosition.y = evt.y;

        // Work out whether the mouse click was within any of the masses
        this.masses.forEach(mass => {
            if (
                mass.position.x - mass.size.x <= evt.x &&
                mass.position.x + mass.size.x >= evt.x &&
                mass.position.y - mass.size.y <= evt.y &&
                mass.position.y + mass.size.y >= evt.y ) {
                    mass.isBeingDragged = true;
                    mass.relativeMousePosition = this.mousePosition.minus(mass.position);
                }
        })
    }
    public mouseMove(evt:MouseEvent):void {
        this.mousePosition.x = evt.x;
        this.mousePosition.y = evt.y;
    }
    public mouseUp(evt:MouseEvent):void {
        this.isMouseDown = false;

        this.masses.forEach(mass => mass.isBeingDragged = false);
    }

    public createDemoSystemTriangle():void {
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

    public createDemoSystemParallelogram():void {
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

    public createDemoSystemSquare():void {
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

    public createDemoSystemCenteredSquare():void {
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
        this.masses.forEach((mass) => mass.update(this.canvas, deltaTime, this.mousePosition, this.gravity, this.maxForce, this.maxSpeed));
        this.springs.forEach((spring) => spring.update());
    }

    private draw():void {
        // Clear screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.springs.forEach((string) => string.draw(this.ctx));
        this.masses.forEach((mass) => mass.draw(this.ctx));
    }
}
