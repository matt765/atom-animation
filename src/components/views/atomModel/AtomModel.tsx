"use client";

import React, { useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import styles from "./AtomModel.module.css";
import { useAppStore, deriveCurrentElement } from "../../../store/appStore";
import { Nucleus } from "./atomParts/Nucleus";
import { OrbitRing } from "./atomParts/OrbitRing";
import { Electron } from "./atomParts/Electron";

const DETAILED_VIEW_CONFIG = {
  ATOM_POSITION: new THREE.Vector3(-16, 0, 0),
  CAMERA_TARGET: new THREE.Vector3(-12, 0, 0),
  CAMERA_POSITION: new THREE.Vector3(-12, 2, 14),
};
export const CONFIG = {
  modelScale: 1.35,
  initialRotation: new THREE.Euler(Math.PI / 4, Math.PI / 0.6, 0),
  cameraPosition: new THREE.Vector3(0, 5.6, 16.8),
  cameraFov: 50,
  ambientLightIntensity: 0.7,
  directionalLightIntensity: 1,
  directionalLightPosition: new THREE.Vector3(10, 10, 5),
  protonColor: "#ff554d",
  neutronColor: "#aaaaaa",
  nucleonBaseRadius: 0.2,
  nucleonDetail: 32,
  nucleusScaleFactor: 0.9,
  nucleonMaterial: { roughness: 0.4, metalness: 0.2 },
  electronColor: "#33ccff",
  electronBaseRadius: 0.1,
  electronDetail: 16,
  electronMaterial: { emissive: "#33ccff", emissiveIntensity: 0.5 },
  orbitRingColor: "#ffffff",
  orbitRingOpacity: 0.3,
  orbitRingThickness: 0.01,
  shellDistances: [2, 3.2, 4.4, 5.6, 6.8, 8.0, 9.2],
  speedConstant: 1.5 * Math.PI,
  sliderMidpoint: 50,
};

const ScenePhysics = ({
  modelGroupRef,
  controlsRef,
  linearVelocity,
  rotationAxis,
  rotationSpeed,
  targetPosition,
  targetCameraPosition,
  targetControlsTarget,
  isCameraAnimating,
  setIsCameraAnimating,
}: {
  modelGroupRef: React.RefObject<THREE.Group>;
  controlsRef: React.RefObject<OrbitControlsImpl>;
  linearVelocity: React.RefObject<THREE.Vector3>;
  rotationAxis: React.RefObject<THREE.Vector3>;
  rotationSpeed: React.RefObject<number>;
  targetPosition: React.RefObject<THREE.Vector3>;
  targetCameraPosition: React.RefObject<THREE.Vector3>;
  targetControlsTarget: React.RefObject<THREE.Vector3>;
  isCameraAnimating: boolean;
  setIsCameraAnimating: (isAnimating: boolean) => void;
}) => {
  const { camera } = useThree();

  useFrame((_, delta) => {
    const model = modelGroupRef.current;
    const controls = controlsRef.current;

    if (!model || !controls) return;

    if (Math.abs(rotationSpeed.current) > 0.01) {
      model.rotateOnAxis(rotationAxis.current, rotationSpeed.current * delta);
      rotationSpeed.current *= 0.99;
    }

    if (linearVelocity.current.lengthSq() > 0.0001) {
      model.position.add(linearVelocity.current.clone().multiplyScalar(delta));
      linearVelocity.current.multiplyScalar(0.95);
      controls.target.copy(model.position);
    } else {
      if (isCameraAnimating) {
        const smoothingFactor = 0.05;
        model.position.lerp(targetPosition.current, smoothingFactor);
        camera.position.lerp(targetCameraPosition.current, smoothingFactor);
        controls.target.lerp(targetControlsTarget.current, smoothingFactor);

        const modelDist = model.position.distanceTo(targetPosition.current);
        const cameraDist = camera.position.distanceTo(
          targetCameraPosition.current
        );
        const controlsDist = controls.target.distanceTo(
          targetControlsTarget.current
        );

        if (modelDist < 0.01 && cameraDist < 0.01 && controlsDist < 0.01) {
          setIsCameraAnimating(false);
        }
      }
    }
    controls.update();
  });

  return null;
};

export const AtomModel = () => {
  const {
    sliderValue,
    refreshCounter,
    setSelectedElement,
    shakeCounter,
    panelMode,
    isCameraAnimating,
    setIsCameraAnimating,
  } = useAppStore();
  const element = useAppStore(deriveCurrentElement);

  const modelGroupRef = useRef<THREE.Group>(null!);
  const controlsRef = useRef<OrbitControlsImpl>(null!);
  const clickStartPos = useRef<{ x: number; y: number } | null>(null);

  const linearVelocity = useRef(new THREE.Vector3(0, 0, 0));
  const rotationAxis = useRef(new THREE.Vector3(0, 1, 0));
  const rotationSpeed = useRef(0);
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
  const targetCameraPosition = useRef(
    new THREE.Vector3(
      CONFIG.cameraPosition.x,
      CONFIG.cameraPosition.y,
      CONFIG.cameraPosition.z
    )
  );
  const targetControlsTarget = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (panelMode === "detailed") {
      targetPosition.current.copy(DETAILED_VIEW_CONFIG.ATOM_POSITION);
      targetControlsTarget.current.copy(DETAILED_VIEW_CONFIG.CAMERA_TARGET);
      targetCameraPosition.current.copy(DETAILED_VIEW_CONFIG.CAMERA_POSITION);
      setIsCameraAnimating(true);
    }
  }, [panelMode, setIsCameraAnimating]);

  useEffect(() => {
    if (refreshCounter > 0) {
      if (modelGroupRef.current) {
        modelGroupRef.current.rotation.set(
          CONFIG.initialRotation.x,
          CONFIG.initialRotation.y,
          CONFIG.initialRotation.z
        );
        targetPosition.current.set(0, 0, 0);
        targetControlsTarget.current.set(0, 0, 0);
        targetCameraPosition.current.set(
          CONFIG.cameraPosition.x,
          CONFIG.cameraPosition.y,
          CONFIG.cameraPosition.z
        );
        linearVelocity.current.set(0, 0, 0);
        rotationSpeed.current = 0;
        setIsCameraAnimating(true);
      }
    }
  }, [refreshCounter, setIsCameraAnimating]);

  const triggerShake = useCallback(() => {
    // Anuluj inne animacje, aby uniknąć konfliktów
    setIsCameraAnimating(false);
    // Zresetuj prędkość liniową, aby zapobiec ruchowi w przestrzeni
    linearVelocity.current.set(0, 0, 0);

    const angularMinStrength = 10;
    const angularMaxStrength = 18;

    // Ustaw tylko losową oś i prędkość obrotu
    const newAxis = new THREE.Vector3();
    do {
      newAxis.set(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      );
    } while (newAxis.lengthSq() === 0);
    newAxis.normalize();
    rotationAxis.current.copy(newAxis);

    const speed =
      angularMinStrength +
      Math.random() * (angularMaxStrength - angularMinStrength);
    rotationSpeed.current = speed;
  }, [setIsCameraAnimating]);

  useEffect(() => {
    if (shakeCounter > 0) {
      triggerShake();
    }
  }, [shakeCounter, triggerShake]);

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (clickStartPos.current) {
      const dist = Math.sqrt(
        (e.clientX - clickStartPos.current.x) ** 2 +
          (e.clientY - clickStartPos.current.y) ** 2
      );
      if (dist < 5) {
        setSelectedElement(element.name, { x: e.clientX, y: e.clientY }, true);
      }
    }
    clickStartPos.current = null;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button === 2) {
      clickStartPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const speedMultiplier = (sliderValue / CONFIG.sliderMidpoint) ** 2;
  const shellDistances = useMemo(
    () => CONFIG.shellDistances.map((d) => d * CONFIG.modelScale),
    []
  );
  const orientations = useMemo(() => {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    return element.shells.map((_: number, idx: number) => {
      if (idx === 0) return new THREE.Euler(Math.PI / 2, 0, 0);
      if (idx === 1) return new THREE.Euler(0, 0, 0);
      if (idx === 2) return new THREE.Euler(Math.PI / 4, Math.PI / 4, 0);
      const angle = (idx - 2) * goldenAngle;
      return new THREE.Euler(angle, angle * 0.5, angle * 0.25);
    });
  }, [element]);

  const handleControlsStart = useCallback(() => {
    if (isCameraAnimating) {
      setIsCameraAnimating(false);
    }
  }, [isCameraAnimating, setIsCameraAnimating]);

  return (
    <div className={styles.animationContainer}>
      <Canvas
        onContextMenu={handleContextMenu}
        onPointerDown={handlePointerDown}
        gl={{ alpha: true }}
        style={{ background: "transparent" }}
        camera={{ position: CONFIG.cameraPosition, fov: CONFIG.cameraFov }}
      >
        <ambientLight intensity={CONFIG.ambientLightIntensity} />
        <directionalLight
          position={CONFIG.directionalLightPosition.toArray()}
          intensity={CONFIG.directionalLightIntensity}
        />
        <group ref={modelGroupRef} rotation={CONFIG.initialRotation}>
          <Nucleus protons={element.protons} neutrons={element.neutrons} />
          {element.shells.map((count: number, idx: number) => {
            const speed =
              CONFIG.speedConstant * speedMultiplier * (1 / (idx + 1));
            return (
              <group key={idx} rotation={orientations[idx]}>
                <OrbitRing radius={shellDistances[idx]} />
                {Array.from({ length: count }).map((_, i: number) => (
                  <Electron
                    key={i}
                    radius={shellDistances[idx]}
                    speed={speed}
                  />
                ))}
              </group>
            );
          })}
        </group>
        <OrbitControls
          ref={controlsRef}
          enableZoom
          enablePan
          onStart={handleControlsStart}
        />
        <ScenePhysics
          modelGroupRef={modelGroupRef}
          controlsRef={controlsRef}
          linearVelocity={linearVelocity}
          rotationAxis={rotationAxis}
          rotationSpeed={rotationSpeed}
          targetPosition={targetPosition}
          targetCameraPosition={targetCameraPosition}
          targetControlsTarget={targetControlsTarget}
          isCameraAnimating={isCameraAnimating}
          setIsCameraAnimating={setIsCameraAnimating}
        />
      </Canvas>
    </div>
  );
};
