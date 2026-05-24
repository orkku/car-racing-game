import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene, manager, game_status } from './main.js';
import { car } from './car.js';

const lap_time = document.getElementById('displaycurrenttime');
const best_time = document.getElementById('displaybesttime');
var display_current_lap = 'Current: 0:0.000', display_best_lap = 'Best: 0:0.000';
var time = 0, ms = 0, seconds = 0, minutes = 0, hours = 0;
var best_lap = 0, current_lap = 0;
var finish, checkpoint;
var finish_previousDot = 0;
var finish_lastTrigger = 0;
var checkpoint_previousDot = 0;
var checkpoint_lastTrigger = 0;
const finishNormal = new THREE.Vector3(0, 0, 1);
const checkpointNormal = new THREE.Vector3(0, 0, 1);

const clock = new THREE.Clock(true);

export function load_track() {

    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader(manager);
        loader.load('assets/track/track.glb', (gltf) => {
                const track = gltf.scene;
                track.position.y = 0.1;
                track.traverse((object) => {
                    if (object.isMesh) {
                        object.userData.physics = { mass: 0 };
                    }
                });
                scene.add(track);
                track.updateMatrixWorld(true);
                resolve(track);
            },
            undefined,
            reject
        );

        // finish line
        finish = new THREE.Mesh(
            new THREE.BoxGeometry(21, 5, 0.5),
            new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                visible: false
            })
        );
        finish.position.set(-96.5, 2.5, 20.5);
        finish.rotateY(Math.PI / 180 * 60);
        scene.add(finish);

        // checkpoint
        checkpoint = new THREE.Mesh(
            new THREE.BoxGeometry(30, 5, 0.5),
            new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                visible: false
            })
        );
        checkpoint.position.set(14, 2.5, -125);
        checkpoint.rotateY(Math.PI / 180 * -25);
        scene.add(checkpoint);
    });
}

export function update_laps() {
    const now = performance.now();
    finishNormal.set(0, 0, 1);
    finishNormal.applyQuaternion(finish.quaternion);
    const toCar = new THREE.Vector3();
    toCar.subVectors(car.position, finish.position);
    const dot = toCar.dot(finishNormal);
    const distance = car.position.distanceTo(finish.position);
    if (finish_previousDot < 0 && dot >= 0 && distance < 12) {
        if (now - finish_lastTrigger > 1500) {
            finish_lastTrigger = now;
            reset_time();
            game_status.check_point = false;
        }
    }
    finish_previousDot = dot;
}

export function update_checkpoints() {
    const now = performance.now();
    checkpointNormal.set(0, 0, 1);
    checkpointNormal.applyQuaternion(checkpoint.quaternion);
    const toCar = new THREE.Vector3();
    toCar.subVectors(car.position, checkpoint.position);
    const dot = toCar.dot(checkpointNormal);
    const distance = car.position.distanceTo(checkpoint.position);
    if (checkpoint_previousDot < 0 && dot >= 0 && distance < 12) {
        if (now - checkpoint_lastTrigger > 1500) {
            checkpoint_lastTrigger = now;
            game_status.check_point = true;
        }
    }
    checkpoint_previousDot = dot;
}

export function update_clock() {
    if (clock.running) {
        time = clock.getElapsedTime();
        ms = String(Math.floor((time % 1) * 1000)).padStart(3, '0');
        seconds = Math.floor(time % 60);
        minutes = Math.floor(time / 60);
        hours = Math.floor(time / 3600);
        display_current_lap = `Current: ${hours}:${minutes}:${seconds}.${ms}`;
        lap_time.innerHTML = display_current_lap;
    }
}

function reset_time() {
    if (game_status.check_point) {
        var ms2 = 0;
        var seconds2 = 0;
        var minutes2 = 0;
        var hours2 = 0;
        clock.stop();
        current_lap = time;
        if (best_lap === 0) {
            best_lap = current_lap;
        }
        else if (current_lap < best_lap) {
            best_lap = current_lap;
        }
        ms2 = String(Math.floor((best_lap % 1) * 1000)).padStart(3, '0');
        seconds2 = Math.floor(best_lap % 60);
        minutes2 = Math.floor(best_lap / 60);
        display_best_lap = `Best: ${hours2}:${minutes2}:${seconds2}.${ms2}`;
        best_time.innerHTML = display_best_lap;
        clock.startTime = 0;
        clock.start();
    }
}