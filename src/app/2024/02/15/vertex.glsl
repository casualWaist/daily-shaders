varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
varying vec3 vPosition;

void main() {
    vUv = uv;
    vPosition = position;
    float new_x = position.x*cos(uTime) - position.z*sin(uTime);
    float new_z = position.z*cos(uTime) + position.x*sin(uTime);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(new_x, position.y, new_z, 1.0);
}
