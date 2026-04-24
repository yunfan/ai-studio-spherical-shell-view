import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture, Edges, Line } from '@react-three/drei';
import * as THREE from 'three';

interface PanelProps {
  position: [number, number, number];
  imgUrl: string;
  isSelected: boolean;
  onClick: () => void;
}

const PANEL_WIDTH = 1.2;
const PANEL_HEIGHT = 0.8;

function Panel({ position, imgUrl, isSelected, onClick }: PanelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Orient the panel to face outward from the center
  React.useLayoutEffect(() => {
    if (meshRef.current) {
      const pos = new THREE.Vector3(...position);
      meshRef.current.position.copy(pos);
      // Face perfectly outward to maintain upright orientation relative to poles
      meshRef.current.lookAt(pos.x * 2, pos.y * 2, pos.z * 2);
    }
  }, [position]);

  // Subtle hovering animation for panels based on ID/position to avoid uniformity
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    // Add a very subtle floating offset using sine waves
    const offset = Math.sin(time * 0.5 + position[0]) * 0.05;
    const pos = new THREE.Vector3(...position);
    meshRef.current.position.copy(pos.add(pos.clone().normalize().multiplyScalar(offset)));
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <planeGeometry args={[PANEL_WIDTH, PANEL_HEIGHT]} />
      <Suspense fallback={<meshStandardMaterial color="#222" />}>
        <AsyncPanelMaterial imgUrl={imgUrl} isSelected={isSelected} />
      </Suspense>
      <Edges scale={1.001} color={isSelected ? "#00ffcc" : "#cf8f42"} threshold={15} />
    </mesh>
  );
}

function AsyncPanelMaterial({ imgUrl, isSelected }: { imgUrl: string; isSelected: boolean }) {
  const texture = useTexture(imgUrl);
  return (
    <meshStandardMaterial 
      map={texture} 
      side={THREE.DoubleSide}
      emissive={isSelected ? new THREE.Color("#00ffcc") : new THREE.Color("#000000")}
      emissiveIntensity={isSelected ? 0.3 : 0}
      transparent
    />
  );
}

interface CoreProps {
  imgUrl: string;
  isSelected: boolean;
  onClick: () => void;
}

function Core({ imgUrl, isSelected, onClick }: CoreProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * 0.15; // Counter-rotate relative to shell purely horizontally
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      <sphereGeometry args={[2.5, 64, 64]} />
      <Suspense fallback={<meshStandardMaterial color="#111" />}>
        <AsyncCoreMaterial imgUrl={imgUrl} isSelected={isSelected} />
      </Suspense>
    </mesh>
  );
}

function AsyncCoreMaterial({ imgUrl, isSelected }: { imgUrl: string; isSelected: boolean }) {
  const texture = useTexture(imgUrl);
  
  const tiledTexture = useMemo(() => {
    const t = texture.clone();
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(8, 4); // Tile the image
    t.needsUpdate = true;
    return t;
  }, [texture]);

  return (
    <meshPhysicalMaterial 
      map={tiledTexture} 
      emissive={isSelected ? new THREE.Color("#444444") : new THREE.Color("#000000")}
      emissiveIntensity={isSelected ? 0.5 : 0}
      roughness={0.1}
      metalness={0.9}
      clearcoat={1.0}
      clearcoatRoughness={0.1}
    />
  );
}

// Interconnecting web of lines between panels
function Connections({ points }: { points: [number, number, number][] }) {
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    
    // Simple spatial grouping or brute force for n=300 (which is fast enough)
    for (let i = 0; i < points.length; i++) {
      const p1 = new THREE.Vector3(...points[i]);
      let connections = 0;
      for (let j = i + 1; j < points.length; j++) {
        const p2 = new THREE.Vector3(...points[j]);
        if (p1.distanceTo(p2) < 2.5 && connections < 4) { // Connect to nearby points
          positions.push(p1.x, p1.y, p1.z);
          positions.push(p2.x, p2.y, p2.z);
          connections++;
        }
      }
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [points]);

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial color="#ffaa33" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

interface DataSphereProps {
  panels: { id: string; imgUrl: string; position: [number, number, number] }[];
  coreImgUrl: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function DataSphere({ panels, coreImgUrl, selectedId, onSelect }: DataSphereProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Slow horizontal rotation of the entire shell
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  const connectionPoints = useMemo(() => panels.map(p => p.position), [panels]);

  return (
    <>
      <OrbitControls enablePan={false} minDistance={4} maxDistance={25} />
      <Stars radius={100} depth={50} count={6000} factor={4} saturation={0.5} fade speed={1} />
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#ffaa00" />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffaa55" distance={15} /> {/* Center inner light */}

      <group ref={groupRef}>
        <Connections points={connectionPoints} />
        <Core 
          imgUrl={coreImgUrl} 
          isSelected={selectedId === 'core'} 
          onClick={() => onSelect('core')} 
        />
        {panels.map((panel) => (
          <Panel
            key={panel.id}
            position={panel.position}
            imgUrl={panel.imgUrl}
            isSelected={selectedId === panel.id}
            onClick={() => onSelect(panel.id)}
          />
        ))}
      </group>
    </>
  );
}
