import * as THREE from 'three'; // Three JS versio 0.180.0
import RAPIER from 'rapier';    // Rapier JS version 0.19.3
import Stats from 'three/addons/libs/stats.module.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { cars } from './references.js';

let car_number = 1;
const dynamicBodies = [];
const followTarget = new THREE.Object3D();
followTarget.position.set(0, 1, 0);
const pivot = new THREE.Object3D();
const yaw = new THREE.Object3D();
const pitch = new THREE.Object3D();
// FWD / RWD / AWD
let wheelFLAxel = null;
let wheelFRAxel = null;
let wheelRLAxel = null;
let wheelRRAxel = null;
// STEERING
let wheelFLSteer = null;
let wheelFRSteer = null;
// INPUT
const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    reset: false
};

const selection_1 = document.getElementById('dodge');
const selection_2 = document.getElementById('bugatti');
const selection_3 = document.getElementById('porche');
const selection_4 = document.getElementById('bmw');
selection_1.addEventListener('click', () => {
    car_number = 1;    
    startGame();
});
selection_2.addEventListener('click', () => {
    car_number = 2;
    startGame();
});
selection_3.addEventListener('click', () => {
    car_number = 4;
    startGame();
});
selection_4.addEventListener('click', () => {
    car_number = 10;
    startGame();
});

// initialize RAPIER JS
// ====================
await RAPIER.init();
const gravity = new THREE.Vector3( 0.0, -9.81, 0.0 );
const world = new RAPIER.World( gravity );

console.log("Rapier version:", RAPIER.version());

// initialize THREE JS
// ===================
// stats
const stats = new Stats();
document.body.appendChild( stats.dom );
// manager
const manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    document.getElementById('instructions').className = "hidden";
    document.getElementById('selection').className = "hidden";
    document.getElementById('progress').className = "visible";
    //console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onLoad = function ( ) {
    document.getElementById('mainmenu').className = "hidden";
    document.getElementById('speedometer').className = 'visible';
    //console.log('Loading complete!');
};

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    var percentage = (itemsLoaded / itemsTotal) * 100;
    document.getElementById("percentage").innerHTML = percentage.toFixed(0) + "%";
    //console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onError = function ( url ) {
    //console.log('There was an error loading ' + url);
};
// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('skyblue');
// camera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.add(pivot)
pivot.add(yaw);
yaw.add(pitch);
pitch.add(camera);
pitch.position.set(0, 1.5, -7);
pitch.rotation.y = Math.PI;
camera.position.set(0, 0, 0);
// renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
// directional light
const directionalLight = new THREE.DirectionalLight();
directionalLight.intensity = 2;
directionalLight.position.set(100, 100, 100);
scene.add(directionalLight);
// ambient light
const ambientLight = new THREE.AmbientLight();
ambientLight.intensity = 1.5;
scene.add(ambientLight);
// ground
const groundMesh = new THREE.Mesh(
  new THREE.BoxGeometry(1000, 0.2, 1000),
  new THREE.MeshStandardMaterial({ color: 'green', wireframe: false })
);
groundMesh.position.y = -0.01;
scene.add(groundMesh);
const groundBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
const groundCollider = RAPIER.ColliderDesc.cuboid(500, 0.1, 500).setTranslation(0, 0, 0).setRestitution(0).setCollisionGroups(65542);
world.createCollider(groundCollider, groundBody);

// WALLS
// geometry
const wallGeo1 = new THREE.BoxGeometry(1, 3, 500);
const wallGeo2 = new THREE.BoxGeometry(750, 3, 1);
const wallGeo3 = new THREE.BoxGeometry(100, 3, 1);
const wallGeo4 = new THREE.BoxGeometry(1, 3, 500);
const wallGeo5 = new THREE.BoxGeometry(500, 3, 1);
const wallGeo6 = new THREE.BoxGeometry(100, 3, 3);
const wallMat = new THREE.MeshPhongMaterial({color: 'Silver'});
const wallMesh1 = new THREE.Mesh(wallGeo1, wallMat);
const wallMesh2 = new THREE.Mesh(wallGeo2, wallMat);
const wallMesh3 = new THREE.Mesh(wallGeo3, wallMat);
const wallMesh4 = new THREE.Mesh(wallGeo4, wallMat);
const wallMesh5 = new THREE.Mesh(wallGeo5, wallMat);
const wallMesh6 = new THREE.Mesh(wallGeo6, wallMat);

// wall 1
wallMesh1.rotation.y = -Math.PI / 6;
wallMesh1.position.set(0, 0, -125);
scene.add(wallMesh1);
const wall1Body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
const wall1Collider = RAPIER.ColliderDesc.cuboid(0.5, 1.5, 250).setTranslation(0, 0, -125).setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 6));
world.createCollider(wall1Collider, wall1Body);
// wall 2
wallMesh2.rotation.y = -Math.PI / 2.5;
wallMesh2.position.set(150, 0, -150);
scene.add(wallMesh2);
const wall2Body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
const wall2Collider = RAPIER.ColliderDesc.cuboid(375, 1.5, 0.5).setTranslation(150, 0, -150).setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2.5));
world.createCollider(wall2Collider, wall2Body);
// wall 3
wallMesh3.rotation.y = -Math.PI / 4;
wallMesh3.position.set(-75, 0, 75);
scene.add(wallMesh3);
const wall3Body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
const wall3Collider = RAPIER.ColliderDesc.cuboid(50, 1.5, 0.5).setTranslation(-75, 0, 75).setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 4));
world.createCollider(wall3Collider, wall3Body);
//wall 4
wallMesh4.rotation.y = -Math.PI / 2;
wallMesh4.position.set(150, 0, 100);
scene.add(wallMesh4);
const wall4Body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
const wall4Collider = RAPIER.ColliderDesc.cuboid(0.5, 1.5, 250).setTranslation(150, 0, 100).setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2));
world.createCollider(wall4Collider, wall4Body);
// wall 5
wallMesh5.rotation.y = -Math.PI / 1.85;
wallMesh5.position.set(150, 0, -75);
scene.add(wallMesh5);
const wall5Body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
const wall5Collider = RAPIER.ColliderDesc.cuboid(250, 1.5, 0.5).setTranslation(150, 0, 100).setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 1.85));
world.createCollider(wall5Collider, wall5Body);
// wall 6
wallMesh6.rotation.y = -Math.PI / 8;
wallMesh6.position.set(125, 0, 15);
scene.add(wallMesh6);
const wall6Body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
const wall6Collider = RAPIER.ColliderDesc.cuboid(50, 1.5, 1.5).setTranslation(125, 0, 15).setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 8));
world.createCollider(wall6Collider, wall6Body);

// resize eventlistener
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();    
    renderer.setSize( window.innerWidth, window.innerHeight );
});
const onDocumentKey = (e) => {
    if (e.type === 'keydown') {
        if (e.code === 'ArrowUp') {
            keys.forward = true;
        }
            if (e.code === 'ArrowDown') {
            keys.backward = true;
        }
        if (e.code === 'ArrowLeft') {
            keys.left = true;
        }
        if (e.code === 'ArrowRight') {
            keys.right = true;
        }
        if (e.code === 'KeyR') {
            keys.reset = true;
        }
    }
    if (e.type === 'keyup') {
        if (e.code === 'ArrowUp') {
            keys.forward = false;
        }
            if (e.code === 'ArrowDown') {
            keys.backward = false;
        }
        if (e.code === 'ArrowLeft') {
            keys.left = false;
        }
        if (e.code === 'ArrowRight') {
            keys.right = false;
        }
        if (e.code === 'KeyR') {
            keys.reset = false;
        }
    }
}

// multi eventlistener(s)
document.addEventListener('keydown', onDocumentKey);
document.addEventListener('keyup', onDocumentKey);

// clock
const clock = new THREE.Clock();

// animate stuff
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    stats.update();
    
    // Step the Rapier physics world
    world.step();
    //rapierDebugRenderer.update();  

    // Update dynamicBodies
    if (dynamicBodies.length > 0) {
        for (let i = 0; i < dynamicBodies.length; i++) {
            const mesh = dynamicBodies[i][0];
            const rb = dynamicBodies[i][1];
            const name = dynamicBodies[i][2];

            mesh.position.copy(rb.translation());
            mesh.quaternion.copy(rb.rotation());
            if (name === 'Car') {
                speedOMeter(rb);
                updateCamera(mesh, delta);
                if (keys.reset) {
                    rb.setTranslation( new THREE.Vector3( mesh.position.x, 1, mesh.position.z ) );
                    rb.setRotation( new THREE.Quaternion( 0, 0, 0, 1 ) );
                    rb.setLinvel( new THREE.Vector3( 0, 0, 0 ) );
                    rb.setAngvel( new THREE.Vector3( 0, 0, 0 ) );
                }
            }
        }
    }
    
    let targetVelocity = 0;
    let steerTarget = 0;
    if (wheelFLAxel && wheelFRAxel && wheelRLAxel && wheelRRAxel) {
        // Moving
        if (keys.forward) {
            targetVelocity = 2000;
        }
        else if (keys.backward) {
            targetVelocity = -1000;
        }
        wheelRLAxel.configureMotorVelocity(targetVelocity, 2.0);
        wheelRRAxel.configureMotorVelocity(targetVelocity, 2.0);
    }

    if (wheelFLSteer && wheelFRSteer) {
        if (keys.left) {
            steerTarget += 0.6;
        }
        else if (keys.right) {
            steerTarget -= 0.6;
        }
        wheelFLSteer.configureMotorPosition(steerTarget, 1000, 40);
        wheelFRSteer.configureMotorPosition(steerTarget, 1000, 40);
    }

    renderer.render( scene, camera );
}

function loadTrack(callback) {
    const loader = new FBXLoader(manager);
    loader.load('assets/track/track.fbx', (fbx) => {
        fbx.scale.set(0.01, 0.01, 0.001);
        fbx.rotation.x = -Math.PI / 2;
        fbx.position.y = 0.1;
        scene.add(fbx);   
        callback();
    });
}

let carPath, wheelFLPath, wheelFRPath, wheelRLPath, wheelRRPath, offsetFL, offsetFR, offsetRL, offsetRR, wheelRadius, wheelWidth, carGeometry, springRestLengthFront, springRestLengthRear, springStiffness, springDamping, springLimits;
const carMass = 1200;
const wheelMass = 40;
const steeringMass = 10;
const suspensionMass = 15;
const wheelFrictionFront = 1.015;
const wheelFrictionRear = 1.025;


function loadCar(num, carPos) {
    switch (num) {
        case 1:
        carPath = cars.car1.body;
        wheelFLPath = cars.car1.wheelFL;
        wheelFRPath = cars.car1.wheelFR;
        wheelRLPath = cars.car1.wheelRL;
        wheelRRPath = cars.car1.wheelRR;
        offsetFL = cars.car1.offsetFL;
        offsetFR = cars.car1.offsetFR;
        offsetRL = cars.car1.offsetRL;
        offsetRR = cars.car1.offsetRR;
        springRestLengthFront = cars.car1.frontRestLength;
        springRestLengthRear = cars.car1.rearRestLength;
        springStiffness = cars.car1.stiffness;
        springDamping = cars.car1.damping;
        springLimits = cars.car1.limits;
        wheelRadius = cars.car1.wheelRadius;
        wheelWidth = cars.car1.wheelWidth;
        carGeometry = cars.car1.geometry;
        break;
        case 2:
        carPath = cars.car2.body;
        wheelFLPath = cars.car2.wheelFL;
        wheelFRPath = cars.car2.wheelFR;
        wheelRLPath = cars.car2.wheelRL;
        wheelRRPath = cars.car2.wheelRR;
        offsetFL = cars.car2.offsetFL;
        offsetFR = cars.car2.offsetFR;
        offsetRL = cars.car2.offsetRL;
        offsetRR = cars.car2.offsetRR;
        springRestLengthFront = cars.car2.frontRestLength;
        springRestLengthRear = cars.car2.rearRestLength;
        springStiffness = cars.car2.stiffness;
        springDamping = cars.car2.damping;
        springLimits = cars.car2.limits;
        wheelRadius = cars.car2.wheelRadius;
        wheelWidth = cars.car2.wheelWidth;
        carGeometry = cars.car2.geometry;
        break;
        case 4:
        carPath = cars.car4.body;
        wheelFLPath = cars.car4.wheelFL;
        wheelFRPath = cars.car4.wheelFR;
        wheelRLPath = cars.car4.wheelRL;
        wheelRRPath = cars.car4.wheelRR;
        offsetFL = cars.car4.offsetFL;
        offsetFR = cars.car4.offsetFR;
        offsetRL = cars.car4.offsetRL;
        offsetRR = cars.car4.offsetRR;
        springRestLengthFront = cars.car4.frontRestLength;
        springRestLengthRear = cars.car4.rearRestLength;
        springStiffness = cars.car4.stiffness;
        springDamping = cars.car4.damping;
        springLimits = cars.car4.limits;
        wheelRadius = cars.car4.wheelRadius;
        wheelWidth = cars.car4.wheelWidth;
        carGeometry = cars.car4.geometry;
        break;
        case 10:
        carPath = cars.car10.body;
        wheelFLPath = cars.car10.wheelFL;
        wheelFRPath = cars.car10.wheelFR;
        wheelRLPath = cars.car10.wheelRL;
        wheelRRPath = cars.car10.wheelRR;
        offsetFL = cars.car10.offsetFL;
        offsetFR = cars.car10.offsetFR;
        offsetRL = cars.car10.offsetRL;
        offsetRR = cars.car10.offsetRR;
        springRestLengthFront = cars.car10.frontRestLength;
        springRestLengthRear = cars.car10.rearRestLength;
        springStiffness = cars.car10.stiffness;
        springDamping = cars.car10.damping;
        springLimits = cars.car10.limits;
        wheelRadius = cars.car10.wheelRadius;
        wheelWidth = cars.car10.wheelWidth;
        carGeometry = cars.car10.geometry;
        break;
        default:
        break;
    }
    
    const loader = new FBXLoader(manager);            
    loader.load(carPath, (fbx) => {
        fbx.scale.setScalar(0.005);
        fbx.position.copy(carPos);
        scene.add(fbx);

        fbx.add(followTarget);

        let carRigidBody;

        // Wait a frame to ensure transforms are updated
        fbx.updateMatrixWorld(true);

        const carColliderDesc = RAPIER.ColliderDesc.cuboid(carGeometry.x, carGeometry.y, carGeometry.z).setMass(carMass).setCollisionGroups(131073);
            
        carRigidBody = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(carPos.x, carPos.y, carPos.z));

        world.createCollider(carColliderDesc, carRigidBody);

        dynamicBodies.push([fbx, carRigidBody, 'Car']);
        
        // Load wheels as child meshes
        const wheels = [
            { index: 1, name: 'FL', path: wheelFLPath, offset: offsetFL },
            { index: 1, name: 'FR', path: wheelFRPath, offset: offsetFR },
            { index: -1, name: 'RL', path: wheelRLPath, offset: offsetRL },
            { index: -1, name: 'RR', path: wheelRRPath, offset: offsetRR },
        ];

        for (const wheel of wheels) {
            loader.load(wheel.path, (wfbx) => {
                // ------------------------------
                // FRONT LEFT (FL) WHEEL
                // ------------------------------
                if (wheel.name === 'FL') {
                    wfbx.scale.setScalar(0.005);
                    scene.add(wfbx);

                    // 1) WHEEL BODY
                    const wheelColliderDesc = RAPIER.ColliderDesc.cylinder(wheelWidth, wheelRadius)
                        .setMass(wheelMass)
                        .setRestitution(0.01)
                        .setFriction(wheelFrictionFront)
                        .setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2))
                        .setCollisionGroups(262145);

                    const wheelRigidBody = world.createRigidBody(
                        RAPIER.RigidBodyDesc.dynamic().setTranslation(
                            carPos.x + wheel.offset.x,
                            carPos.y + wheel.offset.y,
                            carPos.z + wheel.offset.z
                        )
                    );

                    world.createCollider(wheelColliderDesc, wheelRigidBody);
                    dynamicBodies.push([wfbx, wheelRigidBody, 'FL']);

                    // 2) SUSPENSION BODY
                    const suspensionBody = world.createRigidBody(
                        RAPIER.RigidBodyDesc.dynamic()
                            .setTranslation(
                                carPos.x + wheel.offset.x,
                                carPos.y + wheel.offset.y,
                                carPos.z + wheel.offset.z
                            )
                            .setLinearDamping(4)
                            .setAngularDamping(4)
                    );

                    world.createCollider(
                        RAPIER.ColliderDesc.ball(0.25).setMass(suspensionMass).setCollisionGroups(0),
                        suspensionBody
                    );

                    // 3) STEERING BODY
                    const steerBody = world.createRigidBody(
                        RAPIER.RigidBodyDesc.dynamic()
                            .setTranslation(
                                carPos.x + wheel.offset.x,
                                carPos.y + wheel.offset.y,
                                carPos.z + wheel.offset.z
                            )
                            .setLinearDamping(4)
                            .setAngularDamping(4)
                    );

                    world.createCollider(
                        RAPIER.ColliderDesc.ball(0.20).setMass(steeringMass).setCollisionGroups(0),
                        steerBody
                    );

                    // ------------ JOINTS ---------------

                    // A) Jousi: CAR → SUSPENSION body
                    const springJoint = RAPIER.JointData.prismatic(
                        { x: wheel.offset.x, y: wheel.offset.y, z: wheel.offset.z },
                        { x: 0, y: 0, z: 0 },
                        { x: 0, y: 1, z: 0 }
                    );

                    springJoint.limitsEnabled = true;
                    springJoint.limits = springLimits;

                    const spring = world.createImpulseJoint(
                        springJoint,
                        carRigidBody,
                        suspensionBody
                    );

                    spring.configureMotorPosition(
                        springRestLengthFront,
                        springStiffness,
                        springDamping
                    );

                    // B) Steerausnivel: SUSPENSION → STEER body (revolute around Y)
                    const steerJoint = RAPIER.JointData.revolute(
                        { x: 0, y: 0, z: 0 },
                        { x: 0, y: 0, z: 0 },
                        { x: 0, y: 1, z: 0 }  // y-akseli = kääntö
                    );

                    const steer = world.createImpulseJoint(
                        steerJoint,
                        suspensionBody,
                        steerBody
                    );

                    steer.configureMotorModel(RAPIER.MotorModel.ForceBased);
                    wheelFLSteer = steer;       // talteen kääntömoottoria varten
                    
                    // C) Akseliratas: STEER body → WHEEL body (revolute around X)
                    const axleJoint = RAPIER.JointData.revolute(
                        { x: 0, y: 0, z: 0 },
                        { x: 0, y: 0, z: 0 },
                        { x: 1, y: 0, z: 0 }  // x-akseli
                    );

                    wheelFLAxel = world.createImpulseJoint(
                        axleJoint,
                        steerBody,
                        wheelRigidBody
                    );
                }
                // ------------------------------
                // FRONT RIGHT (FR) WHEEL
                // ------------------------------
                else if (wheel.name === 'FR') {
                    wfbx.scale.setScalar(0.005);
                    scene.add(wfbx);

                    // 1) WHEEL BODY
                    const wheelColliderDesc = RAPIER.ColliderDesc.cylinder(wheelWidth, wheelRadius)
                        .setMass(wheelMass)
                        .setRestitution(0.01)
                        .setFriction(wheelFrictionFront)
                        .setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2))
                        .setCollisionGroups(262145);

                    const wheelRigidBody = world.createRigidBody(
                        RAPIER.RigidBodyDesc.dynamic().setTranslation(
                            carPos.x + wheel.offset.x,
                            carPos.y + wheel.offset.y,
                            carPos.z + wheel.offset.z
                        )
                    );

                    world.createCollider(wheelColliderDesc, wheelRigidBody);
                    dynamicBodies.push([wfbx, wheelRigidBody, 'FR']);

                    // 2) SUSPENSION BODY
                    const suspensionBody = world.createRigidBody(
                        RAPIER.RigidBodyDesc.dynamic()
                            .setTranslation(
                                carPos.x + wheel.offset.x,
                                carPos.y + wheel.offset.y,
                                carPos.z + wheel.offset.z
                            )
                            .setLinearDamping(4)
                            .setAngularDamping(4)
                    );

                    world.createCollider(
                        RAPIER.ColliderDesc.ball(0.25).setMass(suspensionMass).setCollisionGroups(0),
                        suspensionBody
                    );

                    // 3) STEERING BODY
                    const steerBody = world.createRigidBody(
                        RAPIER.RigidBodyDesc.dynamic()
                            .setTranslation(
                                carPos.x + wheel.offset.x,
                                carPos.y + wheel.offset.y,
                                carPos.z + wheel.offset.z
                            )
                            .setLinearDamping(4)
                            .setAngularDamping(4)
                    );

                    world.createCollider(
                        RAPIER.ColliderDesc.ball(0.20).setMass(steeringMass).setCollisionGroups(0),
                        steerBody
                    );

                    // ------------ JOINTS ---------------

                    // A) Jousi: CAR → SUSPENSION body
                    const springJoint = RAPIER.JointData.prismatic(
                        { x: wheel.offset.x, y: wheel.offset.y, z: wheel.offset.z },
                        { x: 0, y: 0, z: 0 },
                        { x: 0, y: 1, z: 0 }
                    );

                    springJoint.limitsEnabled = true;
                    springJoint.limits = springLimits;

                    const spring = world.createImpulseJoint(
                        springJoint,
                        carRigidBody,
                        suspensionBody
                    );

                    spring.configureMotorPosition(
                        springRestLengthFront,
                        springStiffness,
                        springDamping
                    );

                    // B) Steerausnivel: SUSPENSION → STEER body (revolute around Y)
                    const steerJoint = RAPIER.JointData.revolute(
                        { x: 0, y: 0, z: 0 },
                        { x: 0, y: 0, z: 0 },
                        { x: 0, y: 1, z: 0 }  // y-akseli = kääntö
                    );

                    const steer = world.createImpulseJoint(
                        steerJoint,
                        suspensionBody,
                        steerBody
                    );

                    steer.configureMotorModel(RAPIER.MotorModel.ForceBased);
                    wheelFRSteer = steer;       // talteen kääntömoottoria varten

                    // C) Akseliratas: STEER body → WHEEL body (revolute around X)
                    const axleJoint = RAPIER.JointData.revolute(
                        { x: 0, y: 0, z: 0 },
                        { x: 0, y: 0, z: 0 },
                        { x: 1, y: 0, z: 0 }  // x-akseli
                    );

                    wheelFRAxel = world.createImpulseJoint(
                        axleJoint,
                        steerBody,
                        wheelRigidBody
                    );
                }
                // ------------------------------
                // REAR LEFT (RL) WHEEL
                // ------------------------------
                else if (wheel.name === 'RL') {
                    wfbx.scale.setScalar(0.005);
                    scene.add(wfbx);

                    // Wheel setup
                    const wheelColliderDesc = RAPIER.ColliderDesc.cylinder(wheelWidth, wheelRadius)
                        .setMass(wheelMass)
                        .setRestitution(0.01)
                        .setFriction(wheelFrictionRear)
                        .setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2))
                        .setCollisionGroups(262145); // The wheels collide with the floor only
                    const wheelRigidBody = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
                        .setTranslation(carPos.x + wheel.offset.x, carPos.y + wheel.offset.y, carPos.z + wheel.offset.z));  

                    world.createCollider(wheelColliderDesc, wheelRigidBody);

                    dynamicBodies.push([wfbx, wheelRigidBody, 'RL']);

                    const wheel_joint = RAPIER.JointData.revolute(
                        { x: 0, y: 0, z: 0 },
                        { x: 0, y: 0, z: 0 },
                        { x: 1, y: 0, z: 0 }
                    );

                    // Suspension setup
                    const suspensionBodyDesc = RAPIER.RigidBodyDesc.dynamic()
                        .setTranslation(carPos.x + wheel.offset.x,
                                        carPos.y + wheel.offset.y,
                                        carPos.z + wheel.offset.z)
                        .setLinearDamping(4)
                        .setAngularDamping(4);

                    const suspensionRigidBody = world.createRigidBody(suspensionBodyDesc);

                    world.createCollider(
                        RAPIER.ColliderDesc.ball(0.2)     // huom! EI 0.01!
                            .setMass(suspensionMass)                 // jousirungolla oltava massaa
                            .setCollisionGroups(0),
                        suspensionRigidBody
                    );

                    const suspension_joint = RAPIER.JointData.prismatic(
                        { x: wheel.offset.x, y: wheel.offset.y, z: wheel.offset.z },
                        { x: 0, y: 0, z: 0 },
                        { x: 0, y: 1, z: 0 }
                    );
                    
                    suspension_joint.limitsEnabled = true;
                    suspension_joint.limits = springLimits;
                                        
                    // Create joint connections
                    // 1. Jousi kiinnittyy CAR → SUSPENSIONRIGIDBODY
                    const spring_joint = world.createImpulseJoint(
                        suspension_joint,
                        carRigidBody,
                        suspensionRigidBody
                    );

                    // 2. Pyöräakseli kiinnittyy SUSPENSIONRIGIDBODY → WHEELRIGIDBODY
                    wheelRLAxel = world.createImpulseJoint(
                        wheel_joint,
                        suspensionRigidBody,
                        wheelRigidBody
                    );

                    spring_joint.configureMotorPosition(springRestLengthRear, springStiffness, springDamping);
                }
                // ------------------------------
                // REAR RIGHT (RR) WHEEL
                // ------------------------------
                else if (wheel.name === 'RR') {
                    wfbx.scale.setScalar(0.005);
                    scene.add(wfbx);

                    // Wheel setup
                    const wheelColliderDesc = RAPIER.ColliderDesc.cylinder(wheelWidth, wheelRadius)
                        .setMass(wheelMass)
                        .setRestitution(0.01)
                        .setFriction(wheelFrictionRear)
                        .setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2))
                        .setCollisionGroups(262145); // The wheels collide with the floor only
                    const wheelRigidBody = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
                        .setTranslation(carPos.x + wheel.offset.x, carPos.y + wheel.offset.y, carPos.z + wheel.offset.z));  

                    world.createCollider(wheelColliderDesc, wheelRigidBody);

                    dynamicBodies.push([wfbx, wheelRigidBody, 'RR']);

                    const wheel_joint = RAPIER.JointData.revolute(
                        { x: 0, y: 0, z: 0 },
                        { x: 0, y: 0, z: 0 },
                        { x: 1, y: 0, z: 0 }
                    );

                    // Suspension setup
                    const suspensionBodyDesc = RAPIER.RigidBodyDesc.dynamic()
                        .setTranslation(carPos.x + wheel.offset.x,
                                        carPos.y + wheel.offset.y,
                                        carPos.z + wheel.offset.z)
                        .setLinearDamping(4)
                        .setAngularDamping(4);

                    const suspensionRigidBody = world.createRigidBody(suspensionBodyDesc);

                    world.createCollider(
                        RAPIER.ColliderDesc.ball(0.2)     // huom! EI 0.01!
                            .setMass(suspensionMass)                 // jousirungolla oltava massaa
                            .setCollisionGroups(0),
                        suspensionRigidBody
                    );

                    const suspension_joint = RAPIER.JointData.prismatic(
                        { x: wheel.offset.x, y: wheel.offset.y, z: wheel.offset.z },
                        { x: 0, y: 0, z: 0 },
                        { x: 0, y: 1, z: 0 }
                    );
                    
                    suspension_joint.limitsEnabled = true;
                    suspension_joint.limits = springLimits;
                                        
                    // Create joint connections
                    // 1. Jousi kiinnittyy CAR → SUSPENSIONRIGIDBODY
                    const spring_joint = world.createImpulseJoint(
                        suspension_joint,
                        carRigidBody,
                        suspensionRigidBody
                    );

                    // 2. Pyöräakseli kiinnittyy SUSPENSIONRIGIDBODY → WHEELRIGIDBODY
                    wheelRRAxel = world.createImpulseJoint(
                        wheel_joint,
                        suspensionRigidBody,
                        wheelRigidBody
                    );

                    spring_joint.configureMotorPosition(springRestLengthRear, springStiffness, springDamping);
                }
            });
        }
        
        
        
    });
}

function speedOMeter(rigidBody) {
    const linvel = rigidBody.linvel();
    const speedMs = Math.hypot(linvel.x, linvel.y, linvel.z);
    const speedKmh = speedMs * 3.6;

    document.getElementById('speedometer').innerText =
        `${speedKmh.toFixed(0)} km/h`;
}

function updateCamera(car, delta) {  
    
    // --- SMOOTH POSITION ---
    const targetPos = new THREE.Vector3();
    car.getWorldPosition(targetPos);
    pivot.position.lerp(targetPos, delta * 5);


    // --- AUTON WORLD ROTATION ---
    const carQuat = new THREE.Quaternion();
    const carEuler = new THREE.Euler(0, 0, 0, "YXZ");

    car.getWorldQuaternion(carQuat);
    carEuler.setFromQuaternion(carQuat, "YXZ");

    const carRotY = carEuler.y;


    // --- SMOOTH YAW (SHORT ANGLE) ---
    yaw.rotation.y = shortestAngleLerp(
        yaw.rotation.y,
        carRotY,
        delta * 5
    );
}

function shortestAngleLerp(a, b, t) {
    let diff = b - a;
    diff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
    return a + diff * t;
}

// Class RapierDebugRenderer
// =========================
class RapierDebugRenderer {
    constructor() {
        this.mesh = new THREE.LineSegments(
            new THREE.BufferGeometry(),
            new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true })
        );
        this.mesh.frustumCulled = false;
        scene.add(this.mesh);
    }

    update() {
        const { vertices, colors } = world.debugRender();
        if (!vertices || vertices.length === 0) return;

        // Verify vertex data is valid
        let valid = true;
        for (let i = 0; i < vertices.length; i++) {
            if (!Number.isFinite(vertices[i])) {
                valid = false;
                break;
            }
        }
        if (!valid) return;

        // Dispose previous geometry safely
        this.mesh.geometry.dispose();
        this.mesh.geometry = new THREE.BufferGeometry();
        this.mesh.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this.mesh.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4));
    }
}

// Function Calls
// ==============
function startGame() {
    loadTrack(() => {
        loadCar(car_number, new THREE.Vector3(0, 0.55, 0)); // Loads car number and set its position on world
    });
}

//const rapierDebugRenderer = new RapierDebugRenderer();

animate();