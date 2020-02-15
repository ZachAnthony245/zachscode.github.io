/***********
 * zja_ass3_prob1.js
 * This produces a sphere of platonic solids with a GUI to adjust them.
 * Zachary Anthony
 * February 2020
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();

//options parameters for the ring.
var sphereObject = {
    nbrSolids: 30,
    opacity: 0.8,
    scale: 1,
    rad: 12,
    type: "Random"
};


//code for the GUI.
const gui = new dat.GUI({ autoPlace: true });
gui.add(sphereObject, 'nbrSolids', 5, 50).listen().onChange(function (value) { createScene(); });
gui.add(sphereObject, 'rad', 4, 30).listen().onChange(function (value) { createScene(); });
gui.add(sphereObject, 'opacity', 0.2, 1.0).listen().onChange(function (value) { createScene(); });
gui.add(sphereObject, 'scale', .5, 10).listen().onChange(function (value) { createScene(); });
gui.add(sphereObject, 'type', ['Random', 'Tetrahedron', 'Octahedron', 'Icosahedron', 'Dodecahedron']).listen().onChange(function (value) { createScene(); });



function createScene() {

    let nbrSolids = 30;
    let opacity = 0.8;
    let scale = 1;
    //let type = "Icosahedron";
    let type = "Random";
    let rad = 12

    //clear objects on update.
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    //create new objects after gui has been updated.

    let thing = createSphereF(makeSolidsFnc(), sphereObject.nbrSolids, sphereObject.rad, sphereObject.opacity, sphereObject.type, sphereObject.scale);
    scene.add(thing);
    let light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 50, 0);
    scene.add(light);
    let light2 = new THREE.PointLight(0xffffff, .7, 100);
    light2.position.set(0, -50, 0);
    scene.add(light2);
}

function createSphereF(fnc, n, rad, opacity, type, scale) {
    let root = new THREE.Object3D();
    for (let i = 0; i < n; i++) {
        let obj = fnc(n, opacity, type);
        obj.scale.set(scale, scale, scale);
        let p = getRandomPointOnSphere(rad);
        obj.position.set(p.x, p.y, p.z);
        root.add(obj);
    }
    return root;
}

function makeSolidsFnc() {
    const solids = [
           new THREE.TetrahedronGeometry(1),
           new THREE.BoxGeometry(1, 1, 1),
           new THREE.OctahedronGeometry(1),
           new THREE.IcosahedronGeometry(1),
           new THREE.DodecahedronGeometry(1)
    ];
    const nbrSolids = solids.length;
    function f(n, opacity, type) {
        let geom = new THREE.Geometry();
        if (type == "Tetrahedron")
            geom = solids[0];
        else if (type == "Box")
            geom = solids[1];
        else if (type == "Octahedron")
            geom = solids[2];
        else if (type == "Icosahedron")
            geom = solids[3];
        else if (type == "Dodecahedron")
            geom = solids[4];
        else //else, randomly determine shape
        {
            let i = Math.floor(Math.random() * 5);
            geom = solids[i];
        }

        let color = getRandomColor(0.8, 0.1, 0.8);
        let args = { color: color, opacity: opacity, transparent: true };
        let mat = new THREE.MeshLambertMaterial(args);
        return new THREE.Mesh(geom, mat);
    }
    return f;
}

function createRingF(fnc, n, t, opacity, scaleX, scaleY, scaleZ, type, rainbow) {
    let root = new THREE.Object3D();
    let angleStep = 2 * Math.PI / n;
    for (let i = 0, a = 0; i < n; i++, a += angleStep) {
        let s = new THREE.Object3D();
        s.rotation.y = a;
        let m = fnc(i, n, opacity, type, rainbow);
        m.position.x = t;
        m.scale.set(scaleX, scaleY, scaleZ);
        s.add(m);
        root.add(s);
    }
    return root;
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

