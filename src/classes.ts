export class Vector2 {
    constructor(public x:number = 0, public y:number = 0) {};

    add(vector:Vector2):Vector2 {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }
    
    subtract(vector:Vector2):Vector2 {
        this.x -= vector.x;
        this.y -= vector.y;

        return this;
    }
}

export class Mass {
    constructor(private position:Vector2 = new Vector2(), private mass:number = 1, private size:Vector2 = new Vector2(10, 10)) {
        
    }

    draw(ctx:CanvasRenderingContext2D):void {
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y)
    }
}