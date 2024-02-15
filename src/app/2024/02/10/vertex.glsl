varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
varying vec3 vPosition;
varying vec3 vWorldNormal;
varying vec3 vEyeVector;

void main() {
    vUv = uv * 2.0 - 1.0;
    vPosition = position;
    float new_x = position.x*cos(uTime) - position.z*sin(uTime);
    float new_z = position.z*cos(uTime) + position.x*sin(uTime);
    vec4 worldPos = modelMatrix * vec4(new_x, position.y, new_z, 1.0);
    vWorldNormal = normalize(normalMatrix * normal);
    vEyeVector = normalize(worldPos.xyz - cameraPosition);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(new_x, position.y, new_z, 1.0);
}
