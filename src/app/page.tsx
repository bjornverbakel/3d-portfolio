"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

type Vec3 = [number, number, number];

function AxisArrow({
  from = [0, 0, 0] as Vec3, // Line start point
  to = [1, 0, 0] as Vec3, // Line end point
  color,
  lineWidth = 10, // Line width
  label,
  labelDistance = 2, // Text distance from cube
  labelOffset = 40, // Text offset from line
}: {
  from?: Vec3;
  to?: Vec3;
  color?: string;
  lineWidth?: number;
  label?: string;
  labelDistance?: number;
  labelOffset?: number;
}) {
  const { camera, size } = useThree();

  // Calculate direction vector
  const dir = [
    to[0] - from[0],
    to[1] - from[1],
    to[2] - from[2],
  ];

  const len = Math.sqrt(dir[0] ** 2 + dir[1] ** 2 + dir[2] ** 2);
  const norm = len === 0 ? [0, 0, 0] : [dir[0] / len, dir[1] / len, dir[2] / len];

  // Position label exactly 'labelDistance' units from 'from' in the direction of the axis
  const labelPos3D: Vec3 = [
    from[0] + norm[0] * labelDistance,
    from[1] + norm[1] * labelDistance,
    from[2] + norm[2] * labelDistance,
  ];

  // Offset label in screen space, then unproject back to 3D
  const labelPos = useMemo(() => {
    // Project 'from' and labelPos3D to screen space
    const project = (v: Vec3) => {
      const vec = new THREE.Vector3(...v).project(camera);
      return [
        (vec.x * 0.5 + 0.5) * size.width,
        (1 - (vec.y * 0.5 + 0.5)) * size.height,
        vec.z,
      ];
    };
    const [x1, y1] = project(from);
    const [x2, y2, z2] = project(labelPos3D);

    // Perpendicular in 2D
    const dx = x2 - x1;
    const dy = y2 - y1;
    const perp = [-dy, dx];
    const perpLen = Math.sqrt(perp[0] ** 2 + perp[1] ** 2);
    const perpNorm = perpLen === 0 ? [0, 0] : [perp[0] / perpLen, perp[1] / perpLen];

    // Offset in screen space
    const labelScreen = [x2 + perpNorm[0] * labelOffset, y2 + perpNorm[1] * labelOffset];

    // Unproject back to 3D
    const ndc = [
      (labelScreen[0] / size.width) * 2 - 1,
      -((labelScreen[1] / size.height) * 2 - 1),
      z2,
    ];
    const vec = new THREE.Vector3(ndc[0], ndc[1], ndc[2]);
    vec.unproject(camera);
    return [vec.x, vec.y, vec.z] as Vec3;
  }, [from, labelPos3D, camera, size, labelOffset]);

  // Project from and to into screen space and calculate angle (for text rotation)
  const angle = useMemo(() => {
    const project = (v: Vec3) => {
      const vec = new THREE.Vector3(...v).project(camera);
      return [
        (vec.x * 0.5 + 0.5) * size.width,
        (1 - (vec.y * 0.5 + 0.5)) * size.height,
      ];
    };
    const [x1, y1] = project(from);
    const [x2, y2] = project(labelPos3D);
    let a = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    if (a > 90) a -= 180;
    if (a < -90) a += 180;
    return a;
  }, [from, labelPos3D, camera, size]);

  return (
    <>
      <Line points={[from, to]} color={color} lineWidth={lineWidth} />
      <Html position={labelPos} center>
        <div
          style={{
            color,
            fontWeight: "bold",
            fontSize: "3em",
            transform: `rotate(${angle}deg)`,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      </Html>
    </>
  );
}

export default function App() {
  return (
    <Canvas camera={{ position: [4, 3, 5], fov: 50 }}>
      {/* Cube */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Gizmo lines/arrows with 2D labels */}
      {/* X axis - Red */}
      <AxisArrow from={[0, 0.5, 0]} to={[4, 0.5, 0]} color="#FF4141" label="Contact" labelDistance={2} />
      {/* Y axis - Green */}
      <AxisArrow from={[0, 0.5, 0]} to={[0, 4.5, 0]} color="#54FF87" label="About" labelDistance={1.5} />
      {/* Z axis - Blue */}
      <AxisArrow from={[0, 0.5, 0]} to={[0, 0.5, 4]} color="#4661FF" label="Projects" labelDistance={2.25} />
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
    </Canvas>
  );
}
