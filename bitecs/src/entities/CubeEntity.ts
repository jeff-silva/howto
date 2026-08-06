import * as THREE from "three";
import { addEntity, addComponent, IWorld } from "bitecs";
import { PositionComponent } from "../components/PositionComponent";
import { RotationComponent } from "../components/RotationComponent";
import { scene, meshMap } from "../engine/GraphicsEngine";
import { RAPIER, physicsWorld, bodyMap } from "../engine/PhysicsEngine";

export function createCubeEntity(world: IWorld) {
  const entity = addEntity(world);

  addComponent(world, PositionComponent, entity);
  addComponent(world, RotationComponent, entity);

  const bodyDesc = RAPIER.RigidBodyDesc.dynamic();
  const body = physicsWorld.createRigidBody(bodyDesc);
  body.setTranslation({ x: 0.0, y: 15.0, z: 0.0 }, true);
  const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
    .setRestitution(0.3)
    .setRestitutionCombineRule(RAPIER.CoefficientCombineRule.Max);
  physicsWorld.createCollider(colliderDesc, body);
  const randomQuat = new THREE.Quaternion().random();
  body.setRotation(randomQuat, true);

  bodyMap.set(entity, body);

  RotationComponent.x[entity] = randomQuat.x;
  RotationComponent.y[entity] = randomQuat.y;
  RotationComponent.z[entity] = randomQuat.z;
  RotationComponent.w[entity] = randomQuat.w;

  const geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0.0, 15.0, 0.0);
  scene.add(mesh);
  meshMap.set(entity, mesh);

  return entity;
}
