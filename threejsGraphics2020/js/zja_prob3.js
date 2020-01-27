/***********
 * zja_prob3.js
 * an N sided, solid cylinder of arbitrary dimensions and color
 * Zachary Anthony
 * January 2020
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();

function createScene() {
    let n = 14;
    let rad = 2;
    let len = 4;
    let mesh = meshCylinder(n, rad, len);
    scene.add(mesh);
    let light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(50, 50, 50);
    scene.add(light);
    let light2 = new THREE.PointLight(0xffffff, 1, 100);
    light2.position.set(-50, -50, -50);
    scene.add(light2);
}

//function to turn it into a mesh so that we can see it
function meshCylinder(n, rad, len) {
  let geom = createCylinder(n, rad, len);
  let color = new THREE.Color(.09, .4, .7);
  let args = {color: color, flatShading: true, side: THREE.DoubleSide};
  let mat = new THREE.MeshLambertMaterial(args);
  let mesh = new THREE.Mesh(geom, mat);

  return mesh;
}

//here is the function required by the assignment that just creates a geometry.
function createCylinder(n, rad, len) {
    let len2 = len / 2;  // half the pyramid's height
    let geom = new THREE.Geometry();
    let inc = 2 * Math.PI / n;

    //create vertixes 0 to 2n-1 with both the top and bottom.
    for (let i = 0, a = 0; i < n; i++, a += inc) {
        let cos = Math.cos(a);
        let sin = Math.sin(a);
        geom.vertices.push(new THREE.Vector3(rad*cos, -len2, rad*sin));
        geom.vertices.push(new THREE.Vector3(rad*cos, len2, rad*sin));
    }
    // push the 2n triangular faces...
    for (let i = 0; i < 2 * n - 2; i += 2) {
        let face = new THREE.Face3(i, i+1, i+2);
        let face2 = new THREE.Face3(i+3, i+1, i+2);
        geom.faces.push(face);
        geom.faces.push(face2);
    }
    //connecting the last sides.
    let face = new THREE.Face3(2 * n - 1, 2 * n - 2, 0);
    let face2 = new THREE.Face3(2 * n - 1, 1, 0);
    geom.faces.push(face);
    geom.faces.push(face2);
 
    //loop to create the faces on the bottom and top.
    for (let i = 1; i < n - 1; i++) {
       let face = new THREE.Face3(2 * i, 2 * i + 2, 0); //bottom faces
       let face2 = new THREE.Face3(2 * i + 1, 2 * i + 3, 1); //top faces
       geom.faces.push(face);
       geom.faces.push(face2);
    }
 
    // set face normals and return the geometry
    geom.computeFaceNormals();
    return geom;
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

	renderer = new THREE.WebGLRenderer({antialias : true, preserveDrawingBuffer: true});
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor(0x000000, 1.0);

	camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 1000);
	camera.position.set(0, 0, 30);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
}


function addToDOM() {
	let container = document.getElementById('container');
	let canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}


init();
createScene();
addToDOM();
render();
animate();

