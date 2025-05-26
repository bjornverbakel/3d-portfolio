"use client";

import "./globals.css";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Grid,
  Outlines,
  Environment,
  OrbitControls,

} from "@react-three/drei";
import * as THREE from "three";
import React, { useMemo, useState, useRef, useEffect } from "react";

export default function App() {
  function CameraSetup() {
    const { camera } = useThree();
    useEffect(() => {
      camera.position.set(5, 5, 5);
      camera.lookAt(0, 0, 0);
    }, [camera]);
    return null;
  }

  return (
    <Canvas camera={{ fov: 20 }}>
      <CameraSetup />
      <fog attach="fog" args={["#161616", 10, 18]} />

      {/* Cube with 3D axis arrows and labels */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#D7D7D7" />
        <Outlines color="#3553ff" thickness={10} />
      </mesh>

      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial color="#161616" />
      </lineSegments>

      <Grid
        position={[0, -0.5, 0]}
        args={[10, 10]}
        cellSize={.5}
        cellThickness={.75}
        cellColor="#6f6f6f"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#737373"
        fadeDistance={25}
        fadeStrength={1}
        infiniteGrid={true}
      />

      <Environment preset="dawn" />

      <spotLight
        position={[0, 3, 0]}
        angle={Math.PI / 6}
        penumbra={1}
        intensity={1}
        distance={20}
        castShadow
      />

      <OrbitControls />
    </Canvas>
  );
}
