// Geometrias e materiais compartilhados (cache) para manter o visual low-poly consistente e leve.

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const geoCache = new Map();
const matCache = new Map();

export function mat(color) {
  const key = String(color);
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, flatShading: false, roughness: 0.65, metalness: 0 });
    matCache.set(key, m);
  }
  return m;
}

function cached(key, make) {
  let g = geoCache.get(key);
  if (!g) { g = make(); geoCache.set(key, g); }
  return g;
}

// Caixa de cantos chanfrados (2 segmentos = facetas visíveis, estilo low-poly).
export function rbox(w, h, d, r = 0.03) {
  const rad = Math.min(r, Math.min(w, h, d) / 2 - 1e-4);
  return cached(`rb:${w}:${h}:${d}:${rad}`, () => new RoundedBoxGeometry(w, h, d, 2, rad));
}

export function sphere(r, ws = 8, hs = 6) {
  return cached(`sp:${r}:${ws}:${hs}`, () => new THREE.SphereGeometry(r, ws, hs));
}

export function cylinder(rTop, rBottom, h, seg = 8) {
  return cached(`cy:${rTop}:${rBottom}:${h}:${seg}`, () => new THREE.CylinderGeometry(rTop, rBottom, h, seg));
}

// Esfera suave para a cabeça (indexada para smooth shading).
export function ico(detail = 2) {
  return cached(`ic:smooth:${detail}`, () => new THREE.SphereGeometry(1, 24, 16));
}

// Casca de esfera de raio 1 (escale para a cabeça). theta: do topo (0) à base (π); phi: ao redor
// (z negativo = nuca = phiStart π, phiLength π).
export function shell(thetaStart, thetaLength, phiStart = 0, phiLength = Math.PI * 2, ws = 12, hs = 6) {
  return cached(`sh:${thetaStart}:${thetaLength}:${phiStart}:${phiLength}:${ws}:${hs}`,
    () => new THREE.SphereGeometry(1, ws, hs, phiStart, phiLength, thetaStart, thetaLength));
}

export function dome(r, seg = 10) {
  return cached(`dm:${r}:${seg}`, () => new THREE.SphereGeometry(r, seg, 6, 0, Math.PI * 2, 0, Math.PI / 2));
}

export function torus(r, tube, arc = Math.PI * 2, rs = 4, ts = 10) {
  return cached(`to:${r}:${tube}:${arc}:${rs}:${ts}`, () => new THREE.TorusGeometry(r, tube, rs, ts, arc));
}

// Cria uma malha já posicionada. opts: { pos, rot (rad), scale, parent }
export function mesh(geometry, color, opts = {}) {
  const m = new THREE.Mesh(geometry, mat(color));
  m.castShadow = true;
  m.receiveShadow = true;
  if (opts.pos) m.position.set(...opts.pos);
  if (opts.rot) m.rotation.set(...opts.rot);
  if (opts.scale) {
    if (Array.isArray(opts.scale)) m.scale.set(...opts.scale);
    else m.scale.setScalar(opts.scale);
  }
  if (opts.parent) opts.parent.add(m);
  return m;
}

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// Cria uma textura procedural em Canvas 2D para o tronco (camisa + quadril)
export function createTorsoTexture({ topColor, bottomColor, stripeColor = null, drawTop = null }) {
  const W = 512;
  const H = 512;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Divisão cintura: t ≈ 0.24 -> v = 0.24 -> canvas y ≈ 389
  const waistY = Math.round(H * 0.76);
  ctx.fillStyle = topColor;
  ctx.fillRect(0, 0, W, waistY);
  ctx.fillStyle = bottomColor;
  ctx.fillRect(0, waistY, W, H - waistY);

  if (stripeColor) {
    ctx.fillStyle = stripeColor;
    ctx.fillRect(0, Math.round(H * 0.16), W, Math.round(H * 0.08));
    ctx.fillRect(0, Math.round(H * 0.36), W, Math.round(H * 0.08));
  }

  if (typeof drawTop === 'function') {
    drawTop(ctx, W, H, waistY);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

// Gera geometria contínua e dobrável (SkinnedMesh) para o tronco inteiro (hips -> spine -> chest).
// silhouette: 'male' (triângulo invertido) | 'female' (violão/ampulheta) | 'neutral'
// fat: 0..1 (volume de barriga/gordura), bust: 0..1 (volume extra de busto)
export function buildSkinnedTorsoGeometry(dims, w = 1, opts = {}) {
  const silhouette = opts.silhouette || 'male';
  const fat = THREE.MathUtils.clamp(opts.fat || 0, 0, 1.5);
  const bust = opts.bust ?? (silhouette === 'female' ? 0.6 : 0);
  const hasStripe = Boolean(opts.hasStripe);

  const key = `torso2:${w.toFixed(3)}:${silhouette}:${fat.toFixed(3)}:${bust.toFixed(3)}:${hasStripe}`;
  return cached(key, () => {
    const yMin = -0.05;
    const yMax = dims.spine + dims.abdomen + dims.chest + 0.01;
    const totalH = yMax - yMin;
    const rings = 20;
    const segs = 16;
    const stride = segs + 1;

    const positions = [];
    const uvs = [];
    const skinIndices = [];
    const skinWeights = [];
    const indices = [];

    // Superelipse: exp menor = mais quadrado (low-poly), exp -> 1 = mais redondo (gordo)
    const sqExp = THREE.MathUtils.lerp(0.68, 0.95, Math.min(1, fat));

    function profileAt(t) {
      let rx, rz;
      if (silhouette === 'female') {
        // Violão / ampulheta: quadril largo, cintura fina, peito marcado
        const hip = 0.185 * Math.exp(-(((t - 0.10) / 0.20) ** 2));
        const waist = -0.052 * Math.exp(-(((t - 0.44) / 0.16) ** 2));
        const upper = 0.188 * smoothstep(0.45, 0.85, t) + 0.155 * (1 - smoothstep(0.45, 0.85, t));
        rx = (Math.max(hip, upper) + waist) * w;
        rz = (0.115 + 0.018 * Math.sin(t * Math.PI)) * w;
      } else if (silhouette === 'male') {
        // Triângulo invertido: quadril estreito, ombros/peito largos
        const taper = THREE.MathUtils.lerp(0.165, 0.222, smoothstep(0.15, 0.85, t));
        rx = taper * w;
        rz = THREE.MathUtils.lerp(0.11, 0.135, smoothstep(0.2, 0.82, t)) * w;
      } else {
        rx = THREE.MathUtils.lerp(0.17, 0.205, smoothstep(0.1, 0.85, t)) * w;
        rz = 0.12 * w;
      }

      // Fechamento suave nos extremos (base do quadril e topo dos ombros)
      const capBottom = smoothstep(0.0, 0.07, t);
      const capTop = 1 - 0.42 * smoothstep(0.90, 1.0, t);
      const capScale = (0.55 + 0.45 * capBottom) * capTop;
      rx *= capScale;
      rz *= capScale;

      // Barriga / gordura (fat)
      const bellyCurve = Math.exp(-(((t - 0.36) / 0.24) ** 2)) * fat;
      rx += 0.085 * bellyCurve;
      rz += 0.105 * bellyCurve;
      const zOff = 0.048 * bellyCurve;

      return { rx, rz, zOff };
    }

    function weightsAt(y) {
      // Ossos: 0 = hips (y=0), 1 = spine (y=0.07), 2 = chest (y=0.27)
      const ySpine = dims.spine;
      const yChest = dims.spine + dims.abdomen;
      let w0 = 0, w1 = 0, w2 = 0;
      if (y <= ySpine) {
        const b = smoothstep(0.0, ySpine, y);
        w0 = 1 - b;
        w1 = b;
      } else if (y <= yChest) {
        const b = smoothstep(ySpine, yChest, y);
        w1 = 1 - b;
        w2 = b;
      } else {
        w2 = 1;
      }
      return [w0, w1, w2, 0];
    }

    // Gera anéis de vértices (s = 0..segs; a=-PI/2 = costas, +PI/2 = frente -> u=0.5 centro frontal)
    for (let r = 0; r <= rings; r++) {
      const t = r / rings;
      const y = yMin + t * totalH;
      const { rx, rz, zOff } = profileAt(t);
      const sw = weightsAt(y);
      const bustBand = bust * Math.exp(-(((t - 0.76) / 0.11) ** 2));

      for (let s = 0; s <= segs; s++) {
        const a = -Math.PI / 2 + (s / segs) * Math.PI * 2;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        const x = Math.sign(ca) * Math.pow(Math.abs(ca), sqExp) * rx;
        let z = Math.sign(sa) * Math.pow(Math.abs(sa), sqExp) * rz + zOff;
        if (sa > 0 && bustBand > 0) {
          z += 0.048 * bustBand * Math.pow(sa, 1.3);
        }

        positions.push(x, y, z);
        uvs.push(1 - s / segs, t);
        skinIndices.push(0, 1, 2, 0);
        skinWeights.push(sw[0], sw[1], sw[2], sw[3]);
      }
    }

    // Centros das tampas inferior e superior
    const bottomCenterIdx = positions.length / 3;
    positions.push(0, yMin, 0);
    uvs.push(0.5, 0);
    skinIndices.push(0, 1, 2, 0);
    skinWeights.push(1, 0, 0, 0);

    const topCenterIdx = positions.length / 3;
    positions.push(0, yMax, 0);
    uvs.push(0.5, 1);
    skinIndices.push(0, 1, 2, 0);
    skinWeights.push(0, 0, 1, 0);

    const geo = new THREE.BufferGeometry();
    const ringGroups = [[], [], []]; // 0 = bottomColor, 1 = topColor, 2 = stripe

    // Tampa inferior (material 0, normal para -Y)
    for (let s = 0; s < segs; s++) {
      ringGroups[0].push(bottomCenterIdx, s, s + 1);
    }

    // Anéis laterais (normais apontando para fora)
    for (let r = 0; r < rings; r++) {
      const yMid = yMin + ((r + 0.5) / rings) * totalH;
      let matIdx = yMid < dims.spine + 0.03 ? 0 : 1;
      if (hasStripe && ((yMid > 0.32 && yMid < 0.37) || (yMid > 0.45 && yMid < 0.50))) {
        matIdx = 2;
      }
      const rowA = r * stride;
      const rowB = (r + 1) * stride;
      for (let s = 0; s < segs; s++) {
        const a = rowA + s;
        const b = rowA + s + 1;
        const c = rowB + s;
        const d = rowB + s + 1;
        ringGroups[matIdx].push(a, d, b, a, c, d);
      }
    }

    // Tampa superior (material 1, normal para +Y)
    const topRow = rings * stride;
    for (let s = 0; s < segs; s++) {
      ringGroups[1].push(topCenterIdx, topRow + s + 1, topRow + s);
    }

    let offset = 0;
    for (let m = 0; m < 3; m++) {
      if (ringGroups[m].length > 0) {
        geo.addGroup(offset, ringGroups[m].length, m);
        indices.push(...ringGroups[m]);
        offset += ringGroups[m].length;
      }
    }

    geo.setIndex(indices);
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
    geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));
    geo.computeVertexNormals();
    return geo;
  });
}
