varying vec2 vUv;
varying vec2 vPoint;
varying vec2 vPoints;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec2 uSize;

void main() {

    float dis = distance(gl_FragCoord.xy / uResolution, uMouse + 1.0);
    float size = uResolution.y * 0.0001;
    float ring = smoothstep(size, size + uResolution.y * 0.000002, dis);
    float pDis = distance(vPosition.xy / uSize, vPoints);
    ring += smoothstep(size, size + uResolution.y * 0.00002, pDis);

    vec4 color = vec4(mix(0.0, uColor.r, ring), mix(0.0, uColor.g, ring), mix(0.0, uColor.b, ring), mix(0.0, 1.0, ring));
    gl_FragColor = color;

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
