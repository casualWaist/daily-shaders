// #basicVertexRaymarch
varying vec2 vUv;
varying vec3 vPosition;
void main() {
    vUv = uv * 2.0 - 1.0;
    vPosition = position;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
