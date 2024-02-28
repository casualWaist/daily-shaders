varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    float dis = distance(position.x, position.y);
    vUv = vec2(uv.x * (uTime + 1000.0) * 0.01, 1.0 - uv.y * (uTime + 1000.0) * 0.01);
    vPosition = position * (sin(uTime * 0.01 * dis) + 0.5);
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vPosition, 1.0);
}
