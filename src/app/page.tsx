"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";

export default function App() {
  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
      {/* Cube */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#6C67FF" />
      </mesh>
      {/* Grid helper */}
      <Grid
        position={[0, 0, 0]}
        args={[10, 10]}
        cellSize={1}
        cellThickness={1}
        cellColor="#6f6f6f"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#737373"
        fadeDistance={25}
        fadeStrength={1}
        infiniteGrid={true}
      />
      {/* Lighting */}
      <ambientLight intensity={1} />
      <directionalLight position={[2.5, 10, 5]} intensity={1} />
      {/* Controls */}
      <OrbitControls />
    </Canvas>
  );
}
