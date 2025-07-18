"use client";

import "./globals.css";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Grid,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import React, { useEffect } from "react";
import Cube from "../components/Cube";

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

      {/* Cube with controls */}
      <Cube size={1} segments={2} color="#161616" />

      <Grid
        position={[0, 0, 0]}
        args={[10, 10]}
        cellSize={0.5}
        cellThickness={0.75}
        cellColor="#6f6f6f"
        sectionSize={1}
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
