uniform float uTime;
uniform sampler2D uNoise;
varying vec3 vPosition;
varying vec2 vUv;
attribute vec4 tangent;

void main(){
    vUv = uv;
    vec3 biTan = cross(normal, tangent.xyz);
    vec4 noise = texture(uNoise, vUv + mod(uTime * 0.1, 1.0)) * 0.1;
    csm_Position += noise.x * normal;
}
