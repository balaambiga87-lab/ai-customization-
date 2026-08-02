import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { useBuilderStore } from '../../store/builderStore';

// Simple placeholder models mapping
const MODELS = {
  chain_gold: '/builder/chain_gold.glb',
  diamond_heart: '/builder/diamond_heart.glb',
  ruby_pendant: '/builder/ruby_pendant.glb',
};

// Generic model component
function Model({ url, position, scale = 1 }: { url: string, position: [number, number, number], scale?: number }) {
  // In a real app we would gracefully handle missing models
  // For the demo we use a placeholder box if the GLTF is missing
  try {
    const { scene } = useGLTF(url);
    return <primitive object={scene} position={position} scale={scale} />;
  } catch (e) {
    return (
      <mesh position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    );
  }
}

export function BuilderCanvas() {
  const { chain, pendants, updatePendantPosition } = useBuilderStore();

  return (
    <div className="w-full h-full bg-stone-50 rounded-lg overflow-hidden shadow-inner border border-stone-200">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          
          {/* Render Chain */}
          {chain && (
            <Model 
              url={MODELS[chain as keyof typeof MODELS] || MODELS.chain_gold} 
              position={[0, 0, 0]} 
            />
          )}

          {/* Render Pendants */}
          {pendants.map((pendant) => (
            <Model
              key={pendant.id}
              url={MODELS[pendant.type as keyof typeof MODELS] || MODELS.diamond_heart}
              position={pendant.position}
              scale={0.5}
            />
          ))}

          <OrbitControls makeDefault minDistance={2} maxDistance={10} />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload models for performance
Object.values(MODELS).forEach(url => {
  try { useGLTF.preload(url); } catch(e) {}
});
