import RAPIER from '@dimforge/rapier3d-compat';

export { RAPIER };
export let physicsWorld: RAPIER.World;
export const bodyMap = new Map<number, any>();

export async function initPhysics() {
    await RAPIER.init();
    const gravity = { x: 0.0, y: -9.81, z: 0.0 };
    physicsWorld = new RAPIER.World(gravity);
    console.log("Rapier3D Physics initialized successfully.");
}
