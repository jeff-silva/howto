import * as THREE from 'three';
import { addEntity, addComponent, IWorld } from 'bitecs';
import { PositionComponent } from '../components/PositionComponent';
import { RotationComponent } from '../components/RotationComponent';
import { scene, meshMap } from '../engine/GraphicsEngine';
import { RAPIER, physicsWorld, bodyMap } from '../engine/PhysicsEngine';

export function createGroundEntity(world: IWorld) {
    const entity = addEntity(world);
    
    addComponent(world, PositionComponent, entity);
    addComponent(world, RotationComponent, entity);

    const bodyDesc = RAPIER.RigidBodyDesc.fixed();
    const body = physicsWorld.createRigidBody(bodyDesc);
    body.setTranslation({ x: 0.0, y: -0.5, z: 0.0 }, true);
    const colliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.5, 10.0);
    physicsWorld.createCollider(colliderDesc, body);

    bodyMap.set(entity, body);
    
    RotationComponent.x[entity] = 0;
    RotationComponent.y[entity] = 0;
    RotationComponent.z[entity] = 0;
    RotationComponent.w[entity] = 1;

    const geometry = new THREE.BoxGeometry(20.0, 1.0, 20.0);
    const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0.0, -0.5, 0.0);
    scene.add(mesh);
    meshMap.set(entity, mesh);
    
    return entity;
}
