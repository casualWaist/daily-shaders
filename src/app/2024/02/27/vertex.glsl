varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    vUv = vec2(uv.x, 1.0 - uv.y);
    float angle = texture(uTexture, vec2(0.5, uv.y * 0.2 - uTime * 0.05)).r * 5. * (uv.y + 0.5) + 0.25;
    float radius = texture(uTexture, vec2(0.5, uTime * 0.01)).r * 2. * (uv.y + 0.25) + 0.125;
    float c = cos(angle) * radius;
    float s = sin(angle) * radius;
    float y = position.y;
    vec2 m = vec2(position.x * angle - radius * (uv.y + 0.5), position.z) * mat2(c, s, -s, c);
    vPosition = vec3(m.x, y, m.y);
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vPosition, 1.0);
}
