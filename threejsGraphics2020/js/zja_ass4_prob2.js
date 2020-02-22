/***********
 * zja_ass4_prob2.js
 * This produces a number of rings that will be animated around one another.
 * Zachary Anthony
 * February 2020
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();


function createScene() {

    let nbrRings = 16;
    //loop for animating the system.
    var mainLoop = () => {
        requestAnimationFrame(mainLoop)
        renderer.render(scene, camera);
        updater(thing, nbrRings);
    }

    let thing = createSystem(nbrRings);
    scene.add(thing);

    
    //create ligths.
    let sun = new THREE.PointLight(0xffffff, 1, 700);
    sun.position.set(50, 300, 100);
    scene.add(sun);
    let sun2 = new THREE.PointLight(0xffffff, 1, 700);
    sun2.position.set(50, -300, -100);
    scene.add(sun2);
    mainLoop(); //call animation loop.
}


//creates a sphere, and rings around it, then animates them.
function createSystem(nbrRings) {
    let root = new THREE.Object3D();
    let sphereG = new THREE.SphereGeometry(1, 12, 12);
    let c = getRandomColor(0.8, 0.1, 0.8);
    let sphereArgs = { color: c, transparent: false };
    let sphereMat = new THREE.MeshLambertMaterial(sphereArgs);
    let sphereMesh = new THREE.Mesh(sphereG, sphereMat);
    root.add(sphereMesh);

    for (let i = 0; i < nbrRings; ++i) {
        let geom = new THREE.TorusGeometry(2 + i * 2, 1, 16, 100);
        c = getRandomColor(0.8, 0.1, 0.8);
        let args = { color: c, transparent: false };
        let mat = new THREE.MeshLambertMaterial(args);
        let mesh = new THREE.Mesh(geom, mat);
        //set rotation.
        root.add(mesh);
    }

    return root;
}

//variable tracks if the ball is rising or falling
var ballRising = true;

//update positions for animation.
function updater(thing, nbrRings) {
    let delta = clock.getDelta();

    //move ball.
    let ball = thing.children[0];
    if (ballRising) {
        ball.position.z += delta * 40 / 2.5; //the ball rises to 40, then falls down to the hole in one 5 second half cycle of the rings.
        if (ball.position.z >= 40.0)
            ballRising = false; //ball starts falling
    }
    else {
        ball.position.z -= delta * 40 / 2.5;
        if (ball.position.z < -40.0)
            ballRising = true; //ball starts rising.
    }
    //move rings
    let deltaRevRadians = rpsToRadians(0.1, delta);
    for (i = 1; i <= nbrRings; ++i) {
        let ring = thing.children[i];
        if (i % 4 == 0)
            ring.rotation.y += deltaRevRadians;
        else if (i % 4 == 1)
            ring.rotation.x -= deltaRevRadians;
        else if (i % 4 == 2)
            ring.rotation.y -= deltaRevRadians;
        else
            ring.rotation.x += deltaRevRadians;
    }
}

//your function for converting rps to radians.
function rpsToRadians(rps, t) {
    return 2 * Math.PI * rps * t;
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
    camera.position.set(0, 0, 45); //adjusted camera starting point from 30.
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

