varying vec2 vUv;
varying vec3 vPosition;
varying float vDistance;
varying float vSize;
uniform float uFocus;
uniform vec2 uResolution;
uniform sampler2D uPositions;
uniform float uTime;
uniform float uProgress;
uniform vec3 uCamera;

// #particlesInGeometry #vertexShape
void main() {
    vUv = uv;
    vec4 pos = texture(uPositions, uv);
    vec3 modPos = mix(pos.xyz * 4.0, position, uProgress);
    vec4 mvPosition = modelViewMatrix * vec4(modPos + normal * pos.xyz * 0.1, 1.0);
    vPosition = mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
    vDistance = abs(7.0 - -mvPosition.z);
    vSize = clamp(step(0.02, uv.x + 2.0) * vDistance * 5.0, 5.0, 10.0);
    gl_PointSize = vSize;
}
