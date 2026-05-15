import * as THREE from 'three';
import { camera, game_status, manager } from './main.js';
import { chassis } from './car.js';

var engine_sound;
var playing_sound = false;

export function load_sounds() {
    const audio_loader = new THREE.AudioLoader(manager);
    const listener = new THREE.AudioListener();
    camera.add(listener);
    const sound = new THREE.Audio(listener);
    // engine sound
    audio_loader.load('assets/sfx/engine.mp3', function (buffer) {
        sound.setBuffer(buffer);
        engine_sound = sound;
        engine_sound.setLoop(true);
    });
}

export function update_engine_sound(speed) {
    if (!engine_sound) return;
    if (game_status.sounds) {
        if (!playing_sound && chassis.translation().y > -10) {
            engine_sound.play();
            playing_sound = true;
        }
        
    }
    else
    {
        if (playing_sound || chassis.translation().y < -10) {
            engine_sound.stop();
            playing_sound = false;
        }        
    }
    engine_sound.setDetune(speed * 5);
}