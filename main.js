import * as THREE from 'three';
import { init_physics, physicsHelper, vehicleController, load_car, update_wheels, update_car_control, update_model } from './car.js';
import { load_sounds } from './sounds.js';

export const game_status = {
    sounds: false
};

// SCENE
export const scene = new THREE.Scene();
scene.background = new THREE.Color('skyblue');

// CAMERA
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);

// RENDERER
export const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
renderer.setAnimationLoop( animate );

// LIGHTS
const ambient = new THREE.HemisphereLight( 0x555555, 0xFFFFFF, 2.5 );
scene.add( ambient );
const light = new THREE.DirectionalLight( 0xffffff, 4 );
light.position.set( 0, 12.5, 12.5 );
scene.add( light );

// GROUND
const geometry = new THREE.BoxGeometry( 10000, 0.5, 10000 );
const material = new THREE.MeshStandardMaterial( { color: 'green' } );
const ground = new THREE.Mesh( geometry, material );
ground.receiveShadow = true;
ground.position.set( 0, - 0.25, - 20 );
ground.userData.physics = { mass: 0 };
scene.add( ground );

// LOADING MANAGER
export const manager = new THREE.LoadingManager();

// EVENT LISTENERS
window.addEventListener('resize', (e) => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
});

const play_button = document.getElementById('playbutton');
const startup_screen = document.getElementById('startup');
const speed_o_meter = document.getElementById('speedometer');

play_button.addEventListener('click', (e) => {
    startup_screen.style.display = 'none';
    speed_o_meter.style.display = 'block';

    if (!game_status.sounds) {
        game_status.sounds = true;
    }
});

// FUNCTIONS
function animate() {
    
    if ( vehicleController ) {
        update_car_control();
        vehicleController.updateVehicle( 1 / 60 );
        update_wheels();
        update_model();
    }

    //if ( physicsHelper ) physicsHelper.update();

    renderer.render( scene, camera );
}

// FUNCTION CALLS (start game)
init_physics();
load_car();
load_sounds();