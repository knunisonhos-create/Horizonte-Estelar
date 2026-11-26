import * as THREE from 'three';
import type { HullDef, Rarity } from '../types/game';
import { RARITY_STYLES } from '../utils/formatting';

export type ShipModelVariant = 0 | 1;

export interface BuildShipModelOptions {
  /** Cor principal da nave (cor da facção) */
  primaryColor: string;
  /** Nível de raridade da nave (define a geometria e a cor secundária) */
  rarity: Rarity;
  /** Variante de modelo dentro da raridade (0 ou 1 — 2 modelos distintos por raridade) */
  variant?: ShipModelVariant;
  /** Escala uniforme */
  scale?: number;
  /** Sobrescreve cor secundária (padrão: cor oficial da raridade) */
  secondaryColor?: string;
}

export function getRaritySecondaryColor(rarity: Rarity): string {
  return RARITY_STYLES[rarity]?.dot ?? RARITY_STYLES.comum.dot;
}

export function getRarityFromTechLevel(level: number): Rarity {
  if (level >= 5) return 'lendário';
  if (level === 4) return 'épico';
  if (level === 3) return 'raro';
  if (level === 2) return 'incomum';
  return 'comum';
}

export function hashShipVariant(key: string): ShipModelVariant {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 2) as ShipModelVariant;
}

const EXPLICIT_HULL_VARIANT: Record<string, ShipModelVariant> = {
  balsa_estelar_civil: 0,
  explorador_silvar: 0,
  cargueiro_mercantil: 1,
  corveta_patrulha: 0,
  minerador_pesado: 1,
  cruzador_guerra: 0,
  arca_colonial: 1,
  fragata_dobra_metalocto: 0,
};

export function getShipVariantForHull(
  hullId?: string | null,
  hullShape?: HullDef['hullShape']
): ShipModelVariant {
  if (hullId && hullId in EXPLICIT_HULL_VARIANT) {
    return EXPLICIT_HULL_VARIANT[hullId];
  }
  if (hullId) {
    return hashShipVariant(hullId);
  }
  if (hullShape === 'cargueiro' || hullShape === 'fragata') return 1;
  return 0;
}

export function disposeObject3D(root: THREE.Object3D): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) {
      geometries.add(mesh.geometry);
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => materials.add(m));
      } else {
        materials.add(mesh.material);
      }
    }
  });

  geometries.forEach((g) => g.dispose());
  materials.forEach((m) => m.dispose());
}

/**
 * Helper to create a symmetric extruded fuselage/wing in XZ plane (extruded along Y, centered on Y).
 * Shape coords use (x, y) mapped to 3D (x, extrusionY, -shapeY), so +shapeY maps to -Z (aft) and -shapeY maps to +Z (forward).
 */
function makeExtrudedXZ(
  points: Array<[number, number]>,
  thickness: number,
  bevel = 0.04
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], points[i][1]);
  }
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    steps: 1,
  });
  geo.rotateX(Math.PI / 2);
  geo.translate(0, thickness * 0.5, 0);
  geo.computeVertexNormals();
  return geo;
}

function addSymmetricPair(
  group: THREE.Group,
  createMesh: (side: -1 | 1) => THREE.Object3D
): void {
  group.add(createMesh(-1));
  group.add(createMesh(1));
}

function createShipMaterials(primaryColor: string, secondaryColor: string, rarity: Rarity) {
  const primaryMat = new THREE.MeshStandardMaterial({
    color: primaryColor,
    roughness: 0.46,
    metalness: 0.65,
    emissive: primaryColor,
    emissiveIntensity: 0.16,
  });

  const secondaryMat = new THREE.MeshStandardMaterial({
    color: secondaryColor,
    roughness: 0.18,
    metalness: 0.86,
    emissive: secondaryColor,
    emissiveIntensity: rarity === 'lendário' || rarity === 'único' ? 0.3 : 0.22,
  });

  const frameMat = new THREE.MeshStandardMaterial({
    color: '#172033',
    roughness: 0.74,
    metalness: 0.35,
  });

  const canopyMat = new THREE.MeshStandardMaterial({
    color: '#bae6fd',
    roughness: 0.1,
    metalness: 0.18,
    emissive: '#38bdf8',
    emissiveIntensity: 0.28,
  });

  const engineMat = new THREE.MeshBasicMaterial({
    color: rarity === 'lendário' ? '#fef08a' : rarity === 'épico' ? '#e9d5ff' : '#67e8f9',
  });

  return { primaryMat, secondaryMat, frameMat, canopyMat, engineMat };
}

/**
 * Constrói um modelo 3D composto para qualquer nave do jogo.
 * - Orientação padrão: +Z = proa (frente), -Z = popa (motores), +Y = topo.
 * - 2 modelos distintos para cada raridade: comum, incomum, raro, épico, lendário (e único).
 * - Cor principal = facção; Cor secundária = nível de raridade.
 */
export function buildShipModel3D({
  primaryColor,
  rarity,
  variant = 0,
  scale = 1,
  secondaryColor,
}: BuildShipModelOptions): THREE.Group {
  const secHex = secondaryColor ?? getRaritySecondaryColor(rarity);
  const mats = createShipMaterials(primaryColor || '#38bdf8', secHex, rarity);
  const { primaryMat, secondaryMat, frameMat, canopyMat, engineMat } = mats;

  const group = new THREE.Group();
  const s = scale;

  // ============================================================================
  // RARIDADE: COMUM (2 modelos utilitários/fronteiriços)
  // ============================================================================
  if (rarity === 'comum') {
    if (variant === 0) {
      // Modelo Comum A: Balsa Utilitária Modular (casco chanfrado + contêineres laterais)
      const hullGeo = makeExtrudedXZ(
        [
          [0, -1.05 * s],
          [0.42 * s, -0.55 * s],
          [0.46 * s, 0.78 * s],
          [0.24 * s, 1.05 * s],
          [-0.24 * s, 1.05 * s],
          [-0.46 * s, 0.78 * s],
          [-0.42 * s, -0.55 * s],
        ],
        0.34 * s,
        0.04 * s
      );
      group.add(new THREE.Mesh(hullGeo, primaryMat));

      const cab = new THREE.Mesh(new THREE.BoxGeometry(0.46 * s, 0.24 * s, 0.48 * s), canopyMat);
      cab.position.set(0, 0.22 * s, 0.56 * s);
      group.add(cab);

      // Contêineres laterais na cor secundária da raridade
      addSymmetricPair(group, (side) => {
        const podGroup = new THREE.Group();
        const tank = new THREE.Mesh(new THREE.BoxGeometry(0.34 * s, 0.32 * s, 1.05 * s), secondaryMat);
        tank.position.set(side * 0.64 * s, -0.02 * s, -0.05 * s);
        const strut = new THREE.Mesh(new THREE.BoxGeometry(0.28 * s, 0.14 * s, 0.45 * s), frameMat);
        strut.position.set(side * 0.46 * s, 0, -0.05 * s);
        podGroup.add(tank, strut);
        return podGroup;
      });

      // Propulsores duplos e antena dorsal
      addSymmetricPair(group, (side) => {
        const eng = new THREE.Group();
        const bell = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14 * s, 0.19 * s, 0.42 * s, 8),
          frameMat
        );
        bell.rotation.x = Math.PI / 2;
        bell.position.set(side * 0.24 * s, 0, -1.14 * s);
        const glow = new THREE.Mesh(new THREE.SphereGeometry(0.13 * s, 8, 8), engineMat);
        glow.position.set(side * 0.24 * s, 0, -1.34 * s);
        eng.add(bell, glow);
        return eng;
      });

      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.03 * s, 0.04 * s, 0.34 * s, 6), secondaryMat);
      mast.position.set(0, 0.32 * s, -0.38 * s);
      group.add(mast);
    } else {
      // Modelo Comum B: Barcaça Batedora de Proa Chata (pontões laterais + asa transversal)
      const noseGeo = makeExtrudedXZ(
        [
          [0, -1.18 * s],
          [0.38 * s, -0.2 * s],
          [0.3 * s, 0.92 * s],
          [-0.3 * s, 0.92 * s],
          [-0.38 * s, -0.2 * s],
        ],
        0.26 * s,
        0.04 * s
      );
      group.add(new THREE.Mesh(noseGeo, primaryMat));

      const crossWing = new THREE.Mesh(new THREE.BoxGeometry(1.75 * s, 0.1 * s, 0.44 * s), frameMat);
      crossWing.position.set(0, -0.02 * s, -0.25 * s);
      group.add(crossWing);

      addSymmetricPair(group, (side) => {
        const pontoon = new THREE.Mesh(
          new THREE.CylinderGeometry(0.15 * s, 0.17 * s, 1.35 * s, 8),
          secondaryMat
        );
        pontoon.rotation.x = Math.PI / 2;
        pontoon.position.set(side * 0.78 * s, 0.02 * s, -0.1 * s);
        return pontoon;
      });

      const bridge = new THREE.Mesh(new THREE.SphereGeometry(0.24 * s, 10, 8), canopyMat);
      bridge.scale.set(1.1, 0.6, 1.4);
      bridge.position.set(0, 0.2 * s, 0.25 * s);
      group.add(bridge);

      const centerDrive = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2 * s, 0.24 * s, 0.45 * s, 8),
        frameMat
      );
      centerDrive.rotation.x = Math.PI / 2;
      centerDrive.position.set(0, 0, -1.02 * s);
      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.17 * s, 8, 8), engineMat);
      glow.position.set(0, 0, -1.24 * s);
      group.add(centerDrive, glow);
    }
    return group;
  }

  // ============================================================================
  // RARIDADE: INCOMUM (2 modelos: Interceptador Flecha & Cargueiro Modular)
  // ============================================================================
  if (rarity === 'incomum') {
    if (variant === 0) {
      // Modelo Incomum A: Batedor Interceptador em Flecha (asas delta agudas + bico esguio)
      const fuselage = makeExtrudedXZ(
        [
          [0, -1.42 * s],
          [0.34 * s, -0.2 * s],
          [0.44 * s, 0.85 * s],
          [0, 1.1 * s],
          [-0.44 * s, 0.85 * s],
          [-0.34 * s, -0.2 * s],
        ],
        0.24 * s,
        0.04 * s
      );
      group.add(new THREE.Mesh(fuselage, primaryMat));

      // Asas delta inclinadas com borda de ataque na cor da raridade
      addSymmetricPair(group, (side) => {
        const wingGroup = new THREE.Group();
        const wingGeo = makeExtrudedXZ(
          [
            [0.3 * s * side, -0.1 * s],
            [1.22 * s * side, 0.72 * s],
            [1.08 * s * side, 0.92 * s],
            [0.34 * s * side, 0.65 * s],
          ],
          0.08 * s,
          0.02 * s
        );
        const wing = new THREE.Mesh(wingGeo, frameMat);
        const strake = new THREE.Mesh(new THREE.BoxGeometry(0.12 * s, 0.14 * s, 0.86 * s), secondaryMat);
        strake.position.set(side * 1.12 * s, 0.02 * s, -0.68 * s);
        strake.rotation.y = side * -0.18;
        wingGroup.add(wing, strake);
        return wingGroup;
      });

      const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.24 * s, 12, 8), canopyMat);
      canopy.scale.set(0.78, 0.52, 1.75);
      canopy.position.set(0, 0.18 * s, 0.38 * s);
      group.add(canopy);

      const dorsalSpine = new THREE.Mesh(new THREE.BoxGeometry(0.1 * s, 0.3 * s, 0.75 * s), secondaryMat);
      dorsalSpine.position.set(0, 0.24 * s, -0.58 * s);
      group.add(dorsalSpine);

      const mainThruster = new THREE.Mesh(new THREE.ConeGeometry(0.22 * s, 0.45 * s, 10), engineMat);
      mainThruster.rotation.x = -Math.PI / 2;
      mainThruster.position.set(0, 0, -1.25 * s);
      group.add(mainThruster);
    } else {
      // Modelo Incomum B: Cargueiro Interestelar Duplo (tanques gêmeos + ponte elevada)
      const spine = new THREE.Mesh(new THREE.BoxGeometry(0.62 * s, 0.34 * s, 2.25 * s), primaryMat);
      group.add(spine);

      const bowRam = new THREE.Mesh(new THREE.BoxGeometry(1.05 * s, 0.3 * s, 0.38 * s), secondaryMat);
      bowRam.position.set(0, -0.02 * s, 1.12 * s);
      group.add(bowRam);

      // Tanques gêmeos laterais em cilindros horizontais
      addSymmetricPair(group, (side) => {
        const tankGrp = new THREE.Group();
        const cyl = new THREE.Mesh(
          new THREE.CylinderGeometry(0.25 * s, 0.25 * s, 1.55 * s, 12),
          secondaryMat
        );
        cyl.rotation.x = Math.PI / 2;
        cyl.position.set(side * 0.62 * s, -0.02 * s, -0.05 * s);
        const band = new THREE.Mesh(
          new THREE.CylinderGeometry(0.28 * s, 0.28 * s, 0.26 * s, 12),
          frameMat
        );
        band.rotation.x = Math.PI / 2;
        band.position.set(side * 0.62 * s, -0.02 * s, 0.22 * s);
        const thruster = new THREE.Mesh(new THREE.SphereGeometry(0.16 * s, 8, 8), engineMat);
        thruster.position.set(side * 0.62 * s, -0.02 * s, -0.92 * s);
        tankGrp.add(cyl, band, thruster);
        return tankGrp;
      });

      const tower = new THREE.Mesh(new THREE.BoxGeometry(0.46 * s, 0.36 * s, 0.56 * s), primaryMat);
      tower.position.set(0, 0.3 * s, -0.62 * s);
      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.4 * s, 0.14 * s, 0.2 * s), canopyMat);
      visor.position.set(0, 0.36 * s, -0.35 * s);
      group.add(tower, visor);
    }
    return group;
  }

  // ============================================================================
  // RARIDADE: RARO (2 modelos: Corveta Catamarã & Mineradora/Extratora Pesada)
  // ============================================================================
  if (rarity === 'raro') {
    if (variant === 0) {
      // Modelo Raro A: Corveta Tática de Ataque (proa dupla catamarã + estabilizadores em V)
      const centerBody = makeExtrudedXZ(
        [
          [0, -0.65 * s],
          [0.54 * s, 0.1 * s],
          [0.44 * s, 1.15 * s],
          [0, 1.32 * s],
          [-0.44 * s, 1.15 * s],
          [-0.54 * s, 0.1 * s],
        ],
        0.28 * s,
        0.04 * s
      );
      group.add(new THREE.Mesh(centerBody, primaryMat));

      // Proas duplas estendidas para frente + trilhos de energia secundários
      addSymmetricPair(group, (side) => {
        const prongGrp = new THREE.Group();
        const prong = new THREE.Mesh(new THREE.BoxGeometry(0.24 * s, 0.2 * s, 1.35 * s), primaryMat);
        prong.position.set(side * 0.38 * s, 0.02 * s, 0.92 * s);
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12 * s, 0.24 * s, 1.15 * s), secondaryMat);
        rail.position.set(side * 0.38 * s, 0.06 * s, 0.95 * s);
        prongGrp.add(prong, rail);
        return prongGrp;
      });

      // Asas anguladas e naceles
      addSymmetricPair(group, (side) => {
        const nacGrp = new THREE.Group();
        const wing = new THREE.Mesh(new THREE.BoxGeometry(0.75 * s, 0.1 * s, 0.72 * s), frameMat);
        wing.position.set(side * 0.78 * s, 0.05 * s, -0.42 * s);
        wing.rotation.z = side * 0.22;
        const nacelle = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18 * s, 0.22 * s, 1.1 * s, 10),
          secondaryMat
        );
        nacelle.rotation.x = Math.PI / 2;
        nacelle.position.set(side * 1.12 * s, 0.12 * s, -0.58 * s);
        const exhaust = new THREE.Mesh(new THREE.SphereGeometry(0.17 * s, 8, 8), engineMat);
        exhaust.position.set(side * 1.12 * s, 0.12 * s, -1.16 * s);
        nacGrp.add(wing, nacelle, exhaust);
        return nacGrp;
      });

      const bridge = new THREE.Mesh(new THREE.SphereGeometry(0.28 * s, 12, 8), canopyMat);
      bridge.scale.set(0.95, 0.55, 1.5);
      bridge.position.set(0, 0.24 * s, 0.15 * s);
      group.add(bridge);
    } else {
      // Modelo Raro B: Barcaça / Extratora Pesada (mandíbulas frontais + tambor reator)
      const mainHull = makeExtrudedXZ(
        [
          [0, -1.05 * s],
          [0.78 * s, -0.55 * s],
          [0.82 * s, 0.65 * s],
          [0.48 * s, 1.08 * s],
          [-0.48 * s, 1.08 * s],
          [-0.82 * s, 0.65 * s],
          [-0.78 * s, -0.55 * s],
        ],
        0.38 * s,
        0.05 * s
      );
      group.add(new THREE.Mesh(mainHull, primaryMat));

      // Tambor central rotativo/reator na cor secundária
      const drum = new THREE.Mesh(
        new THREE.CylinderGeometry(0.46 * s, 0.46 * s, 0.78 * s, 12),
        secondaryMat
      );
      drum.rotation.z = Math.PI / 2;
      drum.position.set(0, 0.22 * s, 0.05 * s);
      group.add(drum);

      // Mandíbulas frontais de mineração
      addSymmetricPair(group, (side) => {
        const jawGrp = new THREE.Group();
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.22 * s, 0.22 * s, 0.9 * s), frameMat);
        arm.position.set(side * 0.56 * s, 0, 1.15 * s);
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.14 * s, 0.46 * s, 6), secondaryMat);
        tip.rotation.x = Math.PI / 2;
        tip.position.set(side * 0.52 * s, 0, 1.72 * s);
        jawGrp.add(arm, tip);
        return jawGrp;
      });

      // Estabilizadores traseiros largos e propulsores
      addSymmetricPair(group, (side) => {
        const pod = new THREE.Mesh(new THREE.BoxGeometry(0.38 * s, 0.34 * s, 0.85 * s), frameMat);
        pod.position.set(side * 0.95 * s, 0, -0.68 * s);
        const glow = new THREE.Mesh(new THREE.SphereGeometry(0.18 * s, 8, 8), engineMat);
        glow.position.set(side * 0.95 * s, 0, -1.16 * s);
        const grp = new THREE.Group();
        grp.add(pod, glow);
        return grp;
      });

      const dome = new THREE.Mesh(new THREE.BoxGeometry(0.48 * s, 0.22 * s, 0.42 * s), canopyMat);
      dome.position.set(0, 0.3 * s, 0.68 * s);
      group.add(dome);
    }
    return group;
  }

  // ============================================================================
  // RARIDADE: ÉPICO (2 modelos: Cruzador de Guerra & Arca Soberana com Anel)
  // ============================================================================
  if (rarity === 'épico') {
    if (variant === 0) {
      // Modelo Épico A: Cruzador de Guerra Imperial (lança blindada + 4 asas em X + cidadela)
      const hull = makeExtrudedXZ(
        [
          [0, -1.65 * s],
          [0.52 * s, -0.75 * s],
          [0.64 * s, 0.55 * s],
          [0.44 * s, 1.45 * s],
          [-0.44 * s, 1.45 * s],
          [-0.64 * s, 0.55 * s],
          [-0.52 * s, -0.75 * s],
        ],
        0.36 * s,
        0.05 * s
      );
      group.add(new THREE.Mesh(hull, primaryMat));

      // Crista dorsal e ponte blindada
      const citadel = new THREE.Mesh(new THREE.BoxGeometry(0.56 * s, 0.36 * s, 1.15 * s), frameMat);
      citadel.position.set(0, 0.3 * s, -0.2 * s);
      const crest = new THREE.Mesh(new THREE.BoxGeometry(0.16 * s, 0.42 * s, 1.65 * s), secondaryMat);
      crest.position.set(0, 0.36 * s, 0.05 * s);
      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.44 * s, 0.14 * s, 0.35 * s), canopyMat);
      visor.position.set(0, 0.38 * s, 0.46 * s);
      group.add(citadel, crest, visor);

      // 4 asas em X com pontas na cor secundária
      addSymmetricPair(group, (side) => {
        const wingGrp = new THREE.Group();
        const upperWing = new THREE.Mesh(new THREE.BoxGeometry(1.18 * s, 0.09 * s, 0.72 * s), primaryMat);
        upperWing.position.set(side * 0.96 * s, 0.24 * s, -0.42 * s);
        upperWing.rotation.z = side * 0.34;
        const lowerWing = new THREE.Mesh(new THREE.BoxGeometry(1.06 * s, 0.09 * s, 0.62 * s), frameMat);
        lowerWing.position.set(side * 0.9 * s, -0.22 * s, -0.45 * s);
        lowerWing.rotation.z = side * -0.3;
        const tip = new THREE.Mesh(new THREE.BoxGeometry(0.18 * s, 0.24 * s, 0.88 * s), secondaryMat);
        tip.position.set(side * 1.42 * s, 0.36 * s, -0.42 * s);
        wingGrp.add(upperWing, lowerWing, tip);
        return wingGrp;
      });

      // 4 motores traseiros
      [-0.44 * s, -0.16 * s, 0.16 * s, 0.44 * s].forEach((ox) => {
        const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * s, 0.16 * s, 0.4 * s, 8), frameMat);
        bell.rotation.x = Math.PI / 2;
        bell.position.set(ox, 0, -1.48 * s);
        const flame = new THREE.Mesh(new THREE.SphereGeometry(0.12 * s, 8, 8), engineMat);
        flame.position.set(ox, 0, -1.68 * s);
        group.add(bell, flame);
      });
    } else {
      // Modelo Épico B: Arca / Fragata Soberana (casco amplo + anel orbital de dobra)
      const hull = makeExtrudedXZ(
        [
          [0, -1.48 * s],
          [0.62 * s, -0.4 * s],
          [0.58 * s, 0.85 * s],
          [0.34 * s, 1.38 * s],
          [-0.34 * s, 1.38 * s],
          [-0.58 * s, 0.85 * s],
          [-0.62 * s, -0.4 * s],
        ],
        0.34 * s,
        0.05 * s
      );
      group.add(new THREE.Mesh(hull, primaryMat));

      // Grande anel habitacional/energético envolvendo a seção média na cor secundária
      const haloRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.12 * s, 0.11 * s, 12, 32),
        secondaryMat
      );
      haloRing.position.set(0, 0.04 * s, -0.22 * s);
      group.add(haloRing);

      // Suportes do anel
      addSymmetricPair(group, (side) => {
        const strut = new THREE.Mesh(new THREE.BoxGeometry(0.75 * s, 0.14 * s, 0.36 * s), frameMat);
        strut.position.set(side * 0.78 * s, 0.04 * s, -0.22 * s);
        return strut;
      });

      const prowCrown = new THREE.Mesh(new THREE.ConeGeometry(0.32 * s, 0.72 * s, 6), secondaryMat);
      prowCrown.rotation.x = Math.PI / 2;
      prowCrown.position.set(0, 0.18 * s, 1.15 * s);
      const bridge = new THREE.Mesh(new THREE.SphereGeometry(0.3 * s, 12, 10), canopyMat);
      bridge.scale.set(1.0, 0.6, 1.5);
      bridge.position.set(0, 0.28 * s, 0.45 * s);
      group.add(prowCrown, bridge);

      [-0.38 * s, 0, 0.38 * s].forEach((ox) => {
        const glow = new THREE.Mesh(new THREE.ConeGeometry(0.16 * s, 0.5 * s, 8), engineMat);
        glow.rotation.x = -Math.PI / 2;
        glow.position.set(ox, 0, -1.48 * s);
        group.add(glow);
      });
    }
    return group;
  }

  // ============================================================================
  // RARIDADE: LENDÁRIO & ÚNICO (2 modelos monumentais com anéis/lâminas astrais)
  // ============================================================================
  if (variant === 0) {
    // Modelo Lendário A: Fragata de Dobra Astral (duplo anel giroscópico + asas lâmina)
    const hull = makeExtrudedXZ(
      [
        [0, -1.78 * s],
        [0.48 * s, -0.6 * s],
        [0.52 * s, 0.7 * s],
        [0.34 * s, 1.48 * s],
        [-0.34 * s, 1.48 * s],
        [-0.52 * s, 0.7 * s],
        [-0.48 * s, -0.6 * s],
      ],
      0.34 * s,
      0.05 * s
    );
    group.add(new THREE.Mesh(hull, primaryMat));

    // Dois anéis giroscópicos cruzados na cor secundária (Dourado/Carmesim)
    const ringOuter = new THREE.Mesh(new THREE.TorusGeometry(1.26 * s, 0.09 * s, 12, 36), secondaryMat);
    ringOuter.rotation.set(0.35, 0.25, 0);
    ringOuter.position.set(0, 0.05 * s, -0.35 * s);
    const ringInner = new THREE.Mesh(new THREE.TorusGeometry(0.98 * s, 0.075 * s, 12, 32), secondaryMat);
    ringInner.rotation.set(-0.38, -0.28, Math.PI / 3);
    ringInner.position.set(0, 0.05 * s, -0.35 * s);
    group.add(ringOuter, ringInner);

    // Asas-lâmina invertidas
    addSymmetricPair(group, (side) => {
      const bladeGrp = new THREE.Group();
      const wing = makeExtrudedXZ(
        [
          [0.38 * s * side, -0.3 * s],
          [1.52 * s * side, -0.92 * s],
          [1.34 * s * side, 0.62 * s],
          [0.4 * s * side, 0.4 * s],
        ],
        0.09 * s,
        0.02 * s
      );
      const bladeMesh = new THREE.Mesh(wing, primaryMat);
      const edge = new THREE.Mesh(new THREE.BoxGeometry(0.14 * s, 0.14 * s, 1.45 * s), secondaryMat);
      edge.position.set(side * 1.42 * s, 0.04 * s, 0.15 * s);
      edge.rotation.y = side * -0.14;
      bladeGrp.add(bladeMesh, edge);
      return bladeGrp;
    });

    const coreOrb = new THREE.Mesh(new THREE.OctahedronGeometry(0.34 * s, 1), engineMat);
    coreOrb.position.set(0, 0.24 * s, -0.35 * s);
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.28 * s, 12, 8), canopyMat);
    canopy.scale.set(0.85, 0.55, 1.8);
    canopy.position.set(0, 0.26 * s, 0.72 * s);
    group.add(coreOrb, canopy);

    [-0.48 * s, -0.18 * s, 0.18 * s, 0.48 * s].forEach((ox) => {
      const spear = new THREE.Mesh(new THREE.ConeGeometry(0.13 * s, 0.58 * s, 8), engineMat);
      spear.rotation.x = -Math.PI / 2;
      spear.position.set(ox, 0, -1.62 * s);
      group.add(spear);
    });
  } else {
    // Modelo Lendário B: Couraçado Soberano Titã (casco duplo catedral + coroa solar + 6 motores)
    const hull = makeExtrudedXZ(
      [
        [0, -1.72 * s],
        [0.72 * s, -0.6 * s],
        [0.78 * s, 0.75 * s],
        [0.42 * s, 1.62 * s],
        [-0.42 * s, 1.62 * s],
        [-0.78 * s, 0.75 * s],
        [-0.72 * s, -0.6 * s],
      ],
      0.4 * s,
      0.06 * s
    );
    group.add(new THREE.Mesh(hull, primaryMat));

    // Coroa de proa + espinha dorsal dourada/única
    const dorsalCrest = new THREE.Mesh(new THREE.BoxGeometry(0.22 * s, 0.46 * s, 2.1 * s), secondaryMat);
    dorsalCrest.position.set(0, 0.36 * s, 0.1 * s);
    const crownHalo = new THREE.Mesh(new THREE.TorusGeometry(0.74 * s, 0.08 * s, 10, 28), secondaryMat);
    crownHalo.rotation.x = Math.PI / 2;
    crownHalo.position.set(0, 0.28 * s, -0.55 * s);
    group.add(dorsalCrest, crownHalo);

    // Lanças laterais e asas em múltiplos degraus
    addSymmetricPair(group, (side) => {
      const bay = new THREE.Group();
      const lance = new THREE.Mesh(new THREE.BoxGeometry(0.24 * s, 0.24 * s, 1.95 * s), primaryMat);
      lance.position.set(side * 0.96 * s, 0.04 * s, 0.25 * s);
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.56 * s, 0.12 * s, 1.15 * s), secondaryMat);
      plate.position.set(side * 1.24 * s, 0.14 * s, -0.25 * s);
      plate.rotation.z = side * 0.18;
      const tipCone = new THREE.Mesh(new THREE.ConeGeometry(0.16 * s, 0.55 * s, 6), secondaryMat);
      tipCone.rotation.x = Math.PI / 2;
      tipCone.position.set(side * 0.96 * s, 0.04 * s, 1.48 * s);
      bay.add(lance, plate, tipCone);
      return bay;
    });

    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.56 * s, 0.22 * s, 0.44 * s), canopyMat);
    bridge.position.set(0, 0.44 * s, 0.65 * s);
    group.add(bridge);

    [-0.96 * s, -0.45 * s, -0.15 * s, 0.15 * s, 0.45 * s, 0.96 * s].forEach((ox) => {
      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.15 * s, 8, 8), engineMat);
      glow.position.set(ox, 0.02 * s, -1.62 * s);
      group.add(glow);
    });
  }

  return group;
}
