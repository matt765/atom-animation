import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { CONFIG } from "../AtomModel";

export const Electron = ({
  radius,
  speed,
}: {
  radius: number;
  speed: number;
}) => {
  const ref = useRef<THREE.Mesh>(null!);
  const angle = useRef(Math.random() * Math.PI * 2);
  useFrame((_, delta) => {
    angle.current += delta * speed;
    const x = Math.cos(angle.current) * radius;
    const y = Math.sin(angle.current) * radius;
    if (ref.current) ref.current.position.set(x, y, 0);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry
        args={[
          CONFIG.electronBaseRadius * CONFIG.modelScale,
          CONFIG.electronDetail,
          CONFIG.electronDetail,
        ]}
      />
      <meshStandardMaterial
        color={CONFIG.electronColor}
        {...CONFIG.electronMaterial}
      />
    </mesh>
  );
};
