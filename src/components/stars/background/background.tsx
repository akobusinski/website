import { type ThreeElements, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { FULL_ROTATION, makeUniforms, Resolvable, ResolvableNumber, STAR_SHAPE } from "../utils";
import { type InstancedMesh, GLSL3, BufferGeometry, InstancedBufferAttribute, Vector2 } from "three";

import VERTEX_SHADER from "@/shaders/background_stars.vert";
import FRAGMENT_SHADER from "@/shaders/background_stars.frag";
import { useStarFactories } from "./useStarFactories";
import { useStarCapacity, useStarCount } from "./useStarCapacity";
import { useStarFrame } from "./useStarFrame";

export interface BackgroundStarsProps {
    stars?:        number;
    density?:     number;
    scale:        ResolvableNumber;
    rotation?:    ResolvableNumber;
    ttl?:         ResolvableNumber;
    preAge?:      ResolvableNumber;
    color?:       Resolvable<string>;
    fadeInTime?:  number;
    fadeOutTime?: number;
}

type InstancedMeshArgs = ThreeElements['instancedMesh']['args']

export default function BackgroundStars({
    stars,
    density,
    scale,
    rotation    = [0, FULL_ROTATION],
    ttl         = [20, 30],
    preAge      = [0, 20],
    color       = "#FFFF77",
    fadeInTime  = 2,
    fadeOutTime = 2,
}: BackgroundStarsProps) {
    if (stars === undefined && density === undefined) {
        throw new Error("Either the stars or density prop has to be defined.");
    }
    
    const mesh_ref = useRef<InstancedMesh>(undefined);
    const geometry_ref = useRef<BufferGeometry>(undefined);
    const lifecycle_ref = useRef<InstancedBufferAttribute>(undefined);

    const size = useThree(state => state.size);
    const viewport = useThree(state => state.viewport);
    const uniforms = useRef(makeUniforms({ // We need to keep this object in a useRef in order to not break useFrame after a re-render
        elapsedTime: 0,
        rotationSpeed: FULL_ROTATION / 8, // 45 degrees per second
        fadeInTime,
        fadeOutTime,
        viewport: new Vector2(viewport.width, viewport.height),
    }));

    useLayoutEffect(() => {
        uniforms.current.viewport.value.set(viewport.width, viewport.height);
    }, [viewport]);
    
    const factories = useStarFactories({ scale, rotation, ttl, preAge, color });
    const starCount = useStarCount(size, stars, density);
    // required to trick R3F into thinking that the component doesnt need rerenders, we change it via the ref instead
    const initialMeshArgs = useMemo<InstancedMeshArgs>(() => [undefined, undefined, starCount], []);
    useStarCapacity(
        starCount, fadeInTime,
        mesh_ref, lifecycle_ref, geometry_ref,
        factories,
        () => uniforms.current.elapsedTime.value,
    );
    useStarFrame(
        starCount,
        fadeInTime + fadeOutTime,
        mesh_ref,
        lifecycle_ref,
        uniforms.current.elapsedTime,
        factories,
    );

    // Keep constructor args stable so R3F does not recreate the mesh on later rerenders.
    return <instancedMesh ref={mesh_ref} args={initialMeshArgs}>
        <shapeGeometry ref={geometry_ref} args={[STAR_SHAPE]} />
        <rawShaderMaterial
            glslVersion={GLSL3}
            uniforms={uniforms.current}
            vertexShader={VERTEX_SHADER}
            fragmentShader={FRAGMENT_SHADER}
            transparent
        />
    </instancedMesh>
}
