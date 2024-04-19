varying vec2 vUv;
varying vec2 vPoint;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec2 uSize;
uniform vec2 uPoint;

void main() {

    float dist = distance(gl_FragCoord.xy / uResolution, uMouse + 1.0);
    float dis = distance(uPoint, vUv);
    vec3 col = vec3(dis * 0.1, mod(dist, 0.1), dist * 0.5);
    float center = distance(vec2(0.5), vUv);

    vec4 color = vec4(smoothstep(uColor, col, vec3(center)), dis * 0.1);
    gl_FragColor = color;

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
