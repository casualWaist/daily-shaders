// #basicVertex
varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
void main() {
    vUv = uv * 2.0 - 1.0;
    vPosition = position;
    float new_x = position.x*cos(uTime * uTime * 200.) - position.z*sin(uTime * uTime * 200.);
    float new_z = position.z*cos(uTime * uTime * 200.) + position.x*sin(uTime * uTime * 200.);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(new_x, position.y, new_z, 1.0);
}
