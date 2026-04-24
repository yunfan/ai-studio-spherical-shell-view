import { useState, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { generateFibonacciSphere } from './utils/math';
import { DataSphere } from './components/DataSphere';
import { SidebarEditor } from './components/SidebarEditor';

const PANEL_COUNT = 300;
const SPHERE_RADIUS = 7;

const initialCoreImg = 'https://picsum.photos/seed/core/800/800';
const DEFAULT_POOL = Array.from({ length: 10 }, (_, i) => `https://picsum.photos/seed/pool_${i}/400/300`);

export default function App() {
  const [coreImgUrl, setCoreImgUrl] = useState(initialCoreImg);
  const [imagePool, setImagePool] = useState<string[]>(DEFAULT_POOL);
  
  // Default to selecting the core to make it obvious it can be edited
  const [selectedId, setSelectedId] = useState<string | null>('core');

  // Initialize panels once
  const initialPanels = useMemo(() => {
    const points = generateFibonacciSphere(PANEL_COUNT, SPHERE_RADIUS);
    return points.map(p => ({
      ...p,
      customImgUrl: null as string | null,
      poolSeed: Math.floor(Math.random() * 100000),
    }));
  }, []);

  const [panels, setPanels] = useState(initialPanels);

  const handleSelect = (id: string | null) => {
    setSelectedId(id);
  };

  const handleImageChange = (newUrl: string) => {
    if (selectedId === 'core') {
      setCoreImgUrl(newUrl);
    } else if (selectedId && selectedId.startsWith('panel')) {
      setPanels(prev => prev.map(p => 
        p.id === selectedId ? { ...p, customImgUrl: newUrl } : p
      ));
    }
  };

  const displayPanels = useMemo(() => {
    return panels.map(p => {
      let finalUrl = p.customImgUrl;
      if (!finalUrl) {
        if (imagePool.length > 0) {
          finalUrl = imagePool[p.poolSeed % imagePool.length];
        } else {
          finalUrl = 'https://picsum.photos/seed/fallback/400/300';
        }
      }
      return {
        id: p.id,
        position: p.position as [number, number, number],
        imgUrl: finalUrl,
      };
    });
  }, [panels, imagePool]);

  const selectedImageUrl = useMemo(() => {
    if (selectedId === 'core') return coreImgUrl;
    if (selectedId && selectedId.startsWith('panel')) {
      const p = panels.find(panel => panel.id === selectedId);
      if (p) {
        return p.customImgUrl || (imagePool.length > 0 ? imagePool[p.poolSeed % imagePool.length] : 'https://picsum.photos/seed/fallback/400/300');
      }
    }
    return null;
  }, [selectedId, coreImgUrl, panels, imagePool]);

  return (
    <div className="flex pl-0 h-screen w-full bg-[#050505] overflow-hidden font-sans">
      {/* 3D Canvas Area */}
      <div className="flex-1 relative cursor-crosshair">
        <Canvas 
          camera={{ position: [0, 0, 16], fov: 45 }}
          onPointerMissed={() => setSelectedId(null)}
          gl={{ antialias: true }}
        >
           <Suspense fallback={null}>
             <DataSphere 
               panels={displayPanels} 
               coreImgUrl={coreImgUrl} 
               selectedId={selectedId}
               onSelect={handleSelect}
             />
           </Suspense>
        </Canvas>
        
        {/* Overlay Title */}
        <div className="absolute top-6 left-6 pointer-events-none z-10 text-white drop-shadow-md">
          <h1 className="text-2xl font-bold tracking-tight">Data Sphere</h1>
          <p className="text-sm text-zinc-400 mt-1">Interactive 3D Architecture</p>
        </div>
      </div>

      {/* Sidebar Area */}
      <div className="w-80 lg:w-96 h-full z-10 flex-shrink-0 shadow-2xl relative border-l border-zinc-800">
        <SidebarEditor 
          selectedId={selectedId} 
          imgUrl={selectedImageUrl} 
          onImageChange={handleImageChange}
          onSelectCore={() => handleSelect('core')}
          onSelectPool={() => handleSelect('pool')}
          imagePool={imagePool}
          onPoolAdd={(url: string) => setImagePool(prev => [...prev, url])}
          onPoolRemove={(index: number) => setImagePool(prev => prev.filter((_, i) => i !== index))}
        />
      </div>
    </div>
  );
}
