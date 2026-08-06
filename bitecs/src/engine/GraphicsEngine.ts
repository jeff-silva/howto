import * as THREE from 'three';

export let renderer: THREE.WebGLRenderer;
export let scene: THREE.Scene;
export let camera: THREE.PerspectiveCamera;

export const meshMap = new Map<number, THREE.Mesh | THREE.Group | THREE.Object3D>();

export function initGraphics() {
    if(!renderer){
        renderer = new THREE.WebGLRenderer({ antialias: true });
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    }
    
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }

    // Load Skybox
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/hdr/citrus_orchard_road_puresky.webp', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        scene.background = texture;
        scene.environment = texture;
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
