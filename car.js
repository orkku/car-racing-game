import * as THREE from 'three';
import { RapierPhysics } from 'three/addons/physics/RapierPhysics.js';
import { RapierHelper } from 'three/addons/helpers/RapierHelper.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene, camera, manager, game_status } from './main.js';
import { update_engine_sound } from './sounds.js';

const play_button = document.getElementById('playbutton');
const startup_screen = document.getElementById('startup');
const speed_o_meter = document.getElementById('speedometer');
var physics;
export var physicsHelper;
var body, steering_wheel;
const car_collection = new THREE.Group();
export var chassis;
var car, wheels;
export var vehicleController;
var angle = 0;
const movement = {
    forward: 0,
    right: 0,
    brake: 0,
    reset: false,
    accelerateForce: { value: 0, min: - 30, max: 30, step: 1 },
    brakeForce: { value: 0, min: 0, max: 1, step: 0.05 }
};

export async function load_car() {
    const loader = new GLTFLoader(manager);
    // load body
    const model_body = await loader.loadAsync( 'assets/car/body.glb' );
    body = model_body.scene;
    car_collection.add(body);
    // load steering wheel
    const model_steering_wheel = await loader.loadAsync( 'assets/car/steering_wheel.glb' );
    steering_wheel = model_steering_wheel.scene;
    steering_wheel.position.set(body.position.x,body.position.y + 0.5,body.position.z - 1.05);
    car_collection.add(steering_wheel);
    camera.position.set(0.0, 1.05, -0.25);
    camera.lookAt(0.0, 0.0, -10);
    car_collection.add(camera);
    scene.add(car_collection);
}

function create_car() {
    const geometry = new THREE.BoxGeometry( 2.75, 1, 6.25 );
    const material = new THREE.MeshStandardMaterial( { color: 0xFF0000, wireframe: true, visible: false } );
    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    car = mesh;

    mesh.position.x = -150;
    mesh.position.y = 1;
    mesh.position.z = -5;
    mesh.rotation.y = 0.2;
    mesh.rotateY((Math.PI / 360) * -250);

    physics.addMesh( mesh, 10, 0.8 ); // addMesh places the RigidBody in the mesh.userData.physics object
    chassis = mesh.userData.physics.body;

    vehicleController = physics.world.createVehicleController( chassis );

    wheels = [];

    addWheel( 0, { x: -0.975, y: 0, z: -1.85 }, 0.375, 0.4, 0.55, mesh );     // FL
    addWheel( 1, { x: 0.975, y: 0, z: -1.85 }, 0.375, 0.4, 0.55,mesh );      // FR
    addWheel( 2, { x: -1.075, y: 0, z: 1.95 }, 0.525, 0.725, 0.4, mesh );    // RL
    addWheel( 3, { x: 1.075, y: 0, z: 1.95 }, 0.525, 0.725, 0.4, mesh );     // RR

    vehicleController.setWheelSteering( 0, Math.PI / 4 );
    vehicleController.setWheelSteering( 1, Math.PI / 4 );
}

function addWheel( index, pos, radius, width, restLength, carMesh ) {

    // Define wheel properties
    const wheelRadius = radius;
    const wheelWidth = width;
    const suspensionRestLength = restLength;
    const wheelPosition = pos; // Position relative to chassis
    const wheelDirection = { x: 0.0, y: - 1.0, z: 0.0 }; // Downward direction
    const wheelAxle = { x: - 1.0, y: 0.0, z: 0.0 }; // Axle direction

    // Add the wheel to the vehicle controller
    vehicleController.addWheel(
        wheelPosition,
        wheelDirection,
        wheelAxle,
        suspensionRestLength,
        wheelRadius
    );

    // Set suspension stiffness for wheel
    vehicleController.setWheelSuspensionStiffness( index, 24.0 );

    // Set wheel friction
    vehicleController.setWheelFrictionSlip( index, 3.5 );

    // Enable steering for the wheel
    vehicleController.setWheelSteering( index, pos.z < 0 );

    // Create a wheel mesh
    const geometry = new THREE.CylinderGeometry( wheelRadius, wheelRadius, wheelWidth, 16 );
    geometry.rotateZ( Math.PI * 0.5 );
    const material = new THREE.MeshStandardMaterial( { color: 0x000000 } );
    const wheel = new THREE.Mesh( geometry, material );

    wheel.position.copy( pos );

    wheels.push( wheel );
    carMesh.add( wheel );
}

export function update_wheels() {

    if ( vehicleController === undefined ) return;

    const wheelSteeringQuat = new THREE.Quaternion();
    const wheelRotationQuat = new THREE.Quaternion();
    const up = new THREE.Vector3( 0, 1, 0 );

    //const chassisPosition = chassis.translation();

    wheels.forEach( ( wheel, index ) => {

        const wheelAxleCs = vehicleController.wheelAxleCs( index );
        const connection = vehicleController.wheelChassisConnectionPointCs( index ).y || 0;
        const suspension = vehicleController.wheelSuspensionLength( index ) || 0;
        const steering = vehicleController.wheelSteering( index ) || 0;
        const rotationRad = vehicleController.wheelRotation( index ) || 0;

        wheel.position.y = connection - suspension;

        wheelSteeringQuat.setFromAxisAngle( up, steering );
        wheelRotationQuat.setFromAxisAngle( wheelAxleCs, rotationRad );

        wheel.quaternion.multiplyQuaternions( wheelSteeringQuat, wheelRotationQuat );

    } );

}

export function update_car_control() {

    if (!chassis) return;
    
    if ( movement.reset ) {
        chassis.setTranslation( new physics.RAPIER.Vector3( chassis.translation().x, 1, chassis.translation().z ), true );
        chassis.setRotation( new physics.RAPIER.Quaternion( 0, chassis.rotation().y, 0, 1 ), true );
        chassis.setLinvel( new physics.RAPIER.Vector3( 0, 0, 0 ), true );
        chassis.setAngvel( new physics.RAPIER.Vector3( 0, 0, 0 ), true );

        movement.accelerateForce.value = 0;
        movement.brakeForce.value = 0;

        return;
    }

    let accelerateForce = 0;

    if ( movement.forward < 0 ) {
        //if (movement.accelerateForce.value === 0) chassis.wakeUp();
        accelerateForce = movement.accelerateForce.value - movement.accelerateForce.step;
        if ( accelerateForce < movement.accelerateForce.min ) accelerateForce = movement.accelerateForce.min;
    } else if ( movement.forward > 0 ) {
        //if (movement.accelerateForce.value === 0) chassis.wakeUp();
        accelerateForce = movement.accelerateForce.value + movement.accelerateForce.step;
        if ( accelerateForce > movement.accelerateForce.max ) accelerateForce = movement.accelerateForce.max;
    } else {
        if ( chassis.isSleeping() ) chassis.wakeUp();
    }

    movement.accelerateForce.value = accelerateForce;
    //console.log(accelerateForce);

    let brakeForce = 0;

    if ( movement.brake > 0 ) {
        brakeForce = movement.brakeForce.value + movement.brakeForce.step;
        if ( brakeForce > movement.brakeForce.max ) brakeForce = movement.brakeForce.max;
    }

    movement.brakeForce.value = brakeForce;

    const engineForce = accelerateForce;

    vehicleController.setWheelEngineForce( 0, engineForce );
    vehicleController.setWheelEngineForce( 1, engineForce );

    const currentSteering = vehicleController.wheelSteering( 0 );
    const steerDirection = movement.right;
    const steerAngle = Math.PI / 8;

    const steering = THREE.MathUtils.lerp( currentSteering, steerAngle * steerDirection, 0.05 ); // viimeinen luku alunperin 0.25

    // ohjauspyörä
    if (steering != 0 && steering_wheel) {
        steering_wheel.rotation.z = steering * 3;
    }

    vehicleController.setWheelSteering( 0, steering );
    vehicleController.setWheelSteering( 1, steering );

    const wheelBrake = movement.brake * brakeForce;
    vehicleController.setWheelBrake( 0, wheelBrake );
    vehicleController.setWheelBrake( 1, wheelBrake );
    vehicleController.setWheelBrake( 2, wheelBrake );
    vehicleController.setWheelBrake( 3, wheelBrake );
}

export function update_model() {
    if (!chassis) return;

    const pos = chassis.translation();
    const rot = chassis.rotation();

    car_collection.position.copy(pos).add(new THREE.Vector3(0,-0.35,0));
    car_collection.quaternion.copy(rot);

    speedOMeter();

    // reset car if it's falling through ground
    if (pos.y < -10) {
        chassis.setTranslation( new physics.RAPIER.Vector3( chassis.translation().x, 1, chassis.translation().z ), true );
        chassis.setRotation( new physics.RAPIER.Quaternion( 0, chassis.rotation().y, 0, 1 ), true );
        chassis.setLinvel( new physics.RAPIER.Vector3( 0, 0, 0 ), true );
        chassis.setAngvel( new physics.RAPIER.Vector3( 0, 0, 0 ), true );

        movement.accelerateForce.value = 0;
        movement.brakeForce.value = 0;

        console.log('car was falling and it is restored back to ground.');
        return;
    }
}

function speedOMeter() {
    const linvel = chassis.linvel();
    const speedMs = Math.hypot(linvel.x, linvel.y, linvel.z);
    const speedKmh = speedMs * 3.6;

    update_engine_sound(speedKmh);
    
    document.getElementById('speedometer').innerText =
        `${speedKmh.toFixed(0)} km/h`;
}

export async function init_physics() {

    //Initialize physics engine using the script in the jsm/physics folder
    physics = await RapierPhysics();

    //Optionally display collider outlines
    physicsHelper = new RapierHelper( physics.world );
    scene.add( physicsHelper );

    physics.addScene( scene );

    create_car();

}

window.addEventListener( 'keydown', ( event ) => {

    //console.log( event.code );
    if ( event.code === 'KeyA' || event.code === 'ArrowUp' ) movement.forward = - 1;
    if ( event.code === 'KeyZ' || event.code === 'ArrowDown' ) movement.forward = 1;
    if ( event.code === 'Comma' || event.code === 'ArrowLeft' ) movement.right = 1;
    if ( event.code === 'Period' || event.code === 'ArrowRight' ) movement.right = - 1;
    if ( event.code === 'KeyR' ) movement.reset = true;
    if ( event.code === 'Space' ) movement.brake = 1;

    if ( event.code === 'Escape' ){
        startup_screen.style.display = 'block';
        speed_o_meter.style.display = 'none';
    
        if (game_status.sounds) {
            game_status.sounds = false;
        }
    }

} );

window.addEventListener( 'keyup', ( event ) => {

    if ( event.code === 'KeyA' || event.code === 'KeyZ' || event.code === 'ArrowUp' || event.code === 'ArrowDown' ) movement.forward = 0;
    if ( event.code === 'Period' || event.code === 'Comma' || event.code === 'ArrowLeft' || event.code === 'ArrowRight' ) movement.right = 0;
    if ( event.code === 'KeyR' ) movement.reset = false;
    if ( event.code === 'Space' ) movement.brake = 0;

} );