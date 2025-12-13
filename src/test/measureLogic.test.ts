import { describe, it, expect } from 'vitest';
import { calculateDistance, calculateScaleFactor, applyScaleFactor, Point3D } from '../logic/measurement';

describe('Measurement Logic (Phase 1 Logic Testing)', () => {
    // 1.1 Test 3D Distance (Pythagoras)
    it('1.1 should calculate correct 3D distance for simple coordinates', () => {
        const p1: Point3D = { x: 0, y: 0, z: 0 };
        const p2: Point3D = { x: 3, y: 4, z: 0 };
        const result = calculateDistance(p1, p2);
        expect(result).toBe(5);
    });

    // 1.2 Test Diagonal Distance
    it('1.2 should calculate correct diagonal distance', () => {
        const p1: Point3D = { x: 1, y: 1, z: 1 };
        const p2: Point3D = { x: 4, y: 5, z: 5 };
        // dx=3, dy=4, dz=4
        // d = sqrt(9 + 16 + 16) = sqrt(41) ≈ 6.4031
        const result = calculateDistance(p1, p2);
        expect(result).toBeCloseTo(6.4031, 3);
    });

    // 1.3 Test Scale Factor Application
    it('1.3 should apply scale factor correctly', () => {
        const rawDistance = 5; // e.g., 5 meters in WebXR
        const scaleFactor = 100; // e.g., 1 meter = 100 units
        const result = applyScaleFactor(rawDistance, scaleFactor);
        expect(result).toBe(500);
    });

    // Additional Basic Math Tests
    it('should handle zero distance', () => {
        const p1: Point3D = { x: 1, y: 1, z: 1 };
        const p2: Point3D = { x: 1, y: 1, z: 1 };
        expect(calculateDistance(p1, p2)).toBe(0);
    });

    it('calculateScaleFactor should handle zero division gracefully', () => {
        expect(calculateScaleFactor(0, 10)).toBe(0);
    });

    it('calculateScaleFactor should be correct', () => {
        // Virtual = 0.5, Real = 50. Scale = 100.
        expect(calculateScaleFactor(0.5, 50)).toBe(100);
    });
});
