"use client";

import "./globals.css";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Grid,
  Line,
  Html,
  OrbitControls,
  MeshReflectorMaterial,
  Environment,
} from "@react-three/drei";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import {
  Selection,
  Select,
  Bloom,
  Noise,
} from "@react-three/postprocessing";
import * as THREE from "three";
import React, { useMemo, useState, useRef, useEffect } from "react";

type Vec3 = [number, number, number];

function lerpColor(a: string, b: string, t: number) {
  // a, b: hex strings like "#FF0000"
  const ah = a.replace("#", "");
  const bh = b.replace("#", "");
  const ar = parseInt(ah.substring(0, 2), 16);
  const ag = parseInt(ah.substring(2, 4), 16);
  const ab = parseInt(ah.substring(4, 6), 16);
  const br = parseInt(bh.substring(0, 2), 16);
  const bg = parseInt(bh.substring(2, 4), 16);
  const bb = parseInt(bh.substring(4, 6), 16);
  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);
  return (
    "#" +
    rr.toString(16).padStart(2, "0") +
    rg.toString(16).padStart(2, "0") +
    rb.toString(16).padStart(2, "0")
  );
}

function AxisArrow({
  from = [0, 0, 0] as Vec3, // Line start point
  to = [1, 0, 0] as Vec3, // Line end point
  color,
  lineWidth = 10, // Line width
  label,
  labelDistance = 0, // Text distance from cube
  labelOffset = 0, // Text offset from line
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
  const [hovered, setHovered] = useState(false);
  const [displayColor, setDisplayColor] = useState(color ?? "#ffffff");
  const animRef = useRef<number>();

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const fromColor = displayColor; // Start from the current displayColor
    const toColor = hovered ? "#D7D7D7" : color ?? "#ffffff";
    const duration = 200;

    function animate(ts: number) {
      if (start === null) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      const interpolated = lerpColor(fromColor, toColor, t);
      setDisplayColor(interpolated);
      if (t < 1) {
        frame = requestAnimationFrame(animate);
        animRef.current = frame;
      }
    }

    frame = requestAnimationFrame(animate);
    animRef.current = frame;

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
    // Only depend on hovered and color!
  }, [hovered, color]);

  // Calculate direction vector
  const dir = [to[0] - from[0], to[1] - from[1], to[2] - from[2]];

  const len = Math.sqrt(dir[0] ** 2 + dir[1] ** 2 + dir[2] ** 2);
  const norm =
    len === 0 ? [0, 0, 0] : [dir[0] / len, dir[1] / len, dir[2] / len];

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
    const perpNorm =
      perpLen === 0 ? [0, 0] : [perp[0] / perpLen, perp[1] / perpLen];

    // Offset in screen space
    const labelScreen = [
      x2 + perpNorm[0] * labelOffset,
      y2 + perpNorm[1] * labelOffset,
    ];

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
      <Line
        points={[from, to]}
        color={displayColor}
        lineWidth={lineWidth}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        toneMapped={false}
      />
      <Html position={labelPos} center>
        <div
          className="axis-label"
          style={{
            color: displayColor,
            transform: `rotate(${angle}deg)`,
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {label}
        </div>
      </Html>
    </>
  );
}

export default function App() {
  return (
    <Canvas camera={{ position: [6, 4, 6], fov: 50 }}>
      <fog attach="fog" args={["#161616", 10, 18]} />

      {/* Cube with outline */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0}
          metalness={0.2}
        />
        {/* Gizmo lines/arrows with 2D labels */}
        <AxisArrow
          from={[0, 0, 0]}
          to={[100, 0, 0]}
          color="#FF4141"
          label="Contact"
          labelDistance={1.6}
          labelOffset={45}
        />
        <AxisArrow
          from={[0, 0, 0]}
          to={[0, 100, 0]}
          color="#54FF87"
          label="About"
          labelDistance={1.25}
          labelOffset={45}
        />
        <AxisArrow
          from={[0, 0, 0]}
          to={[0, 0, 100]}
          color="#8A9BFF"
          label="Projects"
          labelDistance={1.6}
          labelOffset={50}
        />
      </mesh>

      {/* Reflective ground */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={28}
          depthScale={0.5}
          minDepthThreshold={0.85}
          color="#161616"
          metalness={0.8}
          roughness={1}
        />
      </mesh>

      {/* Effects */}
      <EffectComposer>
        <Bloom
          intensity={0.1}
          luminanceThreshold={0.4}
        />
        <Noise opacity={0.02} />
      </EffectComposer>

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
