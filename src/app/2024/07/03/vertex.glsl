uniform vec2 uMouse;
uniform float uTime;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vWorldPos;
void main() {
    vUv = uv;
    vPosition = position;
    float cos = cos(uTime * 0.5);
    float sin = sin(uTime * 0.5);
    mat4 rotationMatrix = mat4(
        cos, 0.0, sin, 0.0,
        0.0, 1.0, 0.0, 0.0,
        -sin, 0.0, cos, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * rotationMatrix * modelMatrix * vec4(position, 1.0);
}
