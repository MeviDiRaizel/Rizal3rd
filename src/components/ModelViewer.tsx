import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Mesh, Group } from 'three';

interface ModelProps {
  path: string;
}

const Model: React.FC<ModelProps> = ({ path }) => {
  const primitiveRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const [error, setError] = useState(false);
  
  const { scene } = useGLTF(path, true);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Error loading model:', event.error);
      setError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [path]);

  useFrame(() => {
    if (primitiveRef.current) {
      primitiveRef.current.rotation.y += 0.01;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  if (error) {
    return (
      <mesh ref={meshRef} scale={[2, 2, 2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#c08a4c" />
      </mesh>
    );
  }

  if (scene) {
    return <primitive ref={primitiveRef} object={scene} scale={2} />;
  }

  return (
    <mesh ref={meshRef} scale={[2, 2, 2]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#c08a4c" />
    </mesh>
  );
};

// Preload models
const models = [
  '/Rizal3rd/models/ibarra.glb',
  '/Rizal3rd/models/eliasFINAL.glb',
  '/Rizal3rd/models/maria.glb',
  '/Rizal3rd/models/damaso.glb',
  '/Rizal3rd/models/tiago.glb',
  '/Rizal3rd/models/salvi.glb',
  '/Rizal3rd/models/alferez.glb',
  '/Rizal3rd/models/guevara.glb',
  '/Rizal3rd/models/victorina.glb'
];

models.forEach(model => {
  try {
    useGLTF.preload(model);
  } catch (error) {
    console.error(`Error preloading model ${model}:`, error);
  }
});

interface ModelViewerProps {
  modelPath: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelPath }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [modelPath]);

  return (
    <div className="model-container relative">
      <Canvas>
        {/* Improved Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[5, 10, 7.5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />
        <Model path={modelPath} />
        {/* Enable zoom with scroll */}
        <OrbitControls enableZoom={true} />
      </Canvas>
      <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded text-xs text-secondary-700">
        Drag to rotate, scroll to zoom
      </div>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100/80">
          <p className="text-red-700 font-playfair">Failed to load 3D model</p>
        </div>
      )}
    </div>
  );
};

export default ModelViewer;