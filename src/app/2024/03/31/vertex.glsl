uniform float uTime;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vParticle;
attribute vec2 aParticles;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    vPosition = projectedPosition.xyz;
    gl_Position = projectedPosition;
    vNormal = (projectionMatrix * vec4(normal, 1.0)).xyz;
    vUv = uv;
    vParticle = aParticles;
}
