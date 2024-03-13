varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vSize;
uniform float uSize;
uniform vec2 uResolution;
attribute float aSize;

void main() {
    vUv = vec2(uv.x, 1.0 - uv.y);
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vPosition = modelPosition.xyz;
    vec4 modelNormal = modelMatrix * vec4(vec3(0., 0., 0.) - position, 1.0);
    vNormal = modelNormal.xyz;
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * uResolution.y * aSize * (1.0 / -viewPosition.z);
    vSize = gl_PointSize;
}
