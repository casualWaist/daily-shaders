varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uWorld;

void main() {
    vUv = vec2(uv.x, 1.0 - uv.y);
    float distX = distance(position.x, uWorld.x);
    if (distX > uWorld.x * 0.5) {
        distX = -distX;
    }
    float distY = distance(position.y, uWorld.y);
    if (distY > uWorld.y * 0.5) {
        distY = -distY;
    }
    vPosition = position * uTime * 0.1 * vec3(distX, distY, 0.0);
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vPosition, 1.0);
}
