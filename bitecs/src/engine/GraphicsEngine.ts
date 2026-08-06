import * as THREE from "three";

export let renderer: THREE.WebGLRenderer;
export let scene: THREE.Scene;
export let camera: THREE.PerspectiveCamera;

export const meshMap = new Map<
  number,
  THREE.Mesh | THREE.Group | THREE.Object3D
>();
export let dirLight: THREE.DirectionalLight;

export function initGraphics() {
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene = new THREE.Scene();
    // Aumentando a distância de visão (far) para não cortar o terreno abruptamente
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      5000,
    );

    // Adicionando Fog (Névoa) para fazer o terreno desaparecer suavemente no horizonte
    const fogColor = new THREE.Color(0xaaccff); // Azul claro combinando com o céu
    scene.fog = new THREE.FogExp2(fogColor, 0.0015);
  }

  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }

  // Load Skybox
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("/hdr/citrus_orchard_road_puresky.webp", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    scene.background = texture;
    scene.environment = texture;
  });

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
  dirLight.position.set(50, 100, 50);
  dirLight.castShadow = true;

  // Configura a câmera de sombra (area que recebe sombra)
  const d = 100; // Tamanho do quadrado da sombra em volta do avião
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 500;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.bias = -0.0005;

  scene.add(dirLight);
  scene.add(dirLight.target);

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera.position.set(0, 5, 15);
  camera.lookAt(0, 0, 0);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
