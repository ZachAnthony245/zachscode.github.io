/***********
 * zja_ass4_prob2.js
 * This produces a number of rings that will be animated around one another.
 * Zachary Anthony
 * February 2020
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();


//Object for defining variables
var cannonObject = {
    sideToSide: 0,
    upDown: 45,
    velocity: 100,
    firing: false,
    xVelocity: 0,
    yVelocity: 0,
    zVelocity: 0,

    FIRE: function () {
        this.yVelocity = Math.sin(degreesToRadians(this.upDown)) * this.velocity;
        this.zVelocity = Math.cos(degreesToRadians(this.upDown)) * Math.cos(degreesToRadians(this.sideToSide)) * this.velocity;
        this.xVelocity = Math.cos(degreesToRadians(this.upDown)) * Math.sin(degreesToRadians(this.sideToSide)) * this.velocity;

        this.firing = true;

        createScene();
    }
};

//control for GUI.
const gui = new dat.GUI({ autoPlace: true });
gui.add(cannonObject, 'sideToSide', -90, 90).listen().onChange(function (value) { createScene(); });
gui.add(cannonObject, 'upDown', 0, 90).listen().onChange(function (value) { createScene(); });
gui.add(cannonObject, 'velocity', 5, 500);
gui.add(cannonObject, 'FIRE');



function createScene() {
    //clear objects on update.
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }


    //loop for animating the system.
    var mainLoop = () => {
        requestAnimationFrame(mainLoop)
        renderer.render(scene, camera);
        if (ball.position.y > 0)
            updater(ball);
        else {
            cannonObject.firing = false;
            PlaySound("sound1");
        }
    }

    let floor = createFloor();
    scene.add(floor);

    let cannon = createCannon();
    scene.add(cannon);

    let ballGeom = new THREE.SphereGeometry(1);
    let c = new THREE.Color(1, 1, 1);
    let ballArgs = { color: c, transparent: false };
    let ballMat = new THREE.MeshLambertMaterial(ballArgs);
    let ball = new THREE.Mesh(ballGeom, ballMat);

    ball.position.x = 0;
    ball.position.y = 2;
    ball.position.z = 0;

    scene.add(ball);
    
    //create ligths.
    let sun = new THREE.PointLight(0xffffff, 1, 10000);
    sun.position.set(0, 600, 0);
    scene.add(sun);

    if (cannonObject.firing)
        mainLoop();
}

//Creates floor mesh for scene.
function createFloor() {
    let geom = new THREE.BoxGeometry(5000, .1, 5000);
    let c = new THREE.Color(0, .8, 0);
    let args = { color: c, transparent: false };
    let mat = new THREE.MeshLambertMaterial(args);
    let floor = new THREE.Mesh(geom, mat);
    return floor;
}


function createCannon() {
    let root = new THREE.Object3D();
    let baseGeom = new THREE.CylinderGeometry(5, 5, 2, 32);
    let c = new THREE.Color(0.1, 0.1, 0.1);
    let cannonArgs = { color: c, transparent: false };
    let cannonMat = new THREE.MeshLambertMaterial(cannonArgs);
    let baseMesh = new THREE.Mesh(baseGeom, cannonMat);
    baseMesh.position.x = 0;
    baseMesh.position.y = 1;
    baseMesh.position.z = 0;
    root.add(baseMesh);

    let baseGeom2 = new THREE.SphereGeometry(3);
    let baseMesh2 = new THREE.Mesh(baseGeom2, cannonMat);
    baseMesh2.position.x = 0;
    baseMesh2.position.y = 2;
    baseMesh2.position.z = 0;
    root.add(baseMesh2);

    let barrelGeom = new THREE.CylinderGeometry(1, 1, 5, 32);
    let barrelMesh = new THREE.Mesh(barrelGeom, cannonMat);
    barrelMesh.position.x = 0;
    barrelMesh.position.y = Math.sin(degreesToRadians(cannonObject.upDown)) * 2.5 + 2.5; //bit of trig to get the position right.
    barrelMesh.position.z = Math.cos(degreesToRadians(cannonObject.upDown)) * 2.5;
    barrelMesh.rotation.x = Math.PI / 2; //start on side so the barrel lifts with more degrees.
    barrelMesh.rotation.x -= degreesToRadians(cannonObject.upDown);
    root.add(barrelMesh);
    root.rotation.y = degreesToRadians(cannonObject.sideToSide);

    return root;
}


//update positions for animation.
function updater(ball) {
    let delta = clock.getDelta() * 5; //multiplying by 5 to make it move faster.

    //move ball.
    ball.position.x += delta * cannonObject.xVelocity;
    ball.position.y += delta * cannonObject.yVelocity;
    ball.position.z += delta * cannonObject.zVelocity;

    cannonObject.yVelocity -= delta * 50; //adjust for gravity.
}



function degreesToRadians(degrees) {
    return (degrees / 180) * Math.PI;
}

function animate() {
    window.requestAnimationFrame(animate);
    render();
}

function render() {
    let delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);
}


function init() {
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    let canvasRatio = canvasWidth / canvasHeight;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0x000000, 1.0);

    camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
    camera.position.set(0, 40, -50); //adjusted camera starting point from 30.
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
}


function addToDOM() {
    let container = document.getElementById('container');
    let canvas = container.getElementsByTagName('canvas');
    if (canvas.length > 0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild(renderer.domElement);
}


init();
createScene();
addToDOM();
render();
animate();

