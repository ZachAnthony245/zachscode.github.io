/***********
 * zja_ass4_prob2.js
 * This produces a number of rings that will be animated around one another.
 * Zachary Anthony
 * February 2020
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();
let targetXpos;
let targetZpos;
let cannonFire = new Audio("https://rawcdn.githack.com/ZachAnthony245/zachscode.github.io/1627bc94bcb218591df39a6c49491c5511b7d23b/threejsGraphics2020/sound/Cannon_1.mp3");
let gong = new Audio("https://rawcdn.githack.com/ZachAnthony245/zachscode.github.io/6d7f44fa604c1a1f9c45b492f9e9ccb49b9a41c1/threejsGraphics2020/sound/Chinese-gong-sound.mp3");
let groundTexture = new THREE.TextureLoader().load("https://rawcdn.githack.com/ZachAnthony245/zachscode.github.io/71467206d4b709c247dfb702bd999dd0372ff655/threejsGraphics2020/Textures/ground.png");
let brassTexture = new THREE.TextureLoader().load("https://rawcdn.githack.com/ZachAnthony245/zachscode.github.io/6be358726ffae4861e3df391c30685712d905b54/threejsGraphics2020/Textures/brass.jpg");
let steelTexture = new THREE.TextureLoader().load("https://rawcdn.githack.com/ZachAnthony245/zachscode.github.io/ce1a257998f5c0d825b1edafd240d08604956e96/threejsGraphics2020/Textures/steel.jpg");
let ballTexture = new THREE.TextureLoader().load("https://rawcdn.githack.com/ZachAnthony245/zachscode.github.io/be2032c20670ec5bcbcdd141a2e4e60b8e92a61f/threejsGraphics2020/Textures/ball.jpg");

//Object for defining variables
var cannonObject = {
    sideToSide: 0,
    upDown: 45,
    velocity: 100,
    firing: false,
    hit: false,
    xVelocity: 0,
    yVelocity: 0,
    zVelocity: 0,

    FIRE: function () {
        
        cannonFire.play(); //play sound of cannon firing.
        
        //below we compute the velocities in every direction.
        this.yVelocity = Math.sin(degreesToRadians(this.upDown)) * this.velocity;
        this.zVelocity = Math.cos(degreesToRadians(this.upDown)) * Math.cos(degreesToRadians(-this.sideToSide)) * this.velocity; //inverting side to side to make it more intuitive to aim.
        this.xVelocity = Math.cos(degreesToRadians(this.upDown)) * Math.sin(degreesToRadians(-this.sideToSide)) * this.velocity;

        this.firing = true;
        this.hit = false;

        createScene();
    },

    resetDefaults: function () {
        this.sideToSide = 0;
        this.upDown = 45;
        this.velocity = 100;
        createScene();
    }
};

//control for GUI.
const gui = new dat.GUI({ autoPlace: true });
gui.add(cannonObject, 'sideToSide', -90, 90).listen().onChange(function (value) { createScene(); });
gui.add(cannonObject, 'upDown', 0, 90).listen().onChange(function (value) { createScene(); });
gui.add(cannonObject, 'velocity', 5, 200);
gui.add(cannonObject, 'FIRE');
gui.add(cannonObject, 'resetDefaults');



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
            ball.position.y = -.01; //make sure ball is visible.

            if (!cannonObject.hit) {
                if (Math.sqrt((ball.position.x - targetXpos) * (ball.position.x - targetXpos) + (ball.position.z - targetZpos) * (ball.position.z - targetZpos)) <= 10) {

                    gong.play(); //the victory noise!
                    cannonObject.hit = true;
                    randomizeTargetpos();
                }
            }
        }
    }

    let floor = createFloor();
    scene.add(floor);

    let cannon = createCannon();
    scene.add(cannon);

    let target = createTarget();
    target.position.x = targetXpos;
    target.position.z = targetZpos;
    scene.add(target);

    let ballGeom = new THREE.SphereGeometry(1);
    //let c = new THREE.Color(1, 1, 1);
    //let ballArgs = { color: c, transparent: false };
    let ballArgs = { map: ballTexture, side: THREE.DoubleSide };
    let ballMat = new THREE.MeshLambertMaterial(ballArgs);
    let ball = new THREE.Mesh(ballGeom, ballMat);

    ball.position.x = 0;
    ball.position.y = 2;
    ball.position.z = 0;

    scene.add(ball);
    
    //create ligths.
    let sun = new THREE.PointLight(0xffffff, 1, 10000);
    sun.position.set(-20, 600, 0);
    scene.add(sun);

    if (cannonObject.firing)
        mainLoop();
}


//Creates floor mesh for scene.
function createFloor() {
    let geom = new THREE.BoxGeometry(800, .1, 800);
    //let c = new THREE.Color(0, .5, 0);
    //let args = { color: c, transparent: false };
    //let args = { map: groundTexture, specular: 0xFF9999, shininess: 1 };
    let args = { map: groundTexture, side: THREE.DoubleSide };
    let mat = new THREE.MeshLambertMaterial(args);
    //let mat = new THREE.MeshPhongMaterial(args);
    let floor = new THREE.Mesh(geom, mat);
    return floor;
}

//create target
function createTarget() {
    let geom = new THREE.CylinderGeometry(10, 10, .1, 32);
    //let c = new THREE.Color(0.5, 0.4, 0);
    //let args = { color: c, transparent: false };
    let args = { map: brassTexture, side: THREE.DoubleSide };
    let mat = new THREE.MeshLambertMaterial(args);
    let mesh = new THREE.Mesh(geom, mat);
    mesh.position.y = 0.05; //make sure it is visible above the ground.
    return mesh;
}

//randomizes target position.
function randomizeTargetpos() {
    targetXpos = Math.random() * 300 - 150;
    targetZpos = Math.random() * 300 + 60;
}

//creates cannon
function createCannon() {
    let root = new THREE.Object3D();
    let baseGeom = new THREE.CylinderGeometry(5, 5, 2, 32);
    //let c = new THREE.Color(0.1, 0.1, 0.1);
    //let cannonArgs = { color: c, transparent: false };

    let cannonArgs = { map: steelTexture, side: THREE.DoubleSide };

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
    root.rotation.y = degreesToRadians(-cannonObject.sideToSide); //inverting this to make it more intuitive to aim.

    return root;
}


//update positions for animation.
function updater(ball) {
    let delta = clock.getDelta() * 10.0; //multiplying by 10 to make it move faster.

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
    randomizeTargetpos();

    //set texture repeats and wrappings
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(10, 10);

    steelTexture.wrapS = THREE.RepeatWrapping;
    steelTexture.wrapT = THREE.RepeatWrapping;
    steelTexture.repeat.set(4, 4);

    ballTexture.wrapS = THREE.ClampToEdgeWrapping;
    ballTexture.wrapT = THREE.ClampToEdgeWrapping;

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

