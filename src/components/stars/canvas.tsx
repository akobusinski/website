"use client";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import BackgroundStars from "./background/background";

// https://easings.net/#easeInExpo
const easeInExpo = (x: number): number => x === 0 ? 0 : Math.pow(2, 10 * x - 10);

export function StarCanvas() {
    return <Canvas
        className="w-full h-full"
        camera={{ position: [0, 0, 500], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
    >
        <color attach="background" args={["#000000"]} />
        <EffectComposer>
            <Bloom
                intensity={0.5}
                luminanceThreshold={0.75}
                luminanceSmoothing={0.5}
            />
        </EffectComposer>

        <BackgroundStars
            density={0.00125}
            scale={() => easeInExpo(Math.random()) * 2 + 2} // Range from 2 to 4
            ttl={[20, 30]}
            preAge={[0, 20]}
            color="#ffff77"
        />
    </Canvas>
}
