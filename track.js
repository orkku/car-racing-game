import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene, manager } from './main.js';

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
    });
}