"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Line, Html } from "@react-three/drei";

type Vec3 = [number, number, number];

function AxisArrow({
  from = [0, 0, 0] as Vec3,
  to = [1, 0, 0] as Vec3,
  color = "#ffffff",
  lineWidth = 5,
  label,
  labelDistance = 2, // distance from 'from' position
}: {
  from?: Vec3;
  to?: Vec3;
  color?: string;
  lineWidth?: number;
  label?: string;
  labelDistance?: number;
}) {
  // Calculate direction vector
  const dir = [
    to[0] - from[0],
    to[1] - from[1],
    to[2] - from[2],
  ];
  const len = Math.sqrt(dir[0] ** 2 + dir[1] ** 2 + dir[2] ** 2);
  const norm = len === 0 ? [0, 0, 0] : [dir[0] / len, dir[1] / len, dir[2] / len];

  // Position label exactly 'labelDistance' units from 'from' in the direction of the axis
  const labelPos: Vec3 = [
    from[0] + norm[0] * labelDistance,
    from[1] + norm[1] * labelDistance,
    from[2] + norm[2] * labelDistance,
  ];

  // Compute quaternion to rotate Y axis to the direction vector
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0), // Y axis
    new THREE.Vector3(...norm)
  );

  return (
    <>
      <Line points={[from, to]} color={color} lineWidth={lineWidth} />
      <Html position={labelPos} center quaternion={quaternion}>
        <div style={{ color, fontWeight: "bold", fontSize: 32 }}>
          {label}
        </div>
      </Html>
    </>
  );
}

export default function App() {
  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
      {/* Cube */}
      <mesh position={[0, .5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Gizmo lines/arrows with 2D labels */}
      {/* X axis - Red */}
      <AxisArrow from={[0, .5, 0]} to={[4, .5, 0]} color="#FF4141" label="Projects" />
      {/* Y axis - Green */}
      <AxisArrow from={[0, .5, 0]} to={[0, 4.5, 0]} color="#54FF87" label="Contact" />
      {/* Z axis - Blue */}
      <AxisArrow from={[0, .5, 0]} to={[0, .5, 4]} color="#4661FF" label="Projects" />
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
