import { Matrix4, Quaternion, Vector3, InstancedBufferAttribute } from "three";
import type { InstancedMesh, TypedArray } from "three";
import type { Factories } from "./useStarFactories";
import { VECTOR3_FORWARD } from "../utils";
import { LIFECYCLE_DATA_FIELDS } from "./lifecycle";

/** THIS FUNCTION CAN ONLY BE CALLED ONCE AT A TIME
 * (NO MULTITHREADING‼️‼️‼️‼️ [idk if js even has proper multithreading lolz]) */
export const createStar = (() => {
    const matrix = new Matrix4();
    const position = new Vector3();
    const quaternion = new Quaternion();
    const scale = new Vector3();
    
    return (
        mesh: InstancedMesh,
        lifecycleArray: TypedArray,
        index: number,
        elapsedTime: number,
        factories: Factories,
        preAge: boolean = false,
    ) => {
        const { scaleFactory, rotationFactory, ttlFactory, preAgeFactory } = factories;
        position.setX(1 - (Math.random() * 2));
        position.setY(1 - (Math.random() * 2));
        quaternion.setFromAxisAngle(VECTOR3_FORWARD, rotationFactory.current());
        scale.setScalar(scaleFactory.current());
        matrix.compose(position, quaternion, scale);
        mesh.setMatrixAt(index, matrix);

        
        const lifecycleIndex = index * LIFECYCLE_DATA_FIELDS;
        lifecycleArray[lifecycleIndex + 0] = ttlFactory.current();
        lifecycleArray[lifecycleIndex + 1] = elapsedTime - (preAge ? preAgeFactory.current() : 0);
    }
})();
