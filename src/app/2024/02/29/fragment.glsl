uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;

void main(){

    float tex = texture2D(uTexture, gl_PointCoord).r;
    float dist = distance(vPosition, uRayOrigin) * 0.5;
    gl_FragColor = vec4(uColor * dist, tex * dist);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
