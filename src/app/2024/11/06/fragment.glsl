uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
varying vec2 vPoint;

void main(){

    gl_FragColor = vec4(uColor, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
