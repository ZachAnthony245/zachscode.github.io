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
            beep();
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

function beep() {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
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

