"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { CONFIG } from "../AtomModel";

export const Nucleus = ({
  protons,
  neutrons,
}: {
  protons: number;
  neutrons: number;
}) => {
  const { protonPositions, neutronPositions } = useMemo(() => {
    const total = protons + neutrons;
    if (total === 0) return { protonPositions: [], neutronPositions: [] };
    if (total === 1) {
      const position = [new THREE.Vector3(0, 0, 0)];
      return protons === 1
        ? { protonPositions: position, neutronPositions: [] }
        : { protonPositions: [], neutronPositions: position };
    }
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < total; i++) {
      const y = 1 - (i / (total - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      const nucleonRadius = CONFIG.nucleonBaseRadius * CONFIG.modelScale;
      const clusterRadius =
        nucleonRadius * Math.cbrt(total) * CONFIG.nucleusScaleFactor;
      points.push(new THREE.Vector3(x, y, z).multiplyScalar(clusterRadius));
    }
    const pPos: THREE.Vector3[] = [];
    const nPos: THREE.Vector3[] = [];
    const particleTypes: ("P" | "N")[] = [];
    for (let i = 0; i < protons; i++) particleTypes.push("P");
    for (let i = 0; i < neutrons; i++) particleTypes.push("N");
    for (let i = particleTypes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [particleTypes[i], particleTypes[j]] = [
        particleTypes[j],
        particleTypes[i],
      ];
    }
    points.forEach((pos, i) => {
      if (particleTypes[i] === "P") pPos.push(pos);
      else nPos.push(pos);
    });
    return { protonPositions: pPos, neutronPositions: nPos };
  }, [protons, neutrons]);

  return (
    <group>
      {protonPositions.map((pos, i) => (
        <mesh key={`p${i}`} position={pos}>
          <sphereGeometry
            args={[
              CONFIG.nucleonBaseRadius * CONFIG.modelScale,
              CONFIG.nucleonDetail,
              CONFIG.nucleonDetail,
            ]}
          />
          <meshStandardMaterial
            color={CONFIG.protonColor}
            {...CONFIG.nucleonMaterial}
          />
        </mesh>
      ))}
      {neutronPositions.map((pos, i) => (
        <mesh key={`n${i}`} position={pos}>
          <sphereGeometry
            args={[
              CONFIG.nucleonBaseRadius * CONFIG.modelScale,
              CONFIG.nucleonDetail,
              CONFIG.nucleonDetail,
            ]}
          />
          <meshStandardMaterial
            color={CONFIG.neutronColor}
            {...CONFIG.nucleonMaterial}
          />
        </mesh>
      ))}
    </group>
  );
};
