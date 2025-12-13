import React, { useEffect, useRef } from 'react';
import './ARComponents'; // Import to register components

interface ARSceneProps {
    appState: 'idle' | 'calibrating-a' | 'calibrating-b' | 'measuring-start' | 'measuring-end' | string;
}

const ARScene: React.FC<ARSceneProps> = ({ appState }) => {
    const sceneRef = useRef<any>(null);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* A-Frame Scene */}
            {/* 
                webxr="requiredFeatures: hit-test, local-floor; optionalFeatures: dom-overlay; overlayElement: #overlay" 
            */}
            <a-scene
                ref={sceneRef}
                id="measurement-scene"
                embedded
                vr-mode-ui="enabled: false"
                ar-hit-test="target: #reticle; type: map;"
                renderer="colorManagement: true;"
                webxr="optionalFeatures: hit-test, plane-detection;"
            >
                {/* Lighting */}
                <a-light type="directional" intensity="1" position="-1 2 4"></a-light>
                <a-light type="ambient" intensity="0.5"></a-light>

                {/* Reticle - The visual cursor */}
                <a-entity
                    id="reticle"
                    ar-reticle
                    geometry="primitive: ring; radiusInner: 0.04; radiusOuter: 0.05"
                    material="color: white; shader: flat; opacity: 0.8"
                    rotation="-90 0 0"
                >
                    <a-entity geometry="primitive: circle; radius: 0.01" material="color: white; shader: flat" ></a-entity>
                </a-entity>

                {/* Controller Entity - Manages Logic */}
                <a-entity
                    ar-controller={`state: ${appState}; target: #reticle`}
                ></a-entity>

                {/* Camera */}
                <a-camera position="0 1.6 0" look-controls="enabled: false"></a-camera>
            </a-scene>
        </div>
    );
};

export default ARScene;
