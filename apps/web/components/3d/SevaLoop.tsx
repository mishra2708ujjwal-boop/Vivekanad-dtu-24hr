"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Torus, Sphere } from "@react-three/drei";
import * as THREE from "three";

const steps = ["Feel", "Connect", "Serve", "Learn", "Reflect", "Empower", "Continue"];

function LoopGroup() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Torus args={[2.5, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#C98A2B" opacity={0.4} transparent />
      </Torus>
      {steps.map((step, i) => {
        const angle = (i / steps.length) * Math.PI * 2;
        const x = Math.cos(angle) * 2.5;
        const z = Math.sin(angle) * 2.5;
        return (
          <group key={step} position={[x, 0, z]}>
            <Sphere args={[0.2, 32, 32]}>
              <meshStandardMaterial color="#FBF5EA" emissive="#C98A2B" emissiveIntensity={0.2} roughness={0.8} />
            </Sphere>
            <Html center position={[0, 0.4, 0]} className="text-[#FBF5EA] text-xs font-medium tracking-wider whitespace-nowrap pointer-events-none drop-shadow-md">
              {step}
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function SevaLoop() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (prefersReducedMotion) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center border border-primary/20 rounded-full aspect-square max-w-[400px] mx-auto p-8">
        {steps.map(step => (
          <div key={step} className="text-[#FBF5EA] text-sm my-1 font-medium">{step}</div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#FBF5EA" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6B2E1F" />
        <LoopGroup />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI/2 + 0.2} minPolarAngle={Math.PI/2 - 0.2} />
      </Canvas>
    </div>
  );
}
