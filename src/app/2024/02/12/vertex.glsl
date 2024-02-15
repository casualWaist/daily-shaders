// #basicVertex
varying vec2 vUv;
varying vec3 vPosition;
void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
