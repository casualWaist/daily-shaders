varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 resolution;
void main() {
    vUv = uv * 2.0 - 1.0;
    vPosition = position;
    gl_Position = projectionMatrix * viewMatrix * modelViewMatrix * vec4(position, 1.0);
}
