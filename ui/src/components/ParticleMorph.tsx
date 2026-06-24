'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Generates a sphere of particles to represent the Agent's "Brain" or "Dreaming State"
function ParticleCloud({ isDreaming }: { isDreaming: boolean }) {
  const ref = useRef<THREE.Points>(null);
  
  // Create 5000 particles
  const positions = useMemo(() => {
    const p = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const r = 2 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      // Rotate the cloud
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
      
      // Accelerate rotation when "dreaming"
      if (isDreaming) {
        ref.current.rotation.y += delta;
      }
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        // Change color based on standard mode vs dreaming mode
        color={isDreaming ? "#ff00ff" : "#00ffff"}
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function ParticleMorphDashboard({ isDreaming = false }: { isDreaming?: boolean }) {
  return (
    <div className="w-full h-full min-h-[300px] bg-black rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ParticleCloud isDreaming={isDreaming} />
      </Canvas>
    </div>
  );
}
