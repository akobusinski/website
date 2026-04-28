import type { BufferGeometry, InstancedMesh, Usage } from "three";
import type { Size } from "@react-three/fiber";
import type { RefObject } from "react";
import type { Factory } from "../utils";
import { DynamicDrawUsage, InstancedBufferAttribute } from "three";
import { useLayoutEffect, useMemo, useRef } from "react";
import { calculateLifecycleBase, getLifecycleData, isDying, LIFECYCLE_DATA_FIELDS, SPAWNED_AT_OFFSET } from "./lifecycle";
import { createStar } from "./utils";
import { Factories } from "./useStarFactories";

/**
 * Hook in order to get the amount of stars that should be rendered
 * @param size The viewport on which the stars are going to be rendered
 * @param stars Fixed amount of stars
 * @param density Density of stars, calculated dynamically from viewport, takes precedence before `stars`
 * @returns The amount of stars
 */
export function useStarCount(size: Size, stars?: number, density?: number) {
    return useMemo(() => {
        // density takes precedence before fixed star count
        if (density !== undefined) {
            const pixels = size.width * size.height;
            return Math.floor(pixels * density);
        }

        return stars!; // we just checked that its not undefined
    }, [size, stars, density]);
}

/**
 * @param capacity
 * @param itemSize
 * @param usage
 * @returns The created buffer
 */
function createBuffer(capacity: number, itemSize: number, usage: Usage = DynamicDrawUsage): InstancedBufferAttribute {
    const array = new Float32Array(capacity * itemSize);
    const buffer = new InstancedBufferAttribute(array, itemSize);
    buffer.usage = usage;

    return buffer;
}

/**
 * Grow an `InstancedBufferAttribute` and preserve its data
 * @warning You have to set `.needsUpdate` yourself
 * @param oldBuffer Old buffer to copy from
 * @param newCapacity The capacity to grow the buffer into
 * @returns The new buffer
 */
function growBuffer(oldBuffer: InstancedBufferAttribute, newCapacity: number): InstancedBufferAttribute {
    const buffer = createBuffer(newCapacity, oldBuffer.itemSize);
    buffer.array.set(oldBuffer.array); // old array should have a smaller capacity, otherwise we fucked up somewhere else
    buffer.usage = oldBuffer.usage;
    return buffer
}

enum LifecycleChanges {
    NONE = 0,
    CHANGED = 1,
    RECREATED = 2,
}

export function useStarCapacity(
    starCount: number,
    fadeInTime: number,
    mesh_ref: RefObject<InstancedMesh | undefined>,
    lifecycle_ref: RefObject<InstancedBufferAttribute | undefined>,
    geometry_ref: RefObject<BufferGeometry | undefined>,
    factories: Factories,
    elapsedTime: Factory<number>,
) {
    const starCapacity = useRef<number>(starCount);

    useLayoutEffect(() => {
        const mesh = mesh_ref.current!;
        const geometry = geometry_ref.current!;
        const elapsed = elapsedTime();
        let lifecycle_changed = 0;

        if (lifecycle_ref.current === undefined) { // only on first render
            // could be starCount since they are equal on first render but I think this makes it more explicit on whats happening
            lifecycle_ref.current = createBuffer(starCapacity.current, LIFECYCLE_DATA_FIELDS);
            for (let i = 0; i < starCapacity.current; i++) { // populate star data on first render
                createStar(mesh, lifecycle_ref.current.array, i, elapsed, factories, true);
            }

            lifecycle_changed |= LifecycleChanges.CHANGED | LifecycleChanges.RECREATED;
        }

        if (starCount > starCapacity.current) { // grow buffer
            const oldCapacity = starCapacity.current;
            const lifecycle = lifecycle_ref.current = growBuffer(lifecycle_ref.current, starCount);
            mesh.instanceMatrix = growBuffer(mesh.instanceMatrix, starCount);
            // capacity is still set to the old capacity
            for (let i = oldCapacity; i < starCount; i++) { // populate the new stars so they are not filled with garbage
                createStar(mesh, lifecycle.array, i, elapsed, factories);
            }
            
            mesh.count = starCount
            starCapacity.current = starCount;
            mesh.instanceMatrix.needsUpdate = true;
            lifecycle_changed |= LifecycleChanges.CHANGED | LifecycleChanges.RECREATED;
        } else if (starCount < starCapacity.current) {
            const lifecycle_array = lifecycle_ref.current.array;
            for (let i = starCount; i < starCapacity.current; i++) { // natural selection.
                const [timeToLive, spawnedAt] = getLifecycleData(lifecycle_array, i);
                if (isDying(elapsed, spawnedAt, timeToLive, fadeInTime)) continue; // only "kill" starts that are not already dying
             
                const base = calculateLifecycleBase(i);
                // Mutate the data to seem like this star is meant to be fading out
                lifecycle_array[base + SPAWNED_AT_OFFSET] = elapsed - timeToLive - fadeInTime;
                lifecycle_changed |= LifecycleChanges.CHANGED;
            }
        }

        if ((lifecycle_changed & LifecycleChanges.RECREATED) !== 0) {
            geometry.setAttribute('inLifecycle', lifecycle_ref.current);
        }

        if ((lifecycle_changed & LifecycleChanges.CHANGED) !== 0) {
            lifecycle_ref.current.needsUpdate = true;
        }
    }, [starCount]);

    return starCapacity;
}
