"use client";

import { useRef, useEffect } from "react";
import { Outlines } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

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

export default function Cube({ size = 1, segments = 2, color = "#3553ff" }) {
  const pivotRef = useRef<THREE.Group>(null);
  const cubeRef = useRef<THREE.Mesh>(null);
  const isAnimatingRef = useRef(false);
  
  const zAxis = new THREE.Vector3(0, 0, 1);
  const xAxis = new THREE.Vector3(1, 0, 0);

  const moveUp = () => {
    if (isAnimatingRef.current || !pivotRef.current || !cubeRef.current) return;
    isAnimatingRef.current = true;
    
    const tl = gsap.timeline();
    tl.to(pivotRef.current.rotation, { 
      duration: 0.3, 
      x: `-=${Math.PI / 2}`,
      ease: "power2.inOut"
    });
    tl.call(() => {
      if (pivotRef.current && cubeRef.current) {
        pivotRef.current.position.z -= 1;
        pivotRef.current.rotation.x = 0;
        cubeRef.current.rotateOnWorldAxis(xAxis, -Math.PI / 2);
        isAnimatingRef.current = false;
      }
    });
  };

  const moveDown = () => {
    if (isAnimatingRef.current || !pivotRef.current || !cubeRef.current) return;
    isAnimatingRef.current = true;
    
    const tl = gsap.timeline();
    tl.set(cubeRef.current.position, { z: "-=1" });
    tl.set(pivotRef.current.position, { z: "+=1" });
    tl.to(pivotRef.current.rotation, { 
      duration: 0.3, 
      x: `+=${Math.PI / 2}`,
      ease: "power2.inOut"
    });
    tl.call(() => {
      if (pivotRef.current && cubeRef.current) {
        pivotRef.current.rotation.x = 0;
        cubeRef.current.position.z += 1;
        cubeRef.current.rotateOnWorldAxis(xAxis, Math.PI / 2);
        isAnimatingRef.current = false;
      }
    });
  };

  const moveLeft = () => {
    if (isAnimatingRef.current || !pivotRef.current || !cubeRef.current) return;
    isAnimatingRef.current = true;
    
    const tl = gsap.timeline();
    tl.to(pivotRef.current.rotation, { 
      duration: 0.3, 
      z: `+=${Math.PI / 2}`,
      ease: "power2.inOut"
    });
    tl.call(() => {
      if (pivotRef.current && cubeRef.current) {
        pivotRef.current.position.x -= 1;
        pivotRef.current.rotation.z = 0;
        cubeRef.current.rotateOnWorldAxis(zAxis, Math.PI / 2);
        isAnimatingRef.current = false;
      }
    });
  };

  const moveRight = () => {
    if (isAnimatingRef.current || !pivotRef.current || !cubeRef.current) return;
    isAnimatingRef.current = true;
    
    const tl = gsap.timeline();
    tl.set(cubeRef.current.position, { x: "-=1" });
    tl.set(pivotRef.current.position, { x: "+=1" });
    tl.to(pivotRef.current.rotation, { 
      duration: 0.3, 
      z: `-=${Math.PI / 2}`,
      ease: "power2.inOut"
    });
    tl.call(() => {
      if (pivotRef.current && cubeRef.current) {
        pivotRef.current.rotation.z = 0;
        cubeRef.current.position.x += 1;
        cubeRef.current.rotateOnWorldAxis(zAxis, -Math.PI / 2);
        isAnimatingRef.current = false;
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowUp":
          moveUp();
          break;
        case "ArrowDown":
          moveDown();
          break;
        case "ArrowLeft":
          moveLeft();
          break;
        case "ArrowRight":
          moveRight();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <group ref={pivotRef}>
      <mesh ref={cubeRef} position={[0.5, 0.5, 0.5]}>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color="#D7D7D7" />
        <Outlines thickness={10} color="#3553ff" />
        <CubeWireframe size={size} segments={segments} color="#161616" />
      </mesh>
    </group>
  );
}