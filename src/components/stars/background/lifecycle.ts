import { TypedArray } from "three";

export const LIFECYCLE_DATA_FIELDS = 2;
export const TIME_TO_LIVE_OFFSET = 0;
export const SPAWNED_AT_OFFSET = 1;

export function calculateLifecycleBase(index: number): number {
    return LIFECYCLE_DATA_FIELDS * index;
}

export function getLifecycleData(array: TypedArray, index: number): [timeToLive: number, spawnedAt: number] {
    const i = calculateLifecycleBase(index);

    return [
        array[i + TIME_TO_LIVE_OFFSET],
        array[i + SPAWNED_AT_OFFSET],
    ];
}

export function setLifecycleData(array: TypedArray, index: number, timeToLive: number, spawnedAt: number) {
    const i = LIFECYCLE_DATA_FIELDS * index;
    array[i + TIME_TO_LIVE_OFFSET] = timeToLive;
    array[i + SPAWNED_AT_OFFSET] = spawnedAt;
}

function hasExceededLifetime(elapsedTime: number, spawnedAt: number, timeToLive: number, offset: number) {
    const aliveTime = elapsedTime - spawnedAt;

    return aliveTime >= timeToLive + offset;
}

// These two functions are the exact same, but I like them being more explicit on what they are calculating
export function isDying(elapsedTime: number, spawnedAt: number, timeToLive: number, fadeInTime: number): boolean {
    return hasExceededLifetime(elapsedTime, spawnedAt, timeToLive, fadeInTime);
}

export function isDead(elapsedTime: number, spawnedAt: number, timeToLive: number, transitionTime: number): boolean {
    return hasExceededLifetime(elapsedTime, spawnedAt, timeToLive, transitionTime);
}
