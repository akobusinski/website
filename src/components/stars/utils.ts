import { type IUniform, Shape, Vector3 } from "three";

export const FULL_ROTATION = Math.PI * 2;
export const VECTOR3_FORWARD = new Vector3(0, 0, 1);
export const STAR_SHAPE = createStar(1);

export type AtLeastOne<T> = [T, ...T[]];
export type Point2D = [x: number, y: number];
export type Resolvable<T> = T | Factory<T>;
export type ResolvableNumber = Resolvable<number> | [number, number];
export type Factory<T> = () => T;

export const intoFactory = <T,>(v: Resolvable<T>): Factory<T> => {
    if (typeof v === "function") {
        return v as () => T;
    }

    return () => v;
}

export const intoNumberFactory = (v: ResolvableNumber): Factory<number> => {
    if (Array.isArray(v)) {
        const min = Math.min(v[0], v[1]);
        const max = Math.max(v[0], v[1]);
        const diff = max - min;

        return () => Math.random() * diff + min;
    }
    
    return intoFactory(v)
}

export const makeUniforms = <T extends Record<string, any>>(obj: T): { [K in keyof T]: IUniform<T[K]> } => {
    const result = {} as { [K in keyof T]: IUniform<T[K]> };
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result[key] = { value: obj[key] };
        }
    }
    return result;
};

export function create_polygon_path(...[initial, ...points]: AtLeastOne<Point2D>): Shape {
    const path = new Shape();
    if (points.length < 3) throw new Error("A polygon requires at least three points.");

    path.moveTo(initial[0], initial[1]);
    for (const point of points) {
        path.lineTo(point[0], point[1]);
    }
    path.closePath()

    return path;
}

export interface StarSettings {
    points?: number;
    rotation?: number;
    inner_radius?: number;
}

export function createStar(outer_radius: number, settings?: StarSettings): Shape {
    const points        = settings?.points       || 5;
    const rotation      = settings?.rotation     || Math.PI / 2;
    const inner_radius  = settings?.inner_radius || outer_radius / 2;
    
    // this is a bit silly since if points was equal to 1, then it would be a polygon with two points, and would throw an error
    // which in this case it doesnt
    if (points === 0) return new Shape();
    const step = Math.PI / points;
    const vertices: Point2D[] = [];
    
    let angle = rotation;

    for (let i = 0; i < (2 * points); i++) {
        const radius = i % 2 === 0 ? outer_radius : inner_radius
        vertices.push([
            (Math.cos(angle) * radius),
            (Math.sin(angle) * radius),
        ]);

        angle += step;
    }

    // SAFETY: The vertices array will contain 2 * `points` elements,
    // this means that it can only be empty when the `points` variable is equal to 0, which we guard for. 
    return create_polygon_path(...(vertices as AtLeastOne<Point2D>));
}
