varying vec2 vUv;
varying vec3 vPosition;
varying float vDistance;
varying float vSize;
uniform float uFocus;
uniform vec2 uResolution;
uniform sampler2D uPositions;
uniform float uTime;
uniform vec3 uCamera;

// #particlesInGeometry #vertexShape
void main() {
    vUv = uv;
    vec4 pos = texture(uPositions, uv);
    vec4 mvPosition = modelViewMatrix * pos;
    gl_Position = projectionMatrix * mvPosition;
    vDistance = abs(uFocus - -mvPosition.z);
    vSize = (step(-1.5, uv.x)) * vDistance * 40.1;
    gl_PointSize = vSize;
}
