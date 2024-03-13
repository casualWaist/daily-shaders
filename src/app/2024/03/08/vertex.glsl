varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vPoint;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uMoveVec;

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax){
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

void main() {
    vUv = vec2(uv.x, 1.0 - uv.y);
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
    vNormal = modelNormal.xyz;

    vPoint = uMouse * uResolution;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0) + vec4(vPoint, 0.0, 0.0);/*
    float distanceX = floor(distance(vPoint.x, modelPosition.x) * 10.0) * 0.1;
    float distanceY = floor(distance(vPoint.y, modelPosition.y) * 10.0) * 0.1;
    modelPosition.x += (modelPosition.xy * mat2(distanceX * 0.5, 0.0, 0.0, 1.0)).x;
    modelPosition.y += (modelPosition.xy * mat2(1.0, 0.0, 0.0, distanceY * 0.5)).y;
    modelPosition.x += (modelPosition.xy * mat2(distanceX * 0.5, 0.0, 0.0, 1.0)).x;*/

    vPosition = modelPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
