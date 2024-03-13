varying vec2 vUv;
varying vec2 vPoint;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
uniform vec2 uResolution;

void main() {

    vec4 color = texture(uTexture, vUv);

    gl_FragColor = color * vec4(uColor, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
