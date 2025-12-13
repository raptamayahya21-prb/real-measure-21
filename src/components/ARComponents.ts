/* eslint-disable @typescript-eslint/no-explicit-any */
import 'aframe';
import { calculateDistance, Point3D } from '../logic/measurement';

declare const AFRAME: any;

// Define states
type ARState = 'idle' | 'calibrating-a' | 'calibrating-b' | 'measuring-start' | 'measuring-end';

interface ARControllerData {
    state: string;
    target: string; // Selector for reticle
}

AFRAME.registerComponent('ar-controller', {
    schema: {
        state: { type: 'string', default: 'idle' },
        target: { type: 'selector' }
    },

    init: function () {
        this.ctx = {
            state: 'idle' as ARState,
            pointA: null as Point3D | null,
            pointB: null as Point3D | null,
            measureStart: null as Point3D | null,
            measureEnd: null as Point3D | null
        };

        this.reticle = this.data.target;

        // Bind methods
        this.onSelect = this.onSelect.bind(this);

        // Add listener to the scene (WebXR select event)
        this.el.sceneEl.addEventListener('select', this.onSelect); // Standard WebXR select
        this.el.sceneEl.addEventListener('click', this.onSelect);  // Fallback for non-WebXR testing (mouse click)
    },

    update: function (oldData: ARControllerData) {
        if (oldData.state !== this.data.state) {
            this.ctx.state = this.data.state as ARState;
            console.log("AR State Updated:", this.ctx.state);

            // Clear temp points if resetting state (optional logic)
            if (this.ctx.state === 'calibrating-a') {
                this.ctx.pointA = null;
                this.ctx.pointB = null;
            }
            if (this.ctx.state === 'measuring-start') {
                this.ctx.measureStart = null;
                this.ctx.measureEnd = null;
                // Clear any existing lines
                const lines = this.el.querySelectorAll('.measurement-line');
                lines.forEach((l: any) => l.parentNode.removeChild(l));
            }
        }
    },

    onSelect: function () {
        if (!this.reticle || !this.reticle.object3D.visible) return;

        // Get Position from Reticle
        const position = this.reticle.object3D.position;
        const currentPoint: Point3D = { x: position.x, y: position.y, z: position.z };

        console.log("AR Select at:", currentPoint, "State:", this.ctx.state);

        switch (this.ctx.state) {
            case 'calibrating-a':
                this.ctx.pointA = currentPoint;
                this.dispatch('ar-calibration-point', { point: 'A', position: currentPoint });
                // Move to next state logic is handled by React updating the prop, but for smooth ux we can predict? 
                // No, sticking to unidirectional flow: Emit event -> React Update Props -> Component Update
                break;

            case 'calibrating-b':
                this.ctx.pointB = currentPoint;
                const dist = calculateDistance(this.ctx.pointA!, this.ctx.pointB!); // logic from our module
                this.dispatch('ar-calibration-point', { point: 'B', position: currentPoint, rawDistance: dist });
                this.createMarker(currentPoint, 'red');
                break;

            case 'measuring-start':
                this.ctx.measureStart = currentPoint;
                this.dispatch('ar-measurement-point', { point: 'start', position: currentPoint });
                this.createMarker(currentPoint, 'blue');
                break;

            case 'measuring-end':
                this.ctx.measureEnd = currentPoint;
                if (this.ctx.measureStart) {
                    const mDist = calculateDistance(this.ctx.measureStart, this.ctx.measureEnd);
                    this.dispatch('ar-measurement-point', { point: 'end', position: currentPoint, rawDistance: mDist });
                    this.createLine(this.ctx.measureStart, this.ctx.measureEnd, 'blue');
                }
                break;
        }
    },

    dispatch: function (eventName: string, detail: any) {
        const event = new CustomEvent(eventName, { detail });
        window.dispatchEvent(event);
    },

    createMarker: function (pos: Point3D, color: string) {
        const marker = document.createElement('a-sphere');
        marker.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
        marker.setAttribute('radius', '0.01');
        marker.setAttribute('color', color);
        marker.classList.add('measurement-marker');
        this.el.appendChild(marker);
    },

    createLine: function (p1: Point3D, p2: Point3D, color: string) {
        const line = document.createElement('a-entity');
        // Using `line` component
        line.setAttribute('line', {
            start: `${p1.x} ${p1.y} ${p1.z}`,
            end: `${p2.x} ${p2.y} ${p2.z}`,
            color: color,
            opacity: 1,
            visible: true
        });
        line.classList.add('measurement-line');
        this.el.appendChild(line);
    }
});
