import * as THREE from '../three/build/three.module.js';
import { VRButton } from '../three/examples/jsm/webxr/VRButton.js'; // XR 

export default class Main {
    constructor() {
        this._renderer;
        this._scene;
        this._camera;
        this._shapes;
        this._clock = new THREE.Clock();
        this._container = document.querySelector('#container');

        this._createRenderer();
        this._createScene();
        this._createUser();
        this._createAssets();
        this._addEventListeners();

        this._t = 0; // Oscillaltions

        this._renderer.setAnimationLoop(() => { this._update() });
    }

    _createRenderer() {
        this._renderer = new THREE.WebGLRenderer({ antialias : true });
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.xr.enabled = true; // XR
        this._container.appendChild(this._renderer.domElement); 
        this._container.appendChild(VRButton.createButton(this._renderer)); // XR

    }

    _createScene() {
        this._scene = new THREE.Scene();
    }

    _createUser() {
        this._camera = new THREE.PerspectiveCamera(
            45, //Field of View Angle
            window.innerWidth / window.innerHeight, //Aspect Ratio
            0.1, //Clipping for things closer than this amount
            1000 //Clipping for things farther than this amount
        );
        this._camera.position.setY(1.7); //Height of your eyes
        this._scene.add(this._camera);
    }

    _createAssets() {
        //Create Sphere + Cube
        let sphereRadius = 1;
        let sphereGeometry = new THREE.SphereBufferGeometry(
            sphereRadius,
            16, //Width segments
            16 //Height segments
        );
        let sphereMaterial = new THREE.MeshLambertMaterial({
            color: 0xFF0000 //Red
        });
        let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        let cubeGeometry = new THREE.BoxBufferGeometry(
            1.5 * sphereRadius, //Width
            1.5 * sphereRadius, //Height
            1.5 * sphereRadius //Depth
        );
        let cubeMaterial = new THREE.MeshLambertMaterial({
            color: 0x00FF00 //Green
        });
        let cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

        //Group shapes together and add group to the scene
        this._shapes = new THREE.Object3D();
        this._shapes.add(sphereMesh);
        this._shapes.add(cubeMesh);
        this._shapes.position.setY(1.7); //Place at eye level
        this._shapes.position.setZ(-10); //Move shape forward so we can see it
        this._scene.add(this._shapes);

        //Add light to the scene
        let light = new THREE.PointLight();
        light.position.setY(2);
        this._scene.add(light);
    }

    _addEventListeners() {
        window.addEventListener('resize', () => { this._onResize() });
        window.addEventListener('wheel', function(event) {
                    event.preventDefault();
        }, {passive: false, capture: true});
        
    }

    _onResize () {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
    }

    _update() {
        this._t += 0.01;
        let timeDelta = this._clock.getDelta();

        if (this._t > 2 * Math.PI)
            this._t = 0;
        else
            if (Math.cos (this._t)>0)
                this._shapes.translateX(0.01)
            else
                this._shapes.translateX(-0.01)

        this._renderer.render(this._scene, this._camera);
    }
}
