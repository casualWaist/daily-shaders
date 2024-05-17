varying vec2 vUv;
varying vec2 vCenter;
varying vec3 vPosition;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    vUv = uv;
    vCenter = vec2(uv.x - 0.5, uv.y - 0.5);
    vPosition = position;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vPosition, 1.0);
}