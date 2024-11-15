import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, Mesh, Group, Color } from "three";
import { OrbitControls } from "@react-three/drei";

interface LeafProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  speed: number;
}

function Leaf({ position, rotation, scale, speed }: LeafProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.05;
      meshRef.current.rotation.z += 0.05;
      meshRef.current.position.y -= 0.02 * speed;
      if (meshRef.current.position.y < -3) meshRef.current.position.y += 6;
    }
  });

  const texture = useLoader(TextureLoader, "static/leaf.png");

  // Reduce the scale by multiplying it with a factor less than 1
  const smallerScale = scale * 0.2;

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={smallerScale}
    >
      <planeGeometry args={[1, 1, 10, 10]} />
      <meshBasicMaterial
        map={texture}
        color="#FFE4B5"
        transparent={true}
        side={2}
      />
    </mesh>
  );
}

function LeafScene() {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01; // Reduced rotation speed
    }
  });

  const leaves = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 3,
      ] as [number, number, number],
      rotation: [
        0,
        (Math.random() - 0.5) * 6.28,
        (Math.random() - 0.5) * 6.28,
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 0.25 + 0.05, // Further reduced speed range for slower falling
      key: i,
    }));
  }, []);

  return (
    <group ref={groupRef}>
      {leaves.map(({ key, ...props }) => (
        <Leaf key={key} {...props} />
      ))}
    </group>
  );
}

export function Leaves() {
  // Add error boundary state
  const [hasWebGLError, setHasWebGLError] = React.useState(false);

  // Early return if WebGL error occurs
  if (hasWebGLError) {
    return null; // Or return a fallback UI
  }

  return (
    <>
      <div className="absolute right-0 top-0 z-[-1] h-screen w-[60vw] bg-gradient-to-r from-white to-transparent"></div>

      <div className="absolute right-0 top-0 z-[-2]">
        <Canvas
          camera={{ position: [0, 0, 7], fov: 35 }}
          gl={{ antialias: true }}
          onCreated={({ gl }) => {
            gl.setClearColor(new Color(1, 1, 1), 1);
          }}
          style={{ width: "60vw", height: "100vh" }}
          onError={() => setHasWebGLError(true)} // Add error handler
          fallback={null} // Add fallback
        >
          <OrbitControls />
          <LeafScene />
        </Canvas>
      </div>
    </>
  );
}
