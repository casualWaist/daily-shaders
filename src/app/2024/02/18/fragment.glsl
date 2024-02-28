uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform vec2 uResolution;
uniform float uTime;

varying float vElevation;
varying vec3 vPosition;
varying vec2 vUv;

// #sRGB #colorspace

vec3 palette( float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263,0.416,0.557);

    return a + b*cos( 6.28318*(c*t+d) );
}

void main(){
    vec2 pos = normalize((vUv - 0.5) * uResolution);
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
    vec3 offColor = palette(uTime * 0.1) * vPosition.z * 4.5 - 14.;

    gl_FragColor = vec4(offColor.r * color.r, offColor.g * color.g, offColor.b * color.b, color.r);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
