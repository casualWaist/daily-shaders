varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;
uniform vec2 uResolution;
uniform float uSize;
uniform float uProgress;
attribute float aSize;
attribute float aTime;

void main() {

    vUv = uv;
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
    vNormal = modelNormal.xyz;
    float new_x = position.x*cos(uTime) - position.z*sin(uTime);
    float new_z = position.z*cos(uTime) + position.x*sin(uTime);
    vPosition = (modelMatrix * vec4(new_x, position.y, new_z, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(new_x, position.y, new_z, 1.0);

}
