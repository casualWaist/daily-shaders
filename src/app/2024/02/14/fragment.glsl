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
    float lightMulti = pos.x * pos.y;
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength * lightMulti * 4.);

    gl_FragColor = vec4(color, 1.0);
}
