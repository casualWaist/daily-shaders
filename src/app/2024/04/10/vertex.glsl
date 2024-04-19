varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float uSize;
uniform float uProgress;
uniform vec2 uMouse;
attribute float aSize;
attribute float aTime;

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax){
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

void main() {
    vUv = vec2(uv.x, 1.0 - uv.y);
    vec4 modelPosition = modelMatrix * vec4(position.x * abs(uMouse.x * 4.0), position.y, position.z, 1.0);
    vPosition = modelPosition.xyz;
    vec4 modelNormal = modelMatrix * vec4(- position, 1.0);
    vNormal = modelNormal.xyz;
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
}
