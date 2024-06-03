varying vec2 vUv;
varying vec3 vPosition;
varying float vDistance;
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
    vDistance = abs(6.0 - -mvPosition.z);
    gl_PointSize = (step(1.0 / 40., uv.x)) * vDistance * 10.1;
}
