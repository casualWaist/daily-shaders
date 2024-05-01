uniform vec3 uRayOrigin;
uniform float uTime;
uniform float uSize;
varying vec2 vUv;

void main() {
    vUv = uv;
    float dis = distance(position.z, uRayOrigin.z) * 0.02;
    float scale = (dis) ;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    gl_PointSize = uSize - dis;
}
