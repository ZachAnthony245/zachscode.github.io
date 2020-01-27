/***********
 * zja_prob2.js
 * an N sided, lined cylinder with inputed dimentions and colors.
 * Zachary Anthony
 * January 2020
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();


function createScene() {
    let n = 17;
    let color = new THREE.Color(.09, .4, .7);
    let radius = 2;
    let height = 9;
    let tube = linedCylinder(n, radius, height, color);
    scene.add(tube);
}


function linedCylinder(n, radius, height, color) {
	let geom = new THREE.Geometry();
	let inc = 2 * Math.PI / n;
	let color2 = new THREE.Color(color);

	for (let i = 0, a = 0; i < n; i++) {
		let cos = Math.cos(a);
		let sin = Math.sin(a);

		let vecT = new THREE.Vector3(radius * cos, height / 2, radius * sin);
		let vecB = new THREE.Vector3(radius * cos, -height / 2, radius * sin);

		a += inc;
		cos = Math.cos(a);
		sin = Math.sin(a);
		let vecT2 = new THREE.Vector3(radius * cos, height / 2, radius * sin);
		let vecB2 = new THREE.Vector3(radius * cos, -height / 2, radius * sin);

		geom.vertices.push(vecT, vecT2); //new top segment.
		geom.colors.push(color, color2);
		geom.vertices.push(vecB, vecB2); //new bottom segment.
		geom.colors.push(color, color2);
		geom.vertices.push(vecT, vecB); //new wall segment.
		geom.colors.push(color, color2);
	}

	let args = {vertexColors: true, linewidth: 2};
	let mat = new THREE.LineBasicMaterial(args);

	return new THREE.LineSegments(geom, mat);
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

