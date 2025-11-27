import * as THREE from 'three';
export const cars = {
    car1: // Dodge Charger (RWD)
    {   body: './assets/cars/car1/Car_1_Body.FBX',
        wheelFL: './assets/cars/car1/Car_1_Front_Left_Wheel.FBX',
        wheelFR: './assets/cars/car1/Car_1_Front_Right_Wheel.FBX',
        wheelRL: './assets/cars/car1/Car_1_Rear_Left_Wheel.FBX',
        wheelRR: './assets/cars/car1/Car_1_Rear_Right_Wheel.FBX',
        offsetFL: new THREE.Vector3(0.4, -0.2, 0.835),
        offsetFR: new THREE.Vector3(-0.4, -0.2, 0.835),
        offsetRL: new THREE.Vector3(0.4, -0.2, -0.74),
        offsetRR: new THREE.Vector3(-0.4, -0.2, -0.74),
        wheelRadius: 0.18,
        wheelWidth: 0.075,
        geometry: new THREE.Vector3(0.5, 0.25, 1.3)
    },
    car2: // Bugatti Chiron (RWD)
    {   body: './assets/cars/car2/Car_2_Body.FBX',
        wheelFL: './assets/cars/car2/Car_2_Front_Left_Wheel.FBX',
        wheelFR: './assets/cars/car2/Car_2_Front_Right_Wheel.FBX',
        wheelRL: './assets/cars/car2/Car_2_Rear_Left_Wheel.FBX',
        wheelRR: './assets/cars/car2/Car_2_Rear_Right_Wheel.FBX',
        offsetFL: new THREE.Vector3(0.525, -0.15, 0.755),
        offsetFR: new THREE.Vector3(-0.525, -0.15, 0.755),
        offsetRL: new THREE.Vector3(0.525, -0.15, -0.885),
        offsetRR: new THREE.Vector3(-0.525, -0.15, -0.885),
        wheelRadius: 0.18,
        wheelWidth: 0.075,
        geometry: new THREE.Vector3(0.6, 0.25, 1.3)
    },
    car4: // Porche 911 (RWD)
    {   body: './assets/cars/car4/Car_4_Body.FBX',
        wheelFL: './assets/cars/car4/Car_4_Front_Left_Wheel.FBX',
        wheelFR: './assets/cars/car4/Car_4_Front_Right_Wheel.FBX',
        wheelRL: './assets/cars/car4/Car_4_Rear_Left_Wheel.FBX',
        wheelRR: './assets/cars/car4/Car_4_Rear_Right_Wheel.FBX',
        offsetFL: new THREE.Vector3(0.425, -0.175, 0.7),
        offsetFR: new THREE.Vector3(-0.425, -0.175, 0.7),
        offsetRL: new THREE.Vector3(0.425, -0.175, -0.655),
        offsetRR: new THREE.Vector3(-0.425, -0.175, -0.655),
        wheelRadius: 0.18,
        wheelWidth: 0.075,
        geometry: new THREE.Vector3(0.5, 0.25, 1.2)
    },
    car10: // BMW M5 (RWD)
    {   body: './assets/cars/car10/Car_10_Body.FBX',
        wheelFL: './assets/cars/car10/Car_10_Front_Left_Wheel.FBX',
        wheelFR: './assets/cars/car10/Car_10_Front_Right_Wheel.FBX',
        wheelRL: './assets/cars/car10/Car_10_Rear_Left_Wheel.FBX',
        wheelRR: './assets/cars/car10/Car_10_Rear_Right_Wheel.FBX',
        offsetFL: new THREE.Vector3(0.4, -0.22, 0.81),
        offsetFR: new THREE.Vector3(-0.4, -0.22, 0.81),
        offsetRL: new THREE.Vector3(0.4, -0.22, -0.7),
        offsetRR: new THREE.Vector3(-0.4, -0.22, -0.7),
        wheelRadius: 0.18,
        wheelWidth: 0.075,
        geometry: new THREE.Vector3(0.5, 0.25, 1.2)
    }
};