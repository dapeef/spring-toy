export enum DemoType {
    Triangle,
    Parallelogram,
    Square,
    CenteredSquare
}


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
