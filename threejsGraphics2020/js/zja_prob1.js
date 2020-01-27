/***********
 * zja_prob1.js
 * an N sided polygon with separate inner and outer colors.
 * Zachary Anthony
 * January 2020
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();

function createScene() {
    let n = 8;
    let innerColor = new THREE.Color(.5, .5, .5);
    let outerColor = new THREE.Color(.6, 0, .7);
    let polyG = regularPolygonGeometry(n, innerColor, outerColor);
    scene.add(polyG);
}
function regularPolygonGeometry(n, innerColor, outerColor) {
	let geom = new THREE.Geometry();
	let inc = 2 * Math.PI / n; //calculate radians per side.
	let rad = 2; //radius fixed at 2 units.
	//loop through n vectors, 1 for each side.
	for (let i = 0, a = 0; i < n; i++, a += inc) {
		let cos = Math.cos(a);
		let sin = Math.sin(a);
		geom.vertices.push(new THREE.Vector3(rad * cos, rad * sin, 0));
	}
	//set faces.  Always starting in the center vertex.
	for (let i = 0; i < n; i++) {
		let face = new THREE.Face3(n, i, i + 1);
		face.vertexColors.push(innerColor, outerColor, outerColor);
		geom.faces.push(face);
	}
	//set final face.
	let face = new THREE.Face3(n, n - 1, 0);
	face.vertexColors.push(innerColor, outerColor, outerColor);
	geom.faces.push(face);

	let args = {vertexColors: THREE.VertexColors, side: THREE.DoubleSide};
	let mat = new THREE.MeshBasicMaterial(args);
	let mesh = new THREE.Mesh(geom, mat);

	return mesh;
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

