"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Center,
  Environment,
  Grid,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

function LoadedModel({ url }: { url: string }) {
  const gltf = useGLTF(url);
  return (
    <Center>
      <primitive object={gltf.scene} />
    </Center>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color="#f97316" wireframe />
    </mesh>
  );
}

export function GlbStage({ url }: { url: string }) {
  const orbitRef = useRef<OrbitControlsImpl | null>(null);

  useEffect(() => {
    return () => {
      useGLTF.clear(url);
    };
  }, [url]);

  return (
    <div className="relative h-[min(56vh,520px)] w-full min-h-[280px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-inner shadow-black/40">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-end p-2">
        <button
          type="button"
          onClick={() => orbitRef.current?.reset()}
          className="pointer-events-auto rounded-lg border border-white/15 bg-slate-950/90 px-3 py-1.5 text-xs font-medium text-slate-100 shadow-md backdrop-blur-sm transition hover:bg-slate-800/95"
        >
          Réinitialiser la vue
        </button>
      </div>
      <Canvas
        camera={{ position: [3.2, 2.2, 3.2], fov: 40 }}
        gl={{
          alpha: false,
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
          outputColorSpace: SRGBColorSpace,
        }}
        dpr={[1, 2.5]}
      >
        <color attach="background" args={["#0f172a"]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[6, 10, 4]} intensity={1.35} castShadow={false} />
        <directionalLight position={[-4, 4, -2]} intensity={0.45} />
        <Grid
          args={[20, 20]}
          position={[0, -0.02, 0]}
          cellSize={0.5}
          cellThickness={0.4}
          cellColor="#334155"
          sectionSize={2}
          sectionThickness={0.9}
          sectionColor="#475569"
          fadeDistance={28}
          fadeStrength={1}
          infiniteGrid
        />
        <Suspense fallback={<LoadingFallback />}>
          <Environment preset="city" environmentIntensity={0.9} />
          <LoadedModel url={url} />
        </Suspense>
        <OrbitControls
          ref={orbitRef}
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={1.2}
          maxDistance={24}
        />
      </Canvas>
    </div>
  );
}
