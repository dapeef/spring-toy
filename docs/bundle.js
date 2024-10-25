/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/entities.ts":
/*!*************************!*\
  !*** ./src/entities.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContactSpring: () => (/* binding */ ContactSpring),
/* harmony export */   Mass: () => (/* binding */ Mass),
/* harmony export */   Spring: () => (/* binding */ Spring)
/* harmony export */ });
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utilities */ "./src/utilities.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Mass = /** @class */ (function () {
    function Mass(_position, mass, stiffness, damping, _size, dragCoefficient) {
        if (_position === void 0) { _position = new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(25, 25); }
        if (mass === void 0) { mass = 1; }
        if (stiffness === void 0) { stiffness = 1e-7; }
        if (damping === void 0) { damping = 1e0; }
        if (_size === void 0) { _size = new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(50, 50); }
        if (dragCoefficient === void 0) { dragCoefficient = 5e-4; }
        this._position = _position;
        this.mass = mass;
        this.stiffness = stiffness;
        this.damping = damping;
        this._size = _size;
        this.dragCoefficient = dragCoefficient;
        this.isBeingDragged = false;
        this.relativeMousePosition = new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2();
        this.springs = [];
        this.entitySprings = [];
        this._velocity = new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2();
    }
    Object.defineProperty(Mass.prototype, "position", {
        get: function () {
            return this._position;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mass.prototype, "velocity", {
        get: function () {
            return this._velocity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mass.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mass.prototype, "left", {
        get: function () {
            return this._position.x - this._size.x / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mass.prototype, "right", {
        get: function () {
            return this._position.x + this._size.x / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mass.prototype, "top", {
        get: function () {
            return this._position.y - this._size.y / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mass.prototype, "bottom", {
        get: function () {
            return this._position.y + this._size.y / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mass.prototype, "minSize", {
        get: function () {
            return Math.min(this._size.x, this._size.y);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mass.prototype, "maxSize", {
        get: function () {
            return Math.max(this._size.x, this._size.y);
        },
        enumerable: false,
        configurable: true
    });
    Mass.prototype.addSpring = function (spring) {
        this.springs.push(spring);
    };
    Mass.prototype.addEntitySpring = function (spring) {
        this.entitySprings.push(spring);
    };
    Mass.prototype.update = function (canvas, deltaTime, mousePosition, masses, gravity, maxForce, maxSpeed) {
        var _this = this;
        if (this.isBeingDragged) {
            var oldPosition = this._position.copy();
            this._position = mousePosition.minus(this.relativeMousePosition);
            this._velocity = this._position.minus(oldPosition).times(1 / deltaTime);
        }
        else {
            var force_1 = new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2();
            // Gravity
            force_1.add(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(0, this.mass * gravity));
            // Springs
            this.springs.forEach(function (spring) { force_1.add(spring.getForce(_this)); });
            // Bounce off walls
            var wallSprings = [];
            if (this.left <= 0) {
                wallSprings.push(new ContactSpring(this, new Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(-this._size.x / 2, this._position.y)), this._size.x));
            } // Left
            if (this.right >= canvas.width) {
                wallSprings.push(new ContactSpring(this, new Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(canvas.width + this._size.x / 2, this._position.y)), this._size.x));
            } // Right
            if (this.top <= 0) {
                wallSprings.push(new ContactSpring(this, new Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(this._position.x, -this._size.y / 2)), this._size.y));
            } // Top
            if (this.bottom >= canvas.height) {
                wallSprings.push(new ContactSpring(this, new Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(this._position.x, canvas.height + this._size.y / 2)), this._size.y));
            } // Bottom
            wallSprings.forEach(function (spring) { force_1.add(spring.getForce(_this)); });
            // Bounce off other entities
            this.entitySprings.forEach(function (spring) { force_1.add(spring.getForce(_this)); });
            // Air resistance
            force_1.add(this._velocity.normalized().times(-this.dragCoefficient * Math.pow(this._velocity.length(), 2)));
            // Compute differential equations
            var acceleration = force_1.times(1 / this.mass);
            this._velocity.add(acceleration.times(deltaTime));
            this._velocity.clamp(maxSpeed);
            this._position.add(this._velocity.times(deltaTime));
            // Put hard limit on walls
            if (this.right <= 0) {
                this._velocity.x = 0;
                this._position.x = -this.size.x / 2 + 1;
            } // Left
            if (this.left >= canvas.width) {
                this._velocity.x = 0;
                this._position.x = canvas.width + this.size.x / 2 - 1;
            } // Right
            if (this.bottom <= 0) {
                this._velocity.y = 0;
                this._position.y = -this.size.y / 2 + 1;
            } // Top
            if (this.top >= canvas.height) {
                this._velocity.y = 0;
                this._position.y = canvas.height + this.size.y / 2 - 1;
            } // Bottom
        }
    };
    Mass.prototype.draw = function (ctx) {
        ctx.strokeStyle = "black";
        ctx.beginPath();
        // ctx.roundRect(
        //     this.left,
        //     this.top,
        //     this._size.x,
        //     this._size.y,
        //     this.minSize / 5
        // );
        ctx.ellipse(this._position.x, this._position.y, this._size.x / 2, this._size.y / 2, 0, 0, 2 * Math.PI);
        ctx.fill();
    };
    return Mass;
}());

var Spring = /** @class */ (function () {
    function Spring(mass1, mass2, naturalLength, stiffness, damping) {
        if (naturalLength === void 0) { naturalLength = 200; }
        if (stiffness === void 0) { stiffness = 1e-4; }
        if (damping === void 0) { damping = 1e-3; }
        this.mass1 = mass1;
        this.mass2 = mass2;
        this.naturalLength = naturalLength;
        this.stiffness = stiffness;
        this.damping = damping;
        this.length = 0;
        this.relativePos = new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2();
        this.elasticForce = new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2();
        this.dampingForce = new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2();
        this.force = new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2();
        this.defaultWidth = 10;
        this.update();
    }
    Spring.prototype.getForce = function (datumMass) {
        if (datumMass === this.mass2) {
            return this.force;
        }
        else {
            return this.force.times(-1);
        }
    };
    Spring.prototype.update = function () {
        this.relativePos = this.mass1.position.minus(this.mass2.position);
        this.length = this.relativePos.length();
        var direction = this.relativePos.normalized();
        // Elastics
        this.elasticForce = direction.times((this.length - this.naturalLength) * this.stiffness);
        // Damping
        var relativeSpeed = this.mass1.velocity.minus(this.mass2.velocity).dot(direction);
        this.dampingForce = direction.times(relativeSpeed * this.damping);
        // Total force
        this.force = this.elasticForce.plus(this.dampingForce);
    };
    Spring.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.moveTo(this.mass1.position.x, this.mass1.position.y);
        ctx.lineTo(this.mass2.position.x, this.mass2.position.y);
        ctx.lineWidth = Math.min(this.defaultWidth * this.naturalLength / this.length, this.mass1.minSize, this.mass2.minSize);
        ctx.strokeStyle = 'gray';
        ctx.stroke();
    };
    return Spring;
}());

var ContactSpring = /** @class */ (function (_super) {
    __extends(ContactSpring, _super);
    function ContactSpring(mass1, mass2, naturalLength, stiffness, damping) {
        if (stiffness === void 0) { stiffness = 1e-5; }
        if (damping === void 0) { damping = 1e-2; }
        var _this = _super.call(this, mass2, mass1, naturalLength, stiffness, damping) || this;
        _this.mass1 = mass1;
        _this.mass2 = mass2;
        _this.naturalLength = naturalLength;
        _this.stiffness = stiffness;
        _this.damping = damping;
        _this.hertzExponent = 2;
        _this.penaltyExponent = .5;
        _this.update();
        return _this;
    }
    ContactSpring.prototype.update = function () {
        this.relativePos = this.mass1.position.minus(this.mass2.position);
        this.length = this.relativePos.length();
        var direction = this.relativePos.normalized();
        if (this.length < this.naturalLength) {
            // Elastics
            var hooke = Math.pow(this.naturalLength - this.length, this.hertzExponent) * this.stiffness;
            var penalty = 1 + 1 / Math.pow(this.length, this.penaltyExponent);
            this.elasticForce = direction.times(hooke * penalty).times(-1);
            // Damping
            var relativeSpeed = this.mass1.velocity.minus(this.mass2.velocity).dot(direction);
            this.dampingForce = direction.times(relativeSpeed * this.damping);
            // Total force
            this.force = this.elasticForce.plus(this.dampingForce);
        }
        else {
            this.force = new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2();
        }
    };
    return ContactSpring;
}(Spring));



/***/ }),

/***/ "./src/game.ts":
/*!*********************!*\
  !*** ./src/game.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Game: () => (/* binding */ Game)
/* harmony export */ });
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utilities */ "./src/utilities.ts");
/* harmony import */ var _entities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entities */ "./src/entities.ts");


var Game = /** @class */ (function () {
    function Game(canvas) {
        this.canvas = canvas;
        this.mousePosition = new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2();
        this.maxDeltaTime = 50; //milliseconds
        this.gravity = 5e-4; // pixels/msec/msec
        this.maxForce = 1e-1;
        this.maxSpeed = 1e4;
        this.ctx = canvas.getContext("2d");
        this.lastTime = 0;
        this.deltaTime = 0;
        this.masses = [];
        this.springs = [];
        this.entitySprings = [];
    }
    Game.prototype.addMass = function (mass) {
        var _this = this;
        this.masses.forEach(function (existingMass) {
            var newSpring = new _entities__WEBPACK_IMPORTED_MODULE_1__.ContactSpring(existingMass, mass, existingMass.maxSize / 2 + mass.maxSize / 2);
            _this.entitySprings.push(newSpring);
            existingMass.addEntitySpring(newSpring);
            mass.addEntitySpring(newSpring);
        });
        this.masses.push(mass);
    };
    Game.prototype.addSpring = function (spring) {
        this.springs.push(spring);
        spring.mass1.addSpring(spring);
        spring.mass2.addSpring(spring);
    };
    Game.prototype.mouseDown = function (evt) {
        var _this = this;
        evt.preventDefault(); // Prevents mouse emulation on touch events
        if (evt instanceof MouseEvent) {
            this.mousePosition.x = evt.clientX;
            this.mousePosition.y = evt.clientY;
        }
        else if (evt instanceof TouchEvent) {
            var touch = evt.touches[0];
            this.mousePosition.x = touch.clientX;
            this.mousePosition.y = touch.clientY;
        }
        // Work out whether the mouse click was within any of the masses
        var massesUnderMouse = [];
        this.masses.forEach(function (mass) {
            if (mass.position.x - mass.size.x <= _this.mousePosition.x &&
                mass.position.x + mass.size.x >= _this.mousePosition.x &&
                mass.position.y - mass.size.y <= _this.mousePosition.y &&
                mass.position.y + mass.size.y >= _this.mousePosition.y) {
                massesUnderMouse.push(mass);
            }
        });
        // Select mass closest to mouse
        if (massesUnderMouse.length > 0) {
            var closestMass_1 = massesUnderMouse[0];
            var closestMassDistance_1 = Infinity;
            massesUnderMouse.forEach(function (mass) {
                if (_this.mousePosition.minus(mass.position).length() < closestMassDistance_1) {
                    closestMass_1 = mass;
                    closestMassDistance_1 = _this.mousePosition.minus(mass.position).length();
                }
            });
            closestMass_1.isBeingDragged = true;
            closestMass_1.relativeMousePosition = this.mousePosition.minus(closestMass_1.position);
        }
    };
    Game.prototype.mouseMove = function (evt) {
        evt.preventDefault(); // Prevents mouse emulation on touch events
        if (evt instanceof MouseEvent) {
            this.mousePosition.x = evt.clientX;
            this.mousePosition.y = evt.clientY;
        }
        else if (evt instanceof TouchEvent) {
            var touch = evt.touches[0];
            this.mousePosition.x = touch.clientX;
            this.mousePosition.y = touch.clientY;
        }
    };
    Game.prototype.mouseUp = function (evt) {
        this.masses.forEach(function (mass) { return mass.isBeingDragged = false; });
    };
    Game.prototype.createDemo = function (type) {
        if (type === _utilities__WEBPACK_IMPORTED_MODULE_0__.DemoType.Triangle) {
            var mass1 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(15, 30));
            var mass2 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(30, 300));
            var mass3 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(300, 30));
            this.addMass(mass1);
            this.addMass(mass2);
            this.addMass(mass3);
            var spring1 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass1, mass2);
            var spring2 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass2, mass3);
            var spring3 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass1, mass3);
            this.addSpring(spring1);
            this.addSpring(spring2);
            this.addSpring(spring3);
        }
        if (type === _utilities__WEBPACK_IMPORTED_MODULE_0__.DemoType.Parallelogram) {
            var mass1 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(30, 30));
            var mass2 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(30, 300));
            var mass3 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(300, 30));
            var mass4 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(300, 300));
            this.addMass(mass1);
            this.addMass(mass2);
            this.addMass(mass3);
            this.addMass(mass4);
            var spring1 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass1, mass2);
            var spring2 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass2, mass3);
            var spring3 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass1, mass3);
            var spring4 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass3, mass4);
            var spring5 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass2, mass4);
            this.addSpring(spring1);
            this.addSpring(spring2);
            this.addSpring(spring3);
            this.addSpring(spring4);
            this.addSpring(spring5);
        }
        if (type === _utilities__WEBPACK_IMPORTED_MODULE_0__.DemoType.Square) {
            var mass1 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(30, 30));
            var mass2 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(30, 300));
            var mass3 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(300, 30));
            var mass4 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(300, 300));
            this.addMass(mass1);
            this.addMass(mass2);
            this.addMass(mass3);
            this.addMass(mass4);
            var spring1 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass1, mass2);
            var spring2 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass1, mass4, 200 * Math.sqrt(2));
            var spring3 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass2, mass4);
            var spring4 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass3, mass4);
            var spring5 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass1, mass3);
            var spring6 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass2, mass3, 200 * Math.sqrt(2));
            this.addSpring(spring1);
            this.addSpring(spring2);
            this.addSpring(spring3);
            this.addSpring(spring4);
            this.addSpring(spring5);
            this.addSpring(spring6);
        }
        if (type === _utilities__WEBPACK_IMPORTED_MODULE_0__.DemoType.CenteredSquare) {
            var mass1 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(30, 30));
            var mass2 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(30, 300));
            var mass3 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(300, 30));
            var mass4 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(300, 300));
            var mass5 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(150, 150));
            this.addMass(mass1);
            this.addMass(mass2);
            this.addMass(mass3);
            this.addMass(mass4);
            this.addMass(mass5);
            var spring1 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass1, mass2);
            var spring2 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass1, mass3);
            var spring3 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass2, mass4);
            var spring4 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass3, mass4);
            var spring5 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass1, mass5, 100 * Math.sqrt(2));
            var spring6 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass2, mass5, 100 * Math.sqrt(2));
            var spring7 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass3, mass5, 100 * Math.sqrt(2));
            var spring8 = new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(mass4, mass5, 100 * Math.sqrt(2));
            this.addSpring(spring1);
            this.addSpring(spring2);
            this.addSpring(spring3);
            this.addSpring(spring4);
            this.addSpring(spring5);
            this.addSpring(spring6);
            this.addSpring(spring7);
            this.addSpring(spring8);
        }
        if (type === _utilities__WEBPACK_IMPORTED_MODULE_0__.DemoType.Hexagon) {
            var centerMass = new _entities__WEBPACK_IMPORTED_MODULE_1__.Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(300, 300));
            this.addMass(centerMass);
            var edgeMasses = [];
            for (var i = 0; i < 6; i++) {
                var newMass = new _entities__WEBPACK_IMPORTED_MODULE_1__.Mass(new _utilities__WEBPACK_IMPORTED_MODULE_0__.Vector2(180 + 150 * Math.cos(i * Math.PI / 3), 180 + 150 * Math.sin(i * Math.PI / 3)));
                edgeMasses.push(newMass);
                this.addMass(newMass);
            }
            for (var i = 0; i < 6; i++) {
                this.addSpring(new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(edgeMasses[i], edgeMasses[(i + 1) % 6]));
                this.addSpring(new _entities__WEBPACK_IMPORTED_MODULE_1__.Spring(edgeMasses[i], centerMass));
            }
        }
    };
    Game.prototype.start = function () {
        requestAnimationFrame(this.mainLoop.bind(this));
    };
    Game.prototype.mainLoop = function (currentTime) {
        this.deltaTime = Math.min(currentTime - this.lastTime, this.maxDeltaTime);
        this.lastTime = currentTime;
        this.update(this.deltaTime);
        this.draw();
        requestAnimationFrame(this.mainLoop.bind(this));
    };
    Game.prototype.update = function (deltaTime) {
        var _this = this;
        this.masses.forEach(function (mass) { return mass.update(_this.canvas, deltaTime, _this.mousePosition, _this.masses, _this.gravity, _this.maxForce, _this.maxSpeed); });
        this.springs.forEach(function (spring) { return spring.update(); });
        this.entitySprings.forEach(function (spring) { return spring.update(); });
    };
    Game.prototype.draw = function () {
        var _this = this;
        // Clear screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.springs.forEach(function (string) { return string.draw(_this.ctx); });
        this.masses.forEach(function (mass) { return mass.draw(_this.ctx); });
    };
    return Game;
}());



/***/ }),

/***/ "./src/utilities.ts":
/*!**************************!*\
  !*** ./src/utilities.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DemoType: () => (/* binding */ DemoType),
/* harmony export */   Vector2: () => (/* binding */ Vector2)
/* harmony export */ });
var DemoType;
(function (DemoType) {
    DemoType[DemoType["Triangle"] = 0] = "Triangle";
    DemoType[DemoType["Parallelogram"] = 1] = "Parallelogram";
    DemoType[DemoType["Square"] = 2] = "Square";
    DemoType[DemoType["CenteredSquare"] = 3] = "CenteredSquare";
    DemoType[DemoType["Hexagon"] = 4] = "Hexagon";
})(DemoType || (DemoType = {}));
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    ;
    Vector2.prototype.add = function (vector) {
        // Add another Vector2 to this Vector2
        this.x += vector.x;
        this.y += vector.y;
    };
    Vector2.prototype.subtract = function (vector) {
        // Subtract another Vector2 from this Vector2
        this.x -= vector.x;
        this.y -= vector.y;
    };
    Vector2.prototype.multiplyBy = function (scalar) {
        // Sum this Vector2 with the negative of another and return a new Vector2 of the result
        this.x *= scalar;
        this.y *= scalar;
    };
    Vector2.prototype.normalize = function () {
        this.multiplyBy(1 / this.length());
    };
    Vector2.prototype.plus = function (vector) {
        // Sum this Vector2 with another and return a new Vector2 of the result
        return new Vector2(this.x + vector.x, this.y + vector.y);
    };
    Vector2.prototype.minus = function (vector) {
        // Sum this Vector2 with the negative of another and return a new Vector2 of the result
        return new Vector2(this.x - vector.x, this.y - vector.y);
    };
    Vector2.prototype.times = function (scalar) {
        // Sum this Vector2 with the negative of another and return a new Vector2 of the result
        return new Vector2(this.x * scalar, this.y * scalar);
    };
    Vector2.prototype.length = function () {
        // Get length of the vector
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
    Vector2.prototype.normalized = function () {
        if (this.length() === 0) {
            return this;
        }
        else {
            return this.times(1 / this.length());
        }
    };
    Vector2.prototype.dot = function (vector) {
        return this.x * vector.x + this.y * vector.y;
    };
    Vector2.prototype.clamp = function (magnitude) {
        if (this.length() > magnitude) {
            this.normalize();
            this.multiplyBy(magnitude);
        }
    };
    Vector2.prototype.copy = function () {
        return new Vector2(this.x, this.y);
    };
    return Vector2;
}());



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utilities */ "./src/utilities.ts");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game */ "./src/game.ts");


var canvas = document.getElementById("canvas");
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
var game = new _game__WEBPACK_IMPORTED_MODULE_1__.Game(canvas);
canvas.addEventListener("mousedown", game.mouseDown.bind(game));
canvas.addEventListener("mousemove", game.mouseMove.bind(game));
canvas.addEventListener("mouseup", game.mouseUp.bind(game));
canvas.addEventListener("touchstart", game.mouseDown.bind(game), { passive: false });
canvas.addEventListener("touchmove", game.mouseMove.bind(game), { passive: false });
canvas.addEventListener("touchend", game.mouseUp.bind(game), { passive: false });
var randEnum = Math.floor(Math.random() * Object.keys(_utilities__WEBPACK_IMPORTED_MODULE_0__.DemoType).length / 2);
game.createDemo(randEnum);
// game.createDemo(DemoType.Hexagon);
game.start();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxnREFBUSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUM3RSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLHFDQUFxQztBQUVyQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zcHJpbmctdG95Ly4vc3JjL2VudGl0aWVzLnRzIiwid2VicGFjazovL3NwcmluZy10b3kvLi9zcmMvZ2FtZS50cyIsIndlYnBhY2s6Ly9zcHJpbmctdG95Ly4vc3JjL3V0aWxpdGllcy50cyIsIndlYnBhY2s6Ly9zcHJpbmctdG95L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NwcmluZy10b3kvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3NwcmluZy10b3kvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9zcHJpbmctdG95L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vc3ByaW5nLXRveS8uL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi91dGlsaXRpZXNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNYXNzIHtcclxuICAgIHByaXZhdGUgc3ByaW5nczpTcHJpbmdbXTtcclxuICAgIHByaXZhdGUgZW50aXR5U3ByaW5nczpTcHJpbmdbXTtcclxuICAgIHByaXZhdGUgX3ZlbG9jaXR5OlZlY3RvcjI7XHJcbiAgICBwdWJsaWMgaXNCZWluZ0RyYWdnZWQ6Ym9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHJlbGF0aXZlTW91c2VQb3NpdGlvbjpWZWN0b3IyID0gbmV3IFZlY3RvcjIoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wb3NpdGlvbjpWZWN0b3IyID0gbmV3IFZlY3RvcjIoMjUsIDI1KSwgcHJpdmF0ZSBtYXNzOm51bWJlciA9IDEsIHByaXZhdGUgc3RpZmZuZXNzOm51bWJlciA9IDFlLTcsIHByaXZhdGUgZGFtcGluZzpudW1iZXIgPSAxZTAsIHByaXZhdGUgX3NpemU6VmVjdG9yMiA9IG5ldyBWZWN0b3IyKDUwLCA1MCksIHByaXZhdGUgZHJhZ0NvZWZmaWNpZW50Om51bWJlciA9IDVlLTQpIHtcclxuICAgICAgICB0aGlzLnNwcmluZ3MgPSBbXTtcclxuICAgICAgICB0aGlzLmVudGl0eVNwcmluZ3MgPSBbXTtcclxuICAgICAgICB0aGlzLl92ZWxvY2l0eSA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBnZXQgcG9zaXRpb24oKSA6IFZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgdmVsb2NpdHkoKSA6IFZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92ZWxvY2l0eTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgc2l6ZSgpIDogVmVjdG9yMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpemU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXQgbGVmdCgpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb24ueCAtIHRoaXMuX3NpemUueC8yO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCByaWdodCgpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb24ueCArIHRoaXMuX3NpemUueC8yO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCB0b3AoKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uLnkgLSB0aGlzLl9zaXplLnkvMjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgYm90dG9tKCkgOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbi55ICsgdGhpcy5fc2l6ZS55LzI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBtaW5TaXplKCkgOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLm1pbih0aGlzLl9zaXplLngsIHRoaXMuX3NpemUueSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IG1heFNpemUoKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KHRoaXMuX3NpemUueCwgdGhpcy5fc2l6ZS55KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIGFkZFNwcmluZyhzcHJpbmc6U3ByaW5nKTp2b2lkIHtcclxuICAgICAgICB0aGlzLnNwcmluZ3MucHVzaChzcHJpbmcpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZEVudGl0eVNwcmluZyhzcHJpbmc6U3ByaW5nKTp2b2lkIHtcclxuICAgICAgICB0aGlzLmVudGl0eVNwcmluZ3MucHVzaChzcHJpbmcpO1xyXG4gICAgfVxyXG4gICAgXHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShjYW52YXM6SFRNTENhbnZhc0VsZW1lbnQsIGRlbHRhVGltZTpudW1iZXIsIG1vdXNlUG9zaXRpb246VmVjdG9yMiwgbWFzc2VzOk1hc3NbXSwgZ3Jhdml0eTpudW1iZXIsIG1heEZvcmNlOm51bWJlciwgbWF4U3BlZWQ6bnVtYmVyKTp2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5pc0JlaW5nRHJhZ2dlZCkge1xyXG4gICAgICAgICAgICBjb25zdCBvbGRQb3NpdGlvbiA9IHRoaXMuX3Bvc2l0aW9uLmNvcHkoKTtcclxuICAgICAgICAgICAgdGhpcy5fcG9zaXRpb24gPSBtb3VzZVBvc2l0aW9uLm1pbnVzKHRoaXMucmVsYXRpdmVNb3VzZVBvc2l0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5fdmVsb2NpdHkgPSB0aGlzLl9wb3NpdGlvbi5taW51cyhvbGRQb3NpdGlvbikudGltZXMoMS9kZWx0YVRpbWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBmb3JjZSA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICAgICAgICAgIC8vIEdyYXZpdHlcclxuICAgICAgICAgICAgZm9yY2UuYWRkKG5ldyBWZWN0b3IyKDAsIHRoaXMubWFzcyAqIGdyYXZpdHkpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFNwcmluZ3NcclxuICAgICAgICAgICAgdGhpcy5zcHJpbmdzLmZvckVhY2goc3ByaW5nID0+IHtmb3JjZS5hZGQoc3ByaW5nLmdldEZvcmNlKHRoaXMpKX0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gQm91bmNlIG9mZiB3YWxsc1xyXG4gICAgICAgICAgICBsZXQgd2FsbFNwcmluZ3M6Q29udGFjdFNwcmluZ1tdID0gW107XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmxlZnQgPD0gMCkgICAgICAgICAgICAgICAgIHt3YWxsU3ByaW5ncy5wdXNoKG5ldyBDb250YWN0U3ByaW5nKHRoaXMsIG5ldyBNYXNzKG5ldyBWZWN0b3IyKC10aGlzLl9zaXplLngvMiAgICAgICAgICAgICAgICAsIHRoaXMuX3Bvc2l0aW9uLnkpKSwgdGhpcy5fc2l6ZS54KSl9IC8vIExlZnRcclxuICAgICAgICAgICAgaWYgKHRoaXMucmlnaHQgPj0gY2FudmFzLndpZHRoKSAgICAge3dhbGxTcHJpbmdzLnB1c2gobmV3IENvbnRhY3RTcHJpbmcodGhpcywgbmV3IE1hc3MobmV3IFZlY3RvcjIoY2FudmFzLndpZHRoK3RoaXMuX3NpemUueC8yICAgICwgdGhpcy5fcG9zaXRpb24ueSkpLCB0aGlzLl9zaXplLngpKX0gLy8gUmlnaHRcclxuICAgICAgICAgICAgaWYgKHRoaXMudG9wIDw9IDApICAgICAgICAgICAgICAgICAge3dhbGxTcHJpbmdzLnB1c2gobmV3IENvbnRhY3RTcHJpbmcodGhpcywgbmV3IE1hc3MobmV3IFZlY3RvcjIodGhpcy5fcG9zaXRpb24ueCwgLXRoaXMuX3NpemUueS8yICAgICAgICAgICAgICAgICkpLCB0aGlzLl9zaXplLnkpKX0gLy8gVG9wXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJvdHRvbSA+PSBjYW52YXMuaGVpZ2h0KSAgIHt3YWxsU3ByaW5ncy5wdXNoKG5ldyBDb250YWN0U3ByaW5nKHRoaXMsIG5ldyBNYXNzKG5ldyBWZWN0b3IyKHRoaXMuX3Bvc2l0aW9uLngsIGNhbnZhcy5oZWlnaHQrdGhpcy5fc2l6ZS55LzIgICApKSwgdGhpcy5fc2l6ZS55KSl9IC8vIEJvdHRvbVxyXG4gICAgICAgICAgICB3YWxsU3ByaW5ncy5mb3JFYWNoKHNwcmluZyA9PiB7Zm9yY2UuYWRkKHNwcmluZy5nZXRGb3JjZSh0aGlzKSl9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEJvdW5jZSBvZmYgb3RoZXIgZW50aXRpZXNcclxuICAgICAgICAgICAgdGhpcy5lbnRpdHlTcHJpbmdzLmZvckVhY2goc3ByaW5nID0+IHtmb3JjZS5hZGQoc3ByaW5nLmdldEZvcmNlKHRoaXMpKX0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gQWlyIHJlc2lzdGFuY2VcclxuICAgICAgICAgICAgZm9yY2UuYWRkKHRoaXMuX3ZlbG9jaXR5Lm5vcm1hbGl6ZWQoKS50aW1lcygtdGhpcy5kcmFnQ29lZmZpY2llbnQgKiBNYXRoLnBvdyh0aGlzLl92ZWxvY2l0eS5sZW5ndGgoKSwgMikpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIENvbXB1dGUgZGlmZmVyZW50aWFsIGVxdWF0aW9uc1xyXG4gICAgICAgICAgICBsZXQgYWNjZWxlcmF0aW9uOlZlY3RvcjIgPSBmb3JjZS50aW1lcygxL3RoaXMubWFzcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZlbG9jaXR5LmFkZChhY2NlbGVyYXRpb24udGltZXMoZGVsdGFUaW1lKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZlbG9jaXR5LmNsYW1wKG1heFNwZWVkKTtcclxuICAgICAgICAgICAgdGhpcy5fcG9zaXRpb24uYWRkKHRoaXMuX3ZlbG9jaXR5LnRpbWVzKGRlbHRhVGltZSkpO1xyXG5cclxuICAgICAgICAgICAgLy8gUHV0IGhhcmQgbGltaXQgb24gd2FsbHNcclxuICAgICAgICAgICAgaWYgKHRoaXMucmlnaHQgPD0gMCkgICAgICAgICAgICB7dGhpcy5fdmVsb2NpdHkueCA9IDA7IHRoaXMuX3Bvc2l0aW9uLnggPSAtdGhpcy5zaXplLngvMiArIDF9IC8vIExlZnRcclxuICAgICAgICAgICAgaWYgKHRoaXMubGVmdCA+PSBjYW52YXMud2lkdGgpICB7dGhpcy5fdmVsb2NpdHkueCA9IDA7IHRoaXMuX3Bvc2l0aW9uLnggPSBjYW52YXMud2lkdGggKyB0aGlzLnNpemUueC8yIC0gMX0gLy8gUmlnaHRcclxuICAgICAgICAgICAgaWYgKHRoaXMuYm90dG9tIDw9IDApICAgICAgICAgICB7dGhpcy5fdmVsb2NpdHkueSA9IDA7IHRoaXMuX3Bvc2l0aW9uLnkgPSAtdGhpcy5zaXplLnkvMiArIDF9IC8vIFRvcFxyXG4gICAgICAgICAgICBpZiAodGhpcy50b3AgPj0gY2FudmFzLmhlaWdodCkgIHt0aGlzLl92ZWxvY2l0eS55ID0gMDsgdGhpcy5fcG9zaXRpb24ueSA9IGNhbnZhcy5oZWlnaHQgKyB0aGlzLnNpemUueS8yIC0gMX0gLy8gQm90dG9tXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3KGN0eDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOnZvaWQge1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgLy8gY3R4LnJvdW5kUmVjdChcclxuICAgICAgICAvLyAgICAgdGhpcy5sZWZ0LFxyXG4gICAgICAgIC8vICAgICB0aGlzLnRvcCxcclxuICAgICAgICAvLyAgICAgdGhpcy5fc2l6ZS54LFxyXG4gICAgICAgIC8vICAgICB0aGlzLl9zaXplLnksXHJcbiAgICAgICAgLy8gICAgIHRoaXMubWluU2l6ZSAvIDVcclxuICAgICAgICAvLyApO1xyXG4gICAgICAgIGN0eC5lbGxpcHNlKFxyXG4gICAgICAgICAgICB0aGlzLl9wb3NpdGlvbi54LFxyXG4gICAgICAgICAgICB0aGlzLl9wb3NpdGlvbi55LFxyXG4gICAgICAgICAgICB0aGlzLl9zaXplLngvMixcclxuICAgICAgICAgICAgdGhpcy5fc2l6ZS55LzIsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDAsIDIqTWF0aC5QSVxyXG4gICAgICAgIClcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFNwcmluZyB7XHJcbiAgICBwcm90ZWN0ZWQgbGVuZ3RoOm51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgcmVsYXRpdmVQb3M6VmVjdG9yMiA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICBwcm90ZWN0ZWQgZWxhc3RpY0ZvcmNlOlZlY3RvcjIgPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgcHJvdGVjdGVkIGRhbXBpbmdGb3JjZTpWZWN0b3IyID0gbmV3IFZlY3RvcjIoKTtcclxuICAgIHByb3RlY3RlZCBmb3JjZTpWZWN0b3IyID0gbmV3IFZlY3RvcjIoKTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgZGVmYXVsdFdpZHRoID0gMTA7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIG1hc3MxOk1hc3MsIHB1YmxpYyBtYXNzMjpNYXNzLCBwcm90ZWN0ZWQgbmF0dXJhbExlbmd0aCA9IDIwMCwgcHJvdGVjdGVkIHN0aWZmbmVzczpudW1iZXIgPSAxZS00LCBwcm90ZWN0ZWQgZGFtcGluZzpudW1iZXIgPSAxZS0zKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Rm9yY2UoZGF0dW1NYXNzOk1hc3MpOlZlY3RvcjIge1xyXG4gICAgICAgIGlmIChkYXR1bU1hc3MgPT09IHRoaXMubWFzczIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZm9yY2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZm9yY2UudGltZXMoLTEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZWxhdGl2ZVBvcyA9IHRoaXMubWFzczEucG9zaXRpb24ubWludXModGhpcy5tYXNzMi5wb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLnJlbGF0aXZlUG9zLmxlbmd0aCgpO1xyXG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSB0aGlzLnJlbGF0aXZlUG9zLm5vcm1hbGl6ZWQoKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBFbGFzdGljc1xyXG4gICAgICAgIHRoaXMuZWxhc3RpY0ZvcmNlID0gZGlyZWN0aW9uLnRpbWVzKCh0aGlzLmxlbmd0aCAtIHRoaXMubmF0dXJhbExlbmd0aCkgKiB0aGlzLnN0aWZmbmVzcylcclxuXHJcbiAgICAgICAgLy8gRGFtcGluZ1xyXG4gICAgICAgIGxldCByZWxhdGl2ZVNwZWVkOm51bWJlciA9IHRoaXMubWFzczEudmVsb2NpdHkubWludXModGhpcy5tYXNzMi52ZWxvY2l0eSkuZG90KGRpcmVjdGlvbik7XHJcbiAgICAgICAgdGhpcy5kYW1waW5nRm9yY2UgPSBkaXJlY3Rpb24udGltZXMocmVsYXRpdmVTcGVlZCAqIHRoaXMuZGFtcGluZylcclxuXHJcbiAgICAgICAgLy8gVG90YWwgZm9yY2VcclxuICAgICAgICB0aGlzLmZvcmNlID0gdGhpcy5lbGFzdGljRm9yY2UucGx1cyh0aGlzLmRhbXBpbmdGb3JjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXcoY3R4OkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6dm9pZCB7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG5cclxuICAgICAgICBjdHgubW92ZVRvKHRoaXMubWFzczEucG9zaXRpb24ueCwgdGhpcy5tYXNzMS5wb3NpdGlvbi55KTtcclxuICAgICAgICBjdHgubGluZVRvKHRoaXMubWFzczIucG9zaXRpb24ueCwgdGhpcy5tYXNzMi5wb3NpdGlvbi55KTtcclxuXHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IE1hdGgubWluKHRoaXMuZGVmYXVsdFdpZHRoICogdGhpcy5uYXR1cmFsTGVuZ3RoIC8gdGhpcy5sZW5ndGgsIHRoaXMubWFzczEubWluU2l6ZSwgdGhpcy5tYXNzMi5taW5TaXplKTtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnZ3JheSc7XHJcblxyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvbnRhY3RTcHJpbmcgZXh0ZW5kcyBTcHJpbmcge1xyXG4gICAgcHJpdmF0ZSBoZXJ0ekV4cG9uZW50Om51bWJlciA9IDI7XHJcbiAgICBwcml2YXRlIHBlbmFsdHlFeHBvbmVudDpudW1iZXIgPSAuNTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWFzczE6TWFzcywgcHVibGljIG1hc3MyOk1hc3MsIHByb3RlY3RlZCBuYXR1cmFsTGVuZ3RoOm51bWJlciwgcHJvdGVjdGVkIHN0aWZmbmVzczpudW1iZXIgPSAxZS01LCBwcm90ZWN0ZWQgZGFtcGluZzpudW1iZXIgPSAxZS0yKSB7XHJcbiAgICAgICAgc3VwZXIobWFzczIsIG1hc3MxLCBuYXR1cmFsTGVuZ3RoLCBzdGlmZm5lc3MsIGRhbXBpbmcpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSgpOnZvaWQge1xyXG4gICAgICAgIHRoaXMucmVsYXRpdmVQb3MgPSB0aGlzLm1hc3MxLnBvc2l0aW9uLm1pbnVzKHRoaXMubWFzczIucG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy5yZWxhdGl2ZVBvcy5sZW5ndGgoKTtcclxuICAgICAgICBsZXQgZGlyZWN0aW9uID0gdGhpcy5yZWxhdGl2ZVBvcy5ub3JtYWxpemVkKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA8IHRoaXMubmF0dXJhbExlbmd0aCkge1xyXG4gICAgICAgICAgICAvLyBFbGFzdGljc1xyXG4gICAgICAgICAgICBjb25zdCBob29rZSA9IE1hdGgucG93KHRoaXMubmF0dXJhbExlbmd0aCAtIHRoaXMubGVuZ3RoLCB0aGlzLmhlcnR6RXhwb25lbnQpICogdGhpcy5zdGlmZm5lc3M7XHJcbiAgICAgICAgICAgIGNvbnN0IHBlbmFsdHkgPSAxICsgMSAvIE1hdGgucG93KHRoaXMubGVuZ3RoLCB0aGlzLnBlbmFsdHlFeHBvbmVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxhc3RpY0ZvcmNlID0gZGlyZWN0aW9uLnRpbWVzKGhvb2tlICogcGVuYWx0eSkudGltZXMoLTEpO1xyXG5cclxuICAgICAgICAgICAgLy8gRGFtcGluZ1xyXG4gICAgICAgICAgICBsZXQgcmVsYXRpdmVTcGVlZDpudW1iZXIgPSB0aGlzLm1hc3MxLnZlbG9jaXR5Lm1pbnVzKHRoaXMubWFzczIudmVsb2NpdHkpLmRvdChkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmRhbXBpbmdGb3JjZSA9IGRpcmVjdGlvbi50aW1lcyhyZWxhdGl2ZVNwZWVkICogdGhpcy5kYW1waW5nKVxyXG5cclxuICAgICAgICAgICAgLy8gVG90YWwgZm9yY2VcclxuICAgICAgICAgICAgdGhpcy5mb3JjZSA9IHRoaXMuZWxhc3RpY0ZvcmNlLnBsdXModGhpcy5kYW1waW5nRm9yY2UpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9yY2UgPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IERlbW9UeXBlLCBWZWN0b3IyIH0gZnJvbSBcIi4vdXRpbGl0aWVzXCI7XHJcbmltcG9ydCB7IE1hc3MsIFNwcmluZywgQ29udGFjdFNwcmluZyB9IGZyb20gXCIuL2VudGl0aWVzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZSB7XHJcbiAgICBwcml2YXRlIGN0eDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICBwcml2YXRlIG1vdXNlUG9zaXRpb24gPSBuZXcgVmVjdG9yMigpO1xyXG5cclxuICAgIHByaXZhdGUgbGFzdFRpbWU6bnVtYmVyOyAvLyBtaWxsaXNlY29uZHNcclxuICAgIHByaXZhdGUgZGVsdGFUaW1lOm51bWJlcjsgLy8gbWlsbGlzZWNvbmRzXHJcbiAgICBwcml2YXRlIG1heERlbHRhVGltZTpudW1iZXIgPSA1MDsgLy9taWxsaXNlY29uZHNcclxuICAgIHByaXZhdGUgbWFzc2VzOk1hc3NbXTtcclxuICAgIHByaXZhdGUgc3ByaW5nczpTcHJpbmdbXTtcclxuICAgIHByaXZhdGUgZW50aXR5U3ByaW5nczpTcHJpbmdbXTtcclxuXHJcbiAgICBwcml2YXRlIGdyYXZpdHk6bnVtYmVyID0gNWUtNDsgLy8gcGl4ZWxzL21zZWMvbXNlY1xyXG4gICAgcHJpdmF0ZSBtYXhGb3JjZTpudW1iZXIgPSAxZS0xO1xyXG4gICAgcHJpdmF0ZSBtYXhTcGVlZDpudW1iZXIgPSAxZTQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjYW52YXM6SFRNTENhbnZhc0VsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLmN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIikgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cclxuICAgICAgICB0aGlzLmxhc3RUaW1lID0gMDtcclxuICAgICAgICB0aGlzLmRlbHRhVGltZSA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMubWFzc2VzID0gW107XHJcbiAgICAgICAgdGhpcy5zcHJpbmdzID0gW107XHJcbiAgICAgICAgdGhpcy5lbnRpdHlTcHJpbmdzID0gW107XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBhZGRNYXNzKG1hc3M6TWFzcyk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5tYXNzZXMuZm9yRWFjaChleGlzdGluZ01hc3MgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbmV3U3ByaW5nID0gbmV3IENvbnRhY3RTcHJpbmcoZXhpc3RpbmdNYXNzLCBtYXNzLCBleGlzdGluZ01hc3MubWF4U2l6ZS8yICsgbWFzcy5tYXhTaXplLzIpO1xyXG4gICAgICAgICAgICB0aGlzLmVudGl0eVNwcmluZ3MucHVzaChuZXdTcHJpbmcpO1xyXG4gICAgICAgICAgICBleGlzdGluZ01hc3MuYWRkRW50aXR5U3ByaW5nKG5ld1NwcmluZyk7XHJcbiAgICAgICAgICAgIG1hc3MuYWRkRW50aXR5U3ByaW5nKG5ld1NwcmluZylcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm1hc3Nlcy5wdXNoKG1hc3MpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZFNwcmluZyhzcHJpbmc6U3ByaW5nKTp2b2lkIHtcclxuICAgICAgICB0aGlzLnNwcmluZ3MucHVzaChzcHJpbmcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNwcmluZy5tYXNzMS5hZGRTcHJpbmcoc3ByaW5nKTtcclxuICAgICAgICBzcHJpbmcubWFzczIuYWRkU3ByaW5nKHNwcmluZyk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBtb3VzZURvd24oZXZ0Ok1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KTp2b2lkIHtcclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTsgIC8vIFByZXZlbnRzIG1vdXNlIGVtdWxhdGlvbiBvbiB0b3VjaCBldmVudHNcclxuICAgICAgICBpZiAoZXZ0IGluc3RhbmNlb2YgTW91c2VFdmVudCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlUG9zaXRpb24ueCA9IGV2dC5jbGllbnRYO1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlUG9zaXRpb24ueSA9IGV2dC5jbGllbnRZO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXZ0IGluc3RhbmNlb2YgVG91Y2hFdmVudCkge1xyXG4gICAgICAgICAgICBjb25zdCB0b3VjaCA9IGV2dC50b3VjaGVzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlUG9zaXRpb24ueCA9IHRvdWNoLmNsaWVudFg7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VQb3NpdGlvbi55ID0gdG91Y2guY2xpZW50WTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFdvcmsgb3V0IHdoZXRoZXIgdGhlIG1vdXNlIGNsaWNrIHdhcyB3aXRoaW4gYW55IG9mIHRoZSBtYXNzZXNcclxuICAgICAgICBsZXQgbWFzc2VzVW5kZXJNb3VzZTpNYXNzW10gPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXNzZXMuZm9yRWFjaChtYXNzID0+IHtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgbWFzcy5wb3NpdGlvbi54IC0gbWFzcy5zaXplLnggPD0gdGhpcy5tb3VzZVBvc2l0aW9uLnggJiZcclxuICAgICAgICAgICAgICAgIG1hc3MucG9zaXRpb24ueCArIG1hc3Muc2l6ZS54ID49IHRoaXMubW91c2VQb3NpdGlvbi54ICYmXHJcbiAgICAgICAgICAgICAgICBtYXNzLnBvc2l0aW9uLnkgLSBtYXNzLnNpemUueSA8PSB0aGlzLm1vdXNlUG9zaXRpb24ueSAmJlxyXG4gICAgICAgICAgICAgICAgbWFzcy5wb3NpdGlvbi55ICsgbWFzcy5zaXplLnkgPj0gdGhpcy5tb3VzZVBvc2l0aW9uLnkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFzc2VzVW5kZXJNb3VzZS5wdXNoKG1hc3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgLy8gU2VsZWN0IG1hc3MgY2xvc2VzdCB0byBtb3VzZVxyXG4gICAgICAgIGlmIChtYXNzZXNVbmRlck1vdXNlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGNsb3Nlc3RNYXNzOk1hc3MgPSBtYXNzZXNVbmRlck1vdXNlWzBdO1xyXG4gICAgICAgICAgICBsZXQgY2xvc2VzdE1hc3NEaXN0YW5jZTpudW1iZXIgPSBJbmZpbml0eTtcclxuXHJcbiAgICAgICAgICAgIG1hc3Nlc1VuZGVyTW91c2UuZm9yRWFjaChtYXNzID0+e1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubW91c2VQb3NpdGlvbi5taW51cyhtYXNzLnBvc2l0aW9uKS5sZW5ndGgoKSA8IGNsb3Nlc3RNYXNzRGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbG9zZXN0TWFzcyA9IG1hc3M7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VzdE1hc3NEaXN0YW5jZSA9IHRoaXMubW91c2VQb3NpdGlvbi5taW51cyhtYXNzLnBvc2l0aW9uKS5sZW5ndGgoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjbG9zZXN0TWFzcy5pc0JlaW5nRHJhZ2dlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGNsb3Nlc3RNYXNzLnJlbGF0aXZlTW91c2VQb3NpdGlvbiA9IHRoaXMubW91c2VQb3NpdGlvbi5taW51cyhjbG9zZXN0TWFzcy5wb3NpdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIG1vdXNlTW92ZShldnQ6TW91c2VFdmVudCB8IFRvdWNoRXZlbnQpOnZvaWQge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpOyAgLy8gUHJldmVudHMgbW91c2UgZW11bGF0aW9uIG9uIHRvdWNoIGV2ZW50c1xyXG4gICAgICAgIGlmIChldnQgaW5zdGFuY2VvZiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VQb3NpdGlvbi54ID0gZXZ0LmNsaWVudFg7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VQb3NpdGlvbi55ID0gZXZ0LmNsaWVudFk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChldnQgaW5zdGFuY2VvZiBUb3VjaEV2ZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvdWNoID0gZXZ0LnRvdWNoZXNbMF07XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VQb3NpdGlvbi54ID0gdG91Y2guY2xpZW50WDtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZVBvc2l0aW9uLnkgPSB0b3VjaC5jbGllbnRZO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBtb3VzZVVwKGV2dDpNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5tYXNzZXMuZm9yRWFjaChtYXNzID0+IG1hc3MuaXNCZWluZ0RyYWdnZWQgPSBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBjcmVhdGVEZW1vKHR5cGU6RGVtb1R5cGUpOnZvaWQge1xyXG4gICAgICAgIGlmICh0eXBlID09PSBEZW1vVHlwZS5UcmlhbmdsZSkge1xyXG4gICAgICAgICAgICBsZXQgbWFzczEgPSBuZXcgTWFzcyhuZXcgVmVjdG9yMigxNSwgMzApKTtcclxuICAgICAgICAgICAgbGV0IG1hc3MyID0gbmV3IE1hc3MobmV3IFZlY3RvcjIoMzAsIDMwMCkpO1xyXG4gICAgICAgICAgICBsZXQgbWFzczMgPSBuZXcgTWFzcyhuZXcgVmVjdG9yMigzMDAsIDMwKSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkTWFzcyhtYXNzMSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkTWFzcyhtYXNzMik7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkTWFzcyhtYXNzMyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3ByaW5nMSA9IG5ldyBTcHJpbmcobWFzczEsIG1hc3MyKTtcclxuICAgICAgICAgICAgbGV0IHNwcmluZzIgPSBuZXcgU3ByaW5nKG1hc3MyLCBtYXNzMyk7XHJcbiAgICAgICAgICAgIGxldCBzcHJpbmczID0gbmV3IFNwcmluZyhtYXNzMSwgbWFzczMpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFNwcmluZyhzcHJpbmcxKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRTcHJpbmcoc3ByaW5nMik7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkU3ByaW5nKHNwcmluZzMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGUgPT09IERlbW9UeXBlLlBhcmFsbGVsb2dyYW0pIHtcclxuICAgICAgICAgICAgbGV0IG1hc3MxID0gbmV3IE1hc3MobmV3IFZlY3RvcjIoMzAsIDMwKSk7XHJcbiAgICAgICAgICAgIGxldCBtYXNzMiA9IG5ldyBNYXNzKG5ldyBWZWN0b3IyKDMwLCAzMDApKTtcclxuICAgICAgICAgICAgbGV0IG1hc3MzID0gbmV3IE1hc3MobmV3IFZlY3RvcjIoMzAwLCAzMCkpO1xyXG4gICAgICAgICAgICBsZXQgbWFzczQgPSBuZXcgTWFzcyhuZXcgVmVjdG9yMigzMDAsIDMwMCkpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZE1hc3MobWFzczEpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZE1hc3MobWFzczIpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZE1hc3MobWFzczMpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZE1hc3MobWFzczQpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNwcmluZzEgPSBuZXcgU3ByaW5nKG1hc3MxLCBtYXNzMik7XHJcbiAgICAgICAgICAgIGxldCBzcHJpbmcyID0gbmV3IFNwcmluZyhtYXNzMiwgbWFzczMpO1xyXG4gICAgICAgICAgICBsZXQgc3ByaW5nMyA9IG5ldyBTcHJpbmcobWFzczEsIG1hc3MzKTtcclxuICAgICAgICAgICAgbGV0IHNwcmluZzQgPSBuZXcgU3ByaW5nKG1hc3MzLCBtYXNzNCk7XHJcbiAgICAgICAgICAgIGxldCBzcHJpbmc1ID0gbmV3IFNwcmluZyhtYXNzMiwgbWFzczQpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFNwcmluZyhzcHJpbmcxKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRTcHJpbmcoc3ByaW5nMik7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkU3ByaW5nKHNwcmluZzMpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFNwcmluZyhzcHJpbmc0KTtcclxuICAgICAgICAgICAgdGhpcy5hZGRTcHJpbmcoc3ByaW5nNSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZSA9PT0gRGVtb1R5cGUuU3F1YXJlKSB7XHJcbiAgICAgICAgICAgIGxldCBtYXNzMSA9IG5ldyBNYXNzKG5ldyBWZWN0b3IyKDMwLCAzMCkpO1xyXG4gICAgICAgICAgICBsZXQgbWFzczIgPSBuZXcgTWFzcyhuZXcgVmVjdG9yMigzMCwgMzAwKSk7XHJcbiAgICAgICAgICAgIGxldCBtYXNzMyA9IG5ldyBNYXNzKG5ldyBWZWN0b3IyKDMwMCwgMzApKTtcclxuICAgICAgICAgICAgbGV0IG1hc3M0ID0gbmV3IE1hc3MobmV3IFZlY3RvcjIoMzAwLCAzMDApKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRNYXNzKG1hc3MxKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRNYXNzKG1hc3MyKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRNYXNzKG1hc3MzKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRNYXNzKG1hc3M0KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzcHJpbmcxID0gbmV3IFNwcmluZyhtYXNzMSwgbWFzczIpO1xyXG4gICAgICAgICAgICBsZXQgc3ByaW5nMiA9IG5ldyBTcHJpbmcobWFzczEsIG1hc3M0LCAyMDAqTWF0aC5zcXJ0KDIpKTtcclxuICAgICAgICAgICAgbGV0IHNwcmluZzMgPSBuZXcgU3ByaW5nKG1hc3MyLCBtYXNzNCk7XHJcbiAgICAgICAgICAgIGxldCBzcHJpbmc0ID0gbmV3IFNwcmluZyhtYXNzMywgbWFzczQpO1xyXG4gICAgICAgICAgICBsZXQgc3ByaW5nNSA9IG5ldyBTcHJpbmcobWFzczEsIG1hc3MzKTtcclxuICAgICAgICAgICAgbGV0IHNwcmluZzYgPSBuZXcgU3ByaW5nKG1hc3MyLCBtYXNzMywgMjAwKk1hdGguc3FydCgyKSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkU3ByaW5nKHNwcmluZzEpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFNwcmluZyhzcHJpbmcyKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRTcHJpbmcoc3ByaW5nMyk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkU3ByaW5nKHNwcmluZzQpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFNwcmluZyhzcHJpbmc1KTtcclxuICAgICAgICAgICAgdGhpcy5hZGRTcHJpbmcoc3ByaW5nNik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZSA9PT0gRGVtb1R5cGUuQ2VudGVyZWRTcXVhcmUpIHtcclxuICAgICAgICAgICAgbGV0IG1hc3MxID0gbmV3IE1hc3MobmV3IFZlY3RvcjIoMzAsIDMwKSk7XHJcbiAgICAgICAgICAgIGxldCBtYXNzMiA9IG5ldyBNYXNzKG5ldyBWZWN0b3IyKDMwLCAzMDApKTtcclxuICAgICAgICAgICAgbGV0IG1hc3MzID0gbmV3IE1hc3MobmV3IFZlY3RvcjIoMzAwLCAzMCkpO1xyXG4gICAgICAgICAgICBsZXQgbWFzczQgPSBuZXcgTWFzcyhuZXcgVmVjdG9yMigzMDAsIDMwMCkpO1xyXG4gICAgICAgICAgICBsZXQgbWFzczUgPSBuZXcgTWFzcyhuZXcgVmVjdG9yMigxNTAsIDE1MCkpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZE1hc3MobWFzczEpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZE1hc3MobWFzczIpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZE1hc3MobWFzczMpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZE1hc3MobWFzczQpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZE1hc3MobWFzczUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNwcmluZzEgPSBuZXcgU3ByaW5nKG1hc3MxLCBtYXNzMik7XHJcbiAgICAgICAgICAgIGxldCBzcHJpbmcyID0gbmV3IFNwcmluZyhtYXNzMSwgbWFzczMpO1xyXG4gICAgICAgICAgICBsZXQgc3ByaW5nMyA9IG5ldyBTcHJpbmcobWFzczIsIG1hc3M0KTtcclxuICAgICAgICAgICAgbGV0IHNwcmluZzQgPSBuZXcgU3ByaW5nKG1hc3MzLCBtYXNzNCk7XHJcbiAgICAgICAgICAgIGxldCBzcHJpbmc1ID0gbmV3IFNwcmluZyhtYXNzMSwgbWFzczUsIDEwMCpNYXRoLnNxcnQoMikpO1xyXG4gICAgICAgICAgICBsZXQgc3ByaW5nNiA9IG5ldyBTcHJpbmcobWFzczIsIG1hc3M1LCAxMDAqTWF0aC5zcXJ0KDIpKTtcclxuICAgICAgICAgICAgbGV0IHNwcmluZzcgPSBuZXcgU3ByaW5nKG1hc3MzLCBtYXNzNSwgMTAwKk1hdGguc3FydCgyKSk7XHJcbiAgICAgICAgICAgIGxldCBzcHJpbmc4ID0gbmV3IFNwcmluZyhtYXNzNCwgbWFzczUsIDEwMCpNYXRoLnNxcnQoMikpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFNwcmluZyhzcHJpbmcxKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRTcHJpbmcoc3ByaW5nMik7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkU3ByaW5nKHNwcmluZzMpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFNwcmluZyhzcHJpbmc0KTtcclxuICAgICAgICAgICAgdGhpcy5hZGRTcHJpbmcoc3ByaW5nNSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkU3ByaW5nKHNwcmluZzYpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFNwcmluZyhzcHJpbmc3KTtcclxuICAgICAgICAgICAgdGhpcy5hZGRTcHJpbmcoc3ByaW5nOCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZSA9PT0gRGVtb1R5cGUuSGV4YWdvbikge1xyXG4gICAgICAgICAgICBsZXQgY2VudGVyTWFzcyA9IG5ldyBNYXNzKG5ldyBWZWN0b3IyKDMwMCwgMzAwKSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkTWFzcyhjZW50ZXJNYXNzKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBlZGdlTWFzc2VzOk1hc3NbXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3TWFzcyA9IG5ldyBNYXNzKG5ldyBWZWN0b3IyKDE4MCArIDE1MCpNYXRoLmNvcyhpKk1hdGguUEkvMyksIDE4MCArIDE1MCpNYXRoLnNpbihpKk1hdGguUEkvMykpKTtcclxuICAgICAgICAgICAgICAgIGVkZ2VNYXNzZXMucHVzaChuZXdNYXNzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkTWFzcyhuZXdNYXNzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkU3ByaW5nKG5ldyBTcHJpbmcoZWRnZU1hc3Nlc1tpXSwgZWRnZU1hc3Nlc1soaSsxKSAlIDZdKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFNwcmluZyhuZXcgU3ByaW5nKGVkZ2VNYXNzZXNbaV0sIGNlbnRlck1hc3MpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKTp2b2lkIHtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5tYWluTG9vcC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgbWFpbkxvb3AoY3VycmVudFRpbWU6bnVtYmVyKTp2b2lkIHtcclxuICAgICAgICB0aGlzLmRlbHRhVGltZSA9IE1hdGgubWluKGN1cnJlbnRUaW1lIC0gdGhpcy5sYXN0VGltZSwgdGhpcy5tYXhEZWx0YVRpbWUpO1xyXG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSBjdXJyZW50VGltZTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGUodGhpcy5kZWx0YVRpbWUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZHJhdygpO1xyXG5cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5tYWluTG9vcC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdXBkYXRlKGRlbHRhVGltZTpudW1iZXIpOnZvaWQge1xyXG4gICAgICAgIHRoaXMubWFzc2VzLmZvckVhY2goKG1hc3MpID0+IG1hc3MudXBkYXRlKHRoaXMuY2FudmFzLCBkZWx0YVRpbWUsIHRoaXMubW91c2VQb3NpdGlvbiwgdGhpcy5tYXNzZXMsIHRoaXMuZ3Jhdml0eSwgdGhpcy5tYXhGb3JjZSwgdGhpcy5tYXhTcGVlZCkpO1xyXG4gICAgICAgIHRoaXMuc3ByaW5ncy5mb3JFYWNoKChzcHJpbmcpID0+IHNwcmluZy51cGRhdGUoKSk7XHJcbiAgICAgICAgdGhpcy5lbnRpdHlTcHJpbmdzLmZvckVhY2goKHNwcmluZykgPT4gc3ByaW5nLnVwZGF0ZSgpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZHJhdygpOnZvaWQge1xyXG4gICAgICAgIC8vIENsZWFyIHNjcmVlblxyXG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdGhpcy5zcHJpbmdzLmZvckVhY2goKHN0cmluZykgPT4gc3RyaW5nLmRyYXcodGhpcy5jdHgpKTtcclxuICAgICAgICB0aGlzLm1hc3Nlcy5mb3JFYWNoKChtYXNzKSA9PiBtYXNzLmRyYXcodGhpcy5jdHgpKTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgZW51bSBEZW1vVHlwZSB7XHJcbiAgICBUcmlhbmdsZSxcclxuICAgIFBhcmFsbGVsb2dyYW0sXHJcbiAgICBTcXVhcmUsXHJcbiAgICBDZW50ZXJlZFNxdWFyZSxcclxuICAgIEhleGFnb25cclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBWZWN0b3IyIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB4Om51bWJlciA9IDAsIHB1YmxpYyB5Om51bWJlciA9IDApIHt9O1xyXG5cclxuICAgIHB1YmxpYyBhZGQodmVjdG9yOlZlY3RvcjIpOnZvaWQge1xyXG4gICAgICAgIC8vIEFkZCBhbm90aGVyIFZlY3RvcjIgdG8gdGhpcyBWZWN0b3IyXHJcbiAgICAgICAgdGhpcy54ICs9IHZlY3Rvci54O1xyXG4gICAgICAgIHRoaXMueSArPSB2ZWN0b3IueTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHN1YnRyYWN0KHZlY3RvcjpWZWN0b3IyKTp2b2lkIHtcclxuICAgICAgICAvLyBTdWJ0cmFjdCBhbm90aGVyIFZlY3RvcjIgZnJvbSB0aGlzIFZlY3RvcjJcclxuICAgICAgICB0aGlzLnggLT0gdmVjdG9yLng7XHJcbiAgICAgICAgdGhpcy55IC09IHZlY3Rvci55O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseUJ5KHNjYWxhcjpudW1iZXIpOnZvaWQge1xyXG4gICAgICAgIC8vIFN1bSB0aGlzIFZlY3RvcjIgd2l0aCB0aGUgbmVnYXRpdmUgb2YgYW5vdGhlciBhbmQgcmV0dXJuIGEgbmV3IFZlY3RvcjIgb2YgdGhlIHJlc3VsdFxyXG4gICAgICAgIHRoaXMueCAqPSBzY2FsYXJcclxuICAgICAgICB0aGlzLnkgKj0gc2NhbGFyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBub3JtYWxpemUoKTp2b2lkIHtcclxuICAgICAgICB0aGlzLm11bHRpcGx5QnkoMS90aGlzLmxlbmd0aCgpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGx1cyh2ZWN0b3I6VmVjdG9yMik6VmVjdG9yMiB7XHJcbiAgICAgICAgLy8gU3VtIHRoaXMgVmVjdG9yMiB3aXRoIGFub3RoZXIgYW5kIHJldHVybiBhIG5ldyBWZWN0b3IyIG9mIHRoZSByZXN1bHRcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54ICsgdmVjdG9yLngsIHRoaXMueSArIHZlY3Rvci55KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIG1pbnVzKHZlY3RvcjpWZWN0b3IyKTpWZWN0b3IyIHtcclxuICAgICAgICAvLyBTdW0gdGhpcyBWZWN0b3IyIHdpdGggdGhlIG5lZ2F0aXZlIG9mIGFub3RoZXIgYW5kIHJldHVybiBhIG5ldyBWZWN0b3IyIG9mIHRoZSByZXN1bHRcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54IC0gdmVjdG9yLngsIHRoaXMueSAtIHZlY3Rvci55KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdGltZXMoc2NhbGFyOm51bWJlcik6VmVjdG9yMiB7XHJcbiAgICAgICAgLy8gU3VtIHRoaXMgVmVjdG9yMiB3aXRoIHRoZSBuZWdhdGl2ZSBvZiBhbm90aGVyIGFuZCByZXR1cm4gYSBuZXcgVmVjdG9yMiBvZiB0aGUgcmVzdWx0XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCAqIHNjYWxhciwgdGhpcy55ICogc2NhbGFyKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbGVuZ3RoKCk6bnVtYmVyIHtcclxuICAgICAgICAvLyBHZXQgbGVuZ3RoIG9mIHRoZSB2ZWN0b3JcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMueCwgMikgKyBNYXRoLnBvdyh0aGlzLnksIDIpKVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBub3JtYWxpemVkKCk6VmVjdG9yMiB7XHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoKCkgPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50aW1lcygxL3RoaXMubGVuZ3RoKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZG90KHZlY3RvcjpWZWN0b3IyKTpudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiB2ZWN0b3IueCArIHRoaXMueSAqIHZlY3Rvci55O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGFtcChtYWduaXR1ZGU6bnVtYmVyKTp2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5sZW5ndGgoKSA+IG1hZ25pdHVkZSkge1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbGl6ZSgpXHJcbiAgICAgICAgICAgIHRoaXMubXVsdGlwbHlCeShtYWduaXR1ZGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29weSgpOlZlY3RvcjIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLngsIHRoaXMueSk7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBEZW1vVHlwZSB9IGZyb20gXCIuL3V0aWxpdGllc1wiO1xyXG5pbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4vZ2FtZVwiO1xyXG5cclxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcblxyXG5mdW5jdGlvbiByZXNpemVDYW52YXMoKTogdm9pZCB7XHJcbiAgICBjYW52YXMud2lkdGggID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICBjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplQ2FudmFzKVxyXG5yZXNpemVDYW52YXMoKVxyXG5cclxuXHJcbmNvbnN0IGdhbWUgPSBuZXcgR2FtZShjYW52YXMpO1xyXG5cclxuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZ2FtZS5tb3VzZURvd24uYmluZChnYW1lKSk7XHJcbmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGdhbWUubW91c2VNb3ZlLmJpbmQoZ2FtZSkpO1xyXG5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZ2FtZS5tb3VzZVVwLmJpbmQoZ2FtZSkpO1xyXG5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgZ2FtZS5tb3VzZURvd24uYmluZChnYW1lKSwge3Bhc3NpdmU6IGZhbHNlfSk7XHJcbmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIGdhbWUubW91c2VNb3ZlLmJpbmQoZ2FtZSksIHtwYXNzaXZlOiBmYWxzZX0pO1xyXG5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGdhbWUubW91c2VVcC5iaW5kKGdhbWUpLCB7cGFzc2l2ZTogZmFsc2V9KTtcclxuXHJcbmNvbnN0IHJhbmRFbnVtID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogT2JqZWN0LmtleXMoRGVtb1R5cGUpLmxlbmd0aCAvIDIpXHJcbmdhbWUuY3JlYXRlRGVtbyhyYW5kRW51bSk7XHJcbi8vIGdhbWUuY3JlYXRlRGVtbyhEZW1vVHlwZS5IZXhhZ29uKTtcclxuXHJcbmdhbWUuc3RhcnQoKTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9