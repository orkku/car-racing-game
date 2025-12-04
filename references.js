import * as THREE from 'three';
export const cars = {
    car1: // Dodge Charger
    {   body: 'assets/cars/car1/Car_1_Body.FBX',
        wheelFL: 'assets/cars/car1/Car_1_Front_Left_Wheel.FBX',
        wheelFR: 'assets/cars/car1/Car_1_Front_Right_Wheel.FBX',
        wheelRL: 'assets/cars/car1/Car_1_Rear_Left_Wheel.FBX',
        wheelRR: 'assets/cars/car1/Car_1_Rear_Right_Wheel.FBX',
        offsetFL: new THREE.Vector3(0.4, -0.2, 0.835),
        offsetFR: new THREE.Vector3(-0.4, -0.2, 0.835),
        offsetRL: new THREE.Vector3(0.4, -0.2, -0.74),
        offsetRR: new THREE.Vector3(-0.4, -0.2, -0.74),
        frontRestLength: -0.02,   // jousituksen lepopituus
        rearRestLength: -0.01,   // jousituksen lepopituus
        stiffness: 10000,    // jousivakio
        damping: 40,       // vaimennus
        limits: {min: -0.07, max: 0.04},
        wheelRadius: 0.18,
        wheelWidth: 0.075,
        geometry: new THREE.Vector3(0.5, 0.25, 1.3)
    },
    car2: // Bugatti Chiron (AWD)
    {   body: 'assets/cars/car2/Car_2_Body.FBX',
        wheelFL: 'assets/cars/car2/Car_2_Front_Left_Wheel.FBX',
        wheelFR: 'assets/cars/car2/Car_2_Front_Right_Wheel.FBX',
        wheelRL: 'assets/cars/car2/Car_2_Rear_Left_Wheel.FBX',
        wheelRR: 'assets/cars/car2/Car_2_Rear_Right_Wheel.FBX',
        offsetFL: new THREE.Vector3(0.525, -0.15, 0.755),
        offsetFR: new THREE.Vector3(-0.525, -0.15, 0.755),
        offsetRL: new THREE.Vector3(0.525, -0.15, -0.885),
        offsetRR: new THREE.Vector3(-0.525, -0.15, -0.885),
        frontRestLength: -0.02,   // jousituksen lepopituus
        rearRestLength: -0.01,   // jousituksen lepopituus
        stiffness: 10000,    // jousivakio
        damping: 40,       // vaimennus
        limits: {min: -0.07, max: 0.05},
        wheelRadius: 0.18,
        wheelWidth: 0.075,
        geometry: new THREE.Vector3(0.6, 0.25, 1.3)
    },
    car4: // Porche 911 (RWD)
    {   body: 'assets/cars/car4/Car_4_Body.FBX',
        wheelFL: 'assets/cars/car4/Car_4_Front_Left_Wheel.FBX',
        wheelFR: 'assets/cars/car4/Car_4_Front_Right_Wheel.FBX',
        wheelRL: 'assets/cars/car4/Car_4_Rear_Left_Wheel.FBX',
        wheelRR: 'assets/cars/car4/Car_4_Rear_Right_Wheel.FBX',
        offsetFL: new THREE.Vector3(0.425, -0.175, 0.7),
        offsetFR: new THREE.Vector3(-0.425, -0.175, 0.7),
        offsetRL: new THREE.Vector3(0.425, -0.175, -0.655),
        offsetRR: new THREE.Vector3(-0.425, -0.175, -0.655),
        frontRestLength: -0.015,   // jousituksen lepopituus
        rearRestLength: 0.01,   // jousituksen lepopituus
        stiffness: 10000,    // jousivakio
        damping: 40,       // vaimennus
        limits: {min: -0.065, max: 0.06},
        wheelRadius: 0.18,
        wheelWidth: 0.075,
        geometry: new THREE.Vector3(0.5, 0.25, 1.2)
    },
    car10: // BMW M5 (RWD)
    {   body: 'assets/cars/car10/Car_10_Body.FBX',
        wheelFL: 'assets/cars/car10/Car_10_Front_Left_Wheel.FBX',
        wheelFR: 'assets/cars/car10/Car_10_Front_Right_Wheel.FBX',
        wheelRL: 'assets/cars/car10/Car_10_Rear_Left_Wheel.FBX',
        wheelRR: 'assets/cars/car10/Car_10_Rear_Right_Wheel.FBX',
        offsetFL: new THREE.Vector3(0.4, -0.22, 0.81),
        offsetFR: new THREE.Vector3(-0.4, -0.22, 0.81),
        offsetRL: new THREE.Vector3(0.4, -0.22, -0.7),
        offsetRR: new THREE.Vector3(-0.4, -0.22, -0.7),
        frontRestLength: -0.01,   // jousituksen lepopituus
        rearRestLength: 0,   // jousituksen lepopituus
        stiffness: 10000,    // jousivakio
        damping: 40,       // vaimennus
        limits: {min: -0.06, max: 0.05},
        wheelRadius: 0.18,
        wheelWidth: 0.075,
        geometry: new THREE.Vector3(0.5, 0.25, 1.2)
    }
};