import * as THREE from '../three/build/three.module.js';

export default function main() {
    //Create renderer + Canvas
    let container = document.querySelector('#container');
    let renderer = new THREE.WebGLRenderer({ antialias : true });
    let canvas = renderer.domElement;
    container.appendChild(canvas);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    //Create Scene
    let scene = new THREE.Scene();
    
    //Create a Camera and add it to the scene
    let camera = new THREE.PerspectiveCamera(
        45, //Field of View Angle
        window.innerWidth / window.innerHeight, //Aspect Ratio
        1.1, //Clipping for things closer than this amount
        1000 //Clipping for things farther than this amount
    );
    camera.position.setY(0); //Height of your eyes
    scene.add(camera);
    
    //Create Sphere + Cube
    let sphereRadius = 1;
    let sphereGeometry = new THREE.SphereBufferGeometry(
        sphereRadius,
        16, //Width segments
        16 //Height segments
    );
    let newElement= new THREE.DodecahedronGeometry(1);

    let newMaterial = new THREE.MeshLambertMaterial({
        color: 0x0000FF //BLUE
    });
    let newMesh = new THREE.Mesh(newElement, newMaterial);
    
    let sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0xFF0000 //Red
    });
    let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    let cubeGeometry = new THREE.BoxBufferGeometry(
        1.5 * sphereRadius, //Width
        1.5 * sphereRadius, //Height
        1.5 * sphereRadius //Depth
    );
    const loader = new THREE.TextureLoader();
    let cubeMaterial = new THREE.MeshLambertMaterial({
        //color: 0x00FF00 //Green
        map: loader.load('img/wall.jpg')
    });
    let cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    
    //Group shapes together and add group to the scene
    let shapes = new THREE.Object3D();
    let newShapes = new THREE.Object3D();
    shapes.add(sphereMesh);
    shapes.add(cubeMesh);
    
    shapes.position.setY(0); //Place at eye level
    shapes.position.setZ(-10); //Move shape forward so we can see it
    scene.add(shapes);
    newShapes.add(newMesh);
    newShapes.position.setY(-2); //Place at eye level
    newShapes.position.setX(2);
    newShapes.position.setZ(-10);
    scene.add(newShapes);
    
    //Add light to the scene
    let light = new THREE.PointLight();
    light.position.setY(2);
    scene.add(light);
    
    //Our animation loop
    let clock = new THREE.Clock(); //Need to keep track of time elapsed between frames
    function update() {
        let timeDelta = clock.getDelta();
        let rotationAmount = 2 * Math.PI * timeDelta * 0.1; //0.1 rotations per second
        shapes.rotation.x += rotationAmount;
        shapes.rotation.y += rotationAmount;
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(update);
    
    function onResize () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    
    window.addEventListener('resize', onResize);
    //this code prevent the scroll
    window.addEventListener('wheel', function(event) {
        event.preventDefault();
    }, {passive: false, capture: true});
}
