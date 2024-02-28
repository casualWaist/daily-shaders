varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    vUv = vec2(uv.x, 1.0 - uv.y);
    vPosition = position;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
