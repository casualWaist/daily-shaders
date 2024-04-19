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

void main() {

    float dis = distance(gl_FragCoord.xy / uResolution, (uMouse + 1.0) * vUv);
    float size = uResolution.y * 0.0001;
    float ring = smoothstep(size, size + uResolution.y * 0.000002, dis);
    vec3 col = vec3(0.3 + 0.4*mod(floor(vUv.x * 10.0 + uTime)+floor(vUv.y * 10.0),2.0));

    vec4 color = vec4(mix(0.0, col.x, ring), mix(0.0, col.y, ring), mix(0.0, col.z, ring), mix(0.0, 1.0, ring));
    gl_FragColor = color;

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
