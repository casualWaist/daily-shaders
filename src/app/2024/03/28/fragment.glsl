uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;

void main(){

    float tex = texture(uTexture, gl_PointCoord).r;
    float dist = distance(vPosition, uRayOrigin);
    float centerDist = mod(distance(vUv, vec2(0.5)), 1.0);
    float globDist = mod(distance(vPosition, vec3(0.0)), 1.0);
    gl_FragColor = vec4(uColor.r * dist, uColor.g * centerDist, uColor.b * globDist, tex * 12.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
