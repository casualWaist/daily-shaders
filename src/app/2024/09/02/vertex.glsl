// #basicVertex
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vWorldPos;
void main() {
    vUv = uv;
    vPosition = position;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
