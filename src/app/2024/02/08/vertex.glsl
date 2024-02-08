varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
void main() {
    vUv = uv * 2.0 - 1.0;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

