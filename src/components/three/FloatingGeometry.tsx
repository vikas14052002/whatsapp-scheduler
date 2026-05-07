'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingShape({
  geometry,
  position,
  color,
  speed,
  scale = 1,
}: {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  color: string;
  speed: number;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * speed * 0.3;
    meshRef.current.rotation.y = t * speed * 0.2;
    meshRef.current.position.y = position[1] + Math.sin(t * speed) * 0.3;
    meshRef.current.position.x = position[0] + mouseRef.current.x * 0.2;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.12}
        wireframe
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Scene() {
  const shapes = useMemo(() => {
    return [
      { geo: new THREE.IcosahedronGeometry(1, 0), pos: [-3, 1, -2] as [number, number, number], color: '#E85D04', speed: 0.5, scale: 0.8 },
      { geo: new THREE.TorusKnotGeometry(0.6, 0.2, 64, 8), pos: [3, -1, -1] as [number, number, number], color: '#D4A574', speed: 0.3, scale: 0.6 },
      { geo: new THREE.OctahedronGeometry(0.8, 0), pos: [-2, -2, -3] as [number, number, number], color: '#25D366', speed: 0.4, scale: 0.7 },
      { geo: new THREE.TetrahedronGeometry(1, 0), pos: [2.5, 2, -2.5] as [number, number, number], color: '#F4A261', speed: 0.6, scale: 0.5 },
      { geo: new THREE.IcosahedronGeometry(0.5, 0), pos: [0, 3, -4] as [number, number, number], color: '#E85D04', speed: 0.7, scale: 0.4 },
    ];
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#E85D04" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#D4A574" />
      {shapes.map((s, i) => (
        <FloatingShape
          key={i}
          geometry={s.geo}
          position={s.pos}
          color={s.color}
          speed={s.speed}
          scale={s.scale}
        />
      ))}
    </>
  );
}

export default function FloatingGeometry() {
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
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
