import * as THREE from "three";

import { CONFIG } from "../AtomModel";

export const OrbitRing = ({ radius }: { radius: number }) => (
  <mesh>
    <ringGeometry
      args={[
        radius - CONFIG.orbitRingThickness * CONFIG.modelScale,
        radius + CONFIG.orbitRingThickness * CONFIG.modelScale,
        64,
      ]}
    />
    <meshBasicMaterial
      color={CONFIG.orbitRingColor}
      side={THREE.DoubleSide}
      transparent
      opacity={CONFIG.orbitRingOpacity}
    />
  </mesh>
);
