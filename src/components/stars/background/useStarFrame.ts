import type { RefObject } from "react";
import type { BufferAttribute, InstancedMesh, IUniform } from "three";
import type { Factories } from "./useStarFactories";
import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import { getLifecycleData, isDead } from "./lifecycle";
import { createStar } from "./utils";

export function useStarFrame(
    starCount: number,
    transitionTime: number,
    mesh_ref: RefObject<InstancedMesh | undefined>,
    lifecycle_ref: RefObject<BufferAttribute | undefined>,
    elapsedTime_uniform: IUniform<number>,
    factories: Factories,
) {
    const isActiveRef = useRef(true);
    const syncActivity = useCallback(() => {
        isActiveRef.current = document.hasFocus() && !document.hidden;
    }, []);

    useEffect(() => {
        syncActivity();
        window.addEventListener("focus", syncActivity);
        window.addEventListener("blur", syncActivity);
        document.addEventListener("visibilitychange", syncActivity);

        return () => {
            window.removeEventListener("focus", syncActivity);
            window.removeEventListener("blur", syncActivity);
            document.removeEventListener("visibilitychange", syncActivity);
        };
    }, []);

    useFrame((_, deltaTime) => {
        if (!isActiveRef.current) return;

        let updated = false;
        elapsedTime_uniform.value += deltaTime;
        const elapsedTime = elapsedTime_uniform.value;
        
        const mesh = mesh_ref.current as InstancedMesh;
        const lifecycle = lifecycle_ref.current as BufferAttribute;
        const lifecycleArray = lifecycle.array;

        for (let i = 0; i < starCount; i++) {
            const [timeToLive, spawnedAt] = getLifecycleData(lifecycleArray, i);
            
            if (!isDead(elapsedTime, spawnedAt, timeToLive, transitionTime)) continue;
            updated = true;
            createStar(
                mesh,
                lifecycleArray,
                i,
                elapsedTime,
                factories,
            );
        }

        if (updated) {
            lifecycle.needsUpdate = true;
            mesh.instanceMatrix.needsUpdate = true;
        }
    });
}
