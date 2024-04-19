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

    vec2 aUv = vUv * uTime * 0.1;
    float angle = atan(vUv.x - mod(uTime, 0.5), vUv.y - mod(uTime, 0.5));
    vec3 col = vec3(floor(angle * 7.0 + round(mod(uTime, 3.0)))+round(aUv.x * uTime * 0.1));
    //col *= vec3(pow(round(aUv.y * 10.0 + uTime)*round(angle * 10.0), 2.0));

    vec4 color = vec4(col * uColor, col.x);
    gl_FragColor = color;

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
