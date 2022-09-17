// module aliases
    var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    World = Matter.World,
    Composites = Matter.Composites,
    Common = Matter.Common,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Events = Matter.Events,
    Body = Matter.Body,
    Bodies = Matter.Bodies;
// create an engine
var engine = Engine.create();
var world = engine.world;

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        pixelRatio: 1,
        background: '#fafafa',
        wireframeBackground: '#222',
        hasBounds: false,
        enabled: true,
        wireframes: false,
        showSleeping: true,
        showDebug: false,
        showBroadphase: false,
        showBounds: false,
        showVelocity: false,
        showCollisions: false,
        showSeparations: false,
        showAxes: false,
        showPositions: false,
        showAngleIndicator: false,
        showIds: false,
        showShadows: false,
        showVertexNumbers: false,
        showConvexHulls: false,
        showInternalEdges: false,
        showMousePosition: false
    }
});
if (Constraint.length === 0 && Constraint.stiffness >= 0) {
    render.type = 'pin';
    render.anchors = false;
}

// create objects
var objects = [];
var arm_1 = Bodies.rectangle(400, 300, 250, 10);
arm_1.collisionFilter = {
    'group': -1,
    'category': 2,
    'mask': 0,
  };
var arm_2 = Bodies.rectangle(400, 300, 250, 10);
arm_2.collisionFilter = {
    'group': -1,
    'category': 2,
    'mask': 0,
  };
var Base = Bodies.rectangle(400, 300, 250, 10, { isStatic: true });
Base.collisionFilter = {
    'group': 1,
    'category': 2,
    'mask': 0,
  };
var Top = Bodies.rectangle(400, 250, 250, 10);
Top.collisionFilter = {
    'group': 1,
    'category': 2,
    'mask': 0,
  };
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
ground.collisionFilter = {
    'group': 1,
    'category': 2,
    'mask': 0,
  };
var slider_1 = Bodies.rectangle(525, 300, 1, 1, { isStatic: true })
slider_1.collisionFilter = {
    'group': -1,
    'category': 2,
    'mask': 0,
};
objects.push(Base, Top, ground, arm_1, arm_2, slider_1);

//Constraints

var cons_1 = {
    bodyA: Base,
    bodyB: arm_1,
    pointA: {x: -125, y: 0},
    pointB: {x: -125, y: 0},
    length: 0,
    stiffness: 1,
};
var cons_2 = {
    bodyA: arm_1,
    bodyB: Top,
    pointA: {x: 125, y: 0},
    pointB: {x: 125, y: 0},
    length: 0,
    stiffness: 0.1,
    render: { type: 'line' }
};
var cons_3 = {
    bodyA: arm_2,
    bodyB: slider_1,
    pointA: {x: 125, y: 0},
    pointB: {x: 0, y: 0},
    length: 0,
    stiffness: 1,
};
var cons_4 = {
    bodyA: arm_2,
    bodyB: Top,
    pointA: {x: -125, y: 0},
    pointB: {x: -125, y: 0},
    length: 0,
    stiffness: 1,
};
var cons_5 = {
    bodyA: arm_2,
    bodyB: arm_1,
    pointA: {x: 0, y: 0},
    pointB: {x: 0, y: 0},
    length: 0,
    stiffness: 1,
};
Constraint.create(cons_1);
Constraint.create(cons_2);
Constraint.create(cons_3);
Constraint.create(cons_4);
Constraint.create(cons_5);
// add all of the bodies to the world

function AddOb(i) {
    Composite.add(world, i);
}
objects.forEach(AddOb);

Composite.add(world, [
    // walls
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
]);
World.add(world, [cons_1, cons_2, cons_3, cons_4, cons_5]);
// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });
Composite.add(world, mouseConstraint);
mouseConstraint.collisionFilter = {
    'group': 1,
    'category': 2,
    'mask': 0,
  };
// keep the mouse in sync with rendering
render.mouse = mouse;

// LOG config
function reg(){
    //console.log(boxA.position.x, boxA.position.y, engine.timing.timestamp)
    console.log(amplitude)
    window.requestAnimationFrame(reg)
}
function reg2(){
    console.log(slider_1.position.x)
    window.requestAnimationFrame(reg)
}
//window.requestAnimationFrame(reg)

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

// slider function

var amplitude = -2.00 
var amplitude_disp = amplitude * -1
Events.on(engine, 'afterUpdate', function(event) {
    var time = engine.timing.timestamp;

    Body.translate(slider_1, {
        x: Math.sin(time * 0.001) * amplitude,
        y: 0
    });
});

//down amplitude function

const check_down = function(c){
    if (slider_1.position.x > 525){
        amplitude = amplitude + 0.25
        Events.off(engine,'afterUpdate', check_down)
    }
}

//down button function

document.querySelector("#amp_down").addEventListener('click', function () {
    Events.on(engine, 'afterUpdate', check_down);
    amplitude_disp = amplitude_disp - 0.25
});

//up amplitude function

const check_up = function(c){
    if (slider_1.position.x > 525){
        amplitude = amplitude - 0.25
        Events.off(engine,'afterUpdate', check_up)
    }
}

//Up button function

document.querySelector("#amp_up").addEventListener('click', function () {
    Events.on(engine, 'afterUpdate', check_up);
    amplitude_disp = amplitude_disp + 0.25
});

//Write Data
function write(){
    var height = ((((Top.position.y - 290) * -1)/290)).toFixed(2);
    var amplitude_inst = ((((slider_1.position.x - 260))/260 - 1)* -1).toFixed(2);
    document.getElementById("height").innerHTML = `altura: <br> ${height}`;
    document.getElementById("amplitude_inst").innerHTML = `amplitude instante: <br> ${amplitude_inst}`;
    document.getElementById("amplitude_disp").innerHTML = `amplitude: <br> ${amplitude_disp}`;
}
Events.on(engine, 'afterUpdate', write);