import * as THREE from "three";

export let renderer: THREE.WebGLRenderer;
export let scene: THREE.Scene;
export let camera: THREE.PerspectiveCamera;
export let enemyCamera: THREE.PerspectiveCamera;
export let dirLight: THREE.DirectionalLight;
export let ambientLight: THREE.AmbientLight;
export let skyUniforms: any;
export let skyMesh: THREE.Mesh;

export const meshMap = new Map<
  number,
  THREE.Mesh | THREE.Group | THREE.Object3D
>();

export function initGraphics() {
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.autoClear = false;

    scene = new THREE.Scene();
    // Aumentando a distância de visão (far) para não cortar o terreno abruptamente
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      5000,
    );

    enemyCamera = new THREE.PerspectiveCamera(
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

  // Setup Skybox Uniforms and Shader
  skyUniforms = {
    tDay: { value: null },
    tNight: { value: null },
    blend: { value: 0.0 },
  };

  const skyGeo = new THREE.SphereGeometry(4000, 32, 15);
  const skyMat = new THREE.ShaderMaterial({
    uniforms: skyUniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        // Centraliza o céu na câmera (opcional se a câmera não sair de 0,0,0, mas vamos manter na posição fixa)
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDay;
      uniform sampler2D tNight;
      uniform float blend;
      varying vec2 vUv;

      // Função simples para decodificar sRGB se necessário
      vec4 sRGBToLinear( in vec4 value ) {
        return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
      }

      void main() {
        vec4 cDay = texture2D(tDay, vUv);
        vec4 cNight = texture2D(tNight, vUv);
        
        // As texturas HDR carregadas geralmente precisam de ajuste.
        // O Three.js faz isso automaticamente para scene.background, mas no shader customizado
        // podemos apenas misturá-las diretamente.
        vec4 color = mix(cDay, cNight, blend);
        
        gl_FragColor = color;
      }
    `,
    side: THREE.BackSide,
    depthWrite: false,
  });

  skyMesh = new THREE.Mesh(skyGeo, skyMat);
  scene.add(skyMesh);

  // Load Textures
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("/hdr/day.png", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    skyUniforms.tDay.value = texture;
    // Set environment map to day by default
    scene.environment = texture;
  });

  textureLoader.load("/hdr/night.png", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    skyUniforms.tNight.value = texture;
  });

  ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
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
