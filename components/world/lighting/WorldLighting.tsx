"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export function WorldLighting() {
  return (
    <>
      <ambientLight intensity={0.08} color="#ffffff" />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={0.15} 
        color="#ffffff" 
      />
      
      <EffectComposer>
        <Bloom 
          intensity={0.8} 
          luminanceThreshold={0.6} 
          luminanceSmoothing={0.4} 
          mipmapBlur 
        />
        <Vignette 
          offset={0.4} 
          darkness={0.7} 
          blendFunction={BlendFunction.NORMAL} 
        />
      </EffectComposer>
    </>
  );
}
