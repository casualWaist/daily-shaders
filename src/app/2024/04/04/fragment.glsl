uniform vec3 uCameraPos;
uniform vec2 uResolution;
uniform float uTime;

varying float vElevation;
varying vec3 vPosition;
varying vec2 vUv;

void main(){

    if (mod(vUv.x, 0.1) > 0.05) { discard;}
    csm_DiffuseColor *= vec4(1.0, csm_DiffuseColor.g * 0.5, 1.0, 1.0);
}
