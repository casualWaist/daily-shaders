uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform vec2 uResolution;

varying float vElevation;
varying vec3 vPosition;
varying vec2 vUv;

// #sRGB #colorspace
//#include <colorspace_fragment>

void main(){
    vec2 pos = normalize((vUv - 0.5) * uResolution);
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    gl_FragColor = vec4(color, color.r);
}
