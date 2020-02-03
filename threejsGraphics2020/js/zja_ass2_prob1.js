/***********
 * zja_ass2_prob1.js
 * A function that produces a group of starbursts on an adjustable box.
 * Zachary Anthony
 * January 2020
 ***********/

let camera, scene, renderer;// renderOnDemand = true, renderRequested = false;
let cameraControls;
let clock = new THREE.Clock();

//parameter object 
var starBox = {
    stars: 50,
    depth: 9,
    width: 9,
    height: 9,

};

//code for creating the GUI.
const gui = new dat.GUI({ autoPlace: true });
gui.add(starBox, 'stars', 10, 200).listen().onChange(function (value) { createScene(); });
gui.add(starBox, 'depth', 5, 100).listen().onChange(function (value) { createScene(); });
gui.add(starBox, 'width', 5, 100).listen().onChange(function (value) { createScene(); });
gui.add(starBox, 'height', 5, 100).listen().onChange(function (value) { createScene(); });



//creating the scene with parameters from the GUI.
function createScene() {

    //clear objects on update.
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    //create new objects after gui has been updated.
    let thing = createBox(makeStarburstFnc(), starBox.stars, starBox.depth, starBox.width, starBox.height);
    scene.add(thing);
}


function createBox(fnc, n, depth, width, height) {
    let root = new THREE.Object3D();
    for (let i = 0; i < n; i++) {
        let obj = fnc(5, 1);
        let p = getRandomPointBox(depth, width, height);
        obj.position.set(p.x, p.y, p.z);
        root.add(obj);
    }
    return root;
}

function makeStarburstFnc(maxRays, maxRad) {
    function fnc() {
        return starburst(maxRays, maxRad);
    }
    return fnc;
}

//get random point on the surface of a 3 dimensional box.
function getRandomPointBox(depth, width, height) {
    let r = Math.random() * 6; //determine face.
    if (r < 1) { //top
        let z = depth / 2;
        let x = (Math.random() * width) - (width / 2);
        let y = (Math.random() * height) - (height / 2);
        return new THREE.Vector3(x, y, z);
    }
    else if (r < 2) { //bottom
        let z = -depth / 2;
        let x = (Math.random() * width) - (width / 2);
        let y = (Math.random() * height) - (height / 2);
        return new THREE.Vector3(x, y, z);
    }
    else if (r < 3) { //front
        let z = (Math.random() * depth) - (depth / 2);
        let x = (Math.random() * width) - (width / 2);
        let y = height / 2;
        return new THREE.Vector3(x, y, z);
    }
    else if (r < 4) { //back
        let z = (Math.random() * depth) - (depth / 2);
        let x = (Math.random() * width) - (width / 2);
        let y = -height / 2;
        return new THREE.Vector3(x, y, z);
    }
    else if (r < 5) { //right side
        let z = (Math.random() * depth) - (depth / 2);
        let x = width / 2;
        let y = (Math.random() * height) - (height / 2);
        return new THREE.Vector3(x, y, z);
    }
    else { //left side
        let z = (Math.random() * depth) - (depth / 2);
        let x = -width / 2;
        let y = (Math.random() * height) - (height / 2);
        return new THREE.Vector3(x, y, z);
    }
}



function starburst(maxRays, maxRad) {
    let origin = new THREE.Vector3(0, 0, 0);
    let innerColor = getRandomColor(0.8, 0.1, 0.8);
    let black = new THREE.Color(0x000000);
    let geom = new THREE.Geometry();
    let nbrRays = getRandomInt(1, maxRays);
    if (Math.random() < 0.5) {
        nbrRays = getRandomInt(4, 25);
    }
    for (let i = 0; i < nbrRays; i++) {
        // dest is a point on some origin-centered sphere
        // of radius between 0.1 and maxRad
        let r = getRandomFloat(0.1, maxRad);
        let dest = getRandomPointOnSphere(r);
        geom.vertices.push(origin, dest);
        geom.colors.push(innerColor, black);
    }
    let args = { vertexColors: true, linewidth: 2 };
    let mat = new THREE.LineBasicMaterial(args);
    return new THREE.Line(geom, mat, THREE.LineSegments);
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
    camera.position.set(0, 0, 30);
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

