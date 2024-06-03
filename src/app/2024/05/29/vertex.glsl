varying vec2 vUv;
varying vec3 vPosition;
varying float vFocus;
uniform vec2 uResolution;
uniform sampler2D uPositions;
uniform float uTime;
uniform vec3 uCamera;

// #particlesInGeometry #vertexShape
void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float distFocus = distance(uCamera, mvPosition.xyz);
    vFocus = pow(distFocus, 3.0);
    gl_PointSize = 1. + pow(distFocus, 2.0);
    gl_Position = projectionMatrix * viewMatrix * mvPosition;
}
