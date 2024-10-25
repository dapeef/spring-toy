import { Vector2 } from "./utilities";

export class Mass {
    private springs:Spring[];
    private entitySprings:Spring[];
    private _velocity:Vector2;
    public isBeingDragged:boolean = false;
    public relativeMousePosition:Vector2 = new Vector2();

    constructor(private _position:Vector2 = new Vector2(25, 25), private mass:number = 1, private stiffness:number = 1e-7, private damping:number = 1e0, private _size:Vector2 = new Vector2(50, 50), private dragCoefficient:number = 5e-4) {
        this.springs = [];
        this.entitySprings = [];
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
    public get maxSize() : number {
        return Math.max(this._size.x, this._size.y);
    }


    public addSpring(spring:Spring):void {
        this.springs.push(spring);
    }
    public addEntitySpring(spring:Spring):void {
        this.entitySprings.push(spring);
    }
    

    public update(canvas:HTMLCanvasElement, deltaTime:number, mousePosition:Vector2, masses:Mass[], gravity:number, maxForce:number, maxSpeed:number):void {
        if (this.isBeingDragged) {
            const oldPosition = this._position.copy();
            this._position = mousePosition.minus(this.relativeMousePosition);
            this._velocity = this._position.minus(oldPosition).times(1/deltaTime);
        } else {
            let force = new Vector2();
            // Gravity
            force.add(new Vector2(0, this.mass * gravity));

            // Springs
            this.springs.forEach(spring => {force.add(spring.getForce(this))});
            
            // Bounce off walls
            let wallSprings:ContactSpring[] = [];
            if (this.left <= 0)                 {wallSprings.push(new ContactSpring(this, new Mass(new Vector2(-this._size.x/2                , this._position.y)), this._size.x))} // Left
            if (this.right >= canvas.width)     {wallSprings.push(new ContactSpring(this, new Mass(new Vector2(canvas.width+this._size.x/2    , this._position.y)), this._size.x))} // Right
            if (this.top <= 0)                  {wallSprings.push(new ContactSpring(this, new Mass(new Vector2(this._position.x, -this._size.y/2                )), this._size.y))} // Top
            if (this.bottom >= canvas.height)   {wallSprings.push(new ContactSpring(this, new Mass(new Vector2(this._position.x, canvas.height+this._size.y/2   )), this._size.y))} // Bottom
            wallSprings.forEach(spring => {force.add(spring.getForce(this))});
            
            // Bounce off other entities
            this.entitySprings.forEach(spring => {force.add(spring.getForce(this))});
            
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

export class ContactSpring extends Spring {
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

        if (this.length < this.naturalLength) {
            // Elastics
            const hooke = Math.pow(this.naturalLength - this.length, this.hertzExponent) * this.stiffness;
            const penalty = 1 + 1 / Math.pow(this.length, this.penaltyExponent);
            this.elasticForce = direction.times(hooke * penalty).times(-1);

            // Damping
            let relativeSpeed:number = this.mass1.velocity.minus(this.mass2.velocity).dot(direction);
            this.dampingForce = direction.times(relativeSpeed * this.damping)

            // Total force
            this.force = this.elasticForce.plus(this.dampingForce);
        } else {
            this.force = new Vector2();
        }
    }
}