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
import { Outline } from "@react-three/postprocessing";

// Helper to generate quad wireframe lines for a cube
function CubeWireframe({ size = 1, segments = 2, color = "#3553ff" }) {
  const step = size / segments;
  const half = size / 2;
  const points: number[] = [];

  // Generate lines parallel to X, Y, Z on each face
  for (let i = 0; i <= segments; i++) {
    for (let j = 0; j <= segments; j++) {
      // Lines parallel to X (vary Y and Z)
      points.push(
        -half,
        -half + i * step,
        -half + j * step,
        half,
        -half + i * step,
        -half + j * step
      );
      // Lines parallel to Y (vary X and Z)
      points.push(
        -half + i * step,
        -half,
        -half + j * step,
        -half + i * step,
        half,
        -half + j * step
      );
      // Lines parallel to Z (vary X and Y)
      points.push(
        -half + i * step,
        -half + j * step,
        -half,
        -half + i * step,
        -half + j * step,
        half
      );
    }
  }

  // Convert to Float32Array for BufferGeometry
  const positions = new Float32Array(points);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} />
    </lineSegments>
  );
}

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
        <Outlines thickness={10} color="#3553ff" />
      </mesh>

      <CubeWireframe size={1} segments={2} color="#161616" />

      <Grid
        position={[0, -0.5, 0]}
        args={[10, 10]}
        cellSize={0.5}
        cellThickness={0.75}
        cellColor="#6f6f6f"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#737373"
        fadeDistance={25}
        fadeStrength={1}
        infiniteGrid={true}
      />

      <Environment preset="dawn" />

      <OrbitControls />
    </Canvas>
  );
}
