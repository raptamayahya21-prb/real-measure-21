export interface Point3D {
    x: number;
    y: number;
    z: number;
}

/**
 * Calculates the Euclidean distance between two 3D points.
 * Formula: d = sqrt((x2-x1)^2 + (y2-y1)^2 + (z2-z1)^2)
 */
export const calculateDistance = (p1: Point3D, p2: Point3D): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

/**
 * Calculates the scale factor (Scale S).
 * S = Real Distance (e.g., cm) / Virtual Distance (WebXR units, usually meters)
 */
export const calculateScaleFactor = (virtualDistance: number, realDistance: number): number => {
    if (virtualDistance === 0) return 0; // Avoid division by zero
    return realDistance / virtualDistance;
};

/**
 * Applies the scale factor to a raw virtual distance to get the final real measurement.
 * Final = Raw * S
 */
export const applyScaleFactor = (rawDistance: number, scaleFactor: number): number => {
    return rawDistance * scaleFactor;
};
