import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene, manager } from './main.js';

var track = new THREE.Object3D();

export async function load_track() {
    const loader = new GLTFLoader(manager);
    // load track
    const model = await loader.loadAsync( 'assets/track/track.glb' );
    track = model.scene;
    track.position.y = 0.1;
    track.traverse((object) => {
        if (object.isMesh) {
            object.userData.physics = { mass: 0 };
        }
    });
    scene.add(track);
}

/*

    */