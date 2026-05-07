'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const COLORS = ['#E85D04', '#D4A574', '#25D366', '#F4A261', '#E8EDE6'];
const PARTICLE_COUNT = 300;

function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const c = new THREE.Color(COLORS[Math.floor(Math.random() * COLORS.length)]);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      sz[i] = Math.random() * 2.5 + 0.5;
    }
    return [pos, col, sz];
  }, []);

  const velocities = useMemo(() => {
    const v = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      v[i * 3] = (Math.random() - 0.5) * 0.003;
      v[i * 3 + 1] = Math.random() * 0.002 + 0.001;
      v[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    return v;
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;

      posArray[idx] += velocities[idx] + mouseRef.current.x * 0.002;
      posArray[idx + 1] += velocities[idx + 1];
      posArray[idx + 2] += velocities[idx + 2] + mouseRef.current.y * 0.001;

      if (posArray[idx + 1] > 6) posArray[idx + 1] = -6;
      if (posArray[idx] > 6) posArray[idx] = -6;
      if (posArray[idx] < -6) posArray[idx] = 6;
    }

    posAttr.needsUpdate = true;

    meshRef.current.rotation.y += delta * 0.02;
    meshRef.current.rotation.x = mouseRef.current.y * 0.1;
  });

  const positionAttr = useMemo(() => new THREE.BufferAttribute(positions, 3), [positions]);
  const colorAttr = useMemo(() => new THREE.BufferAttribute(colors, 3), [colors]);
  const sizeAttr = useMemo(() => new THREE.BufferAttribute(sizes, 1), [sizes]);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <primitive attach="attributes-position" object={positionAttr} />
        <primitive attach="attributes-color" object={colorAttr} />
        <primitive attach="attributes-size" object={sizeAttr} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ConnectionLines() {
  const lineRef = useRef<THREE.LineSegments>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const particlePositions = useMemo(() => {
    const pos: THREE.Vector3[] = [];
    for (let i = 0; i < 40; i++) {
      pos.push(new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 4
      ));
    }
    return pos;
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useFrame(() => {
    if (!lineRef.current) return;
    const positions: number[] = [];
    const maxDist = 2.5;

    for (let i = 0; i < particlePositions.length; i++) {
      for (let j = i + 1; j < particlePositions.length; j++) {
        const dist = particlePositions[i].distanceTo(particlePositions[j]);
        if (dist < maxDist) {
          positions.push(
            particlePositions[i].x + mouseRef.current.x * 0.3,
            particlePositions[i].y + mouseRef.current.y * 0.3,
            particlePositions[i].z,
            particlePositions[j].x + mouseRef.current.x * 0.3,
            particlePositions[j].y + mouseRef.current.y * 0.3,
            particlePositions[j].z
          );
        }
      }
    }

    const geometry = lineRef.current.geometry as THREE.BufferGeometry;
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color="#E85D04" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

export default function ParticleField() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Particles />
        <ConnectionLines />
      </Canvas>
    </div>
  );
}
