varying vec2 vUv;
varying vec2 vPoint;
varying vec3 vPosition;
varying vec2 vPoints;
uniform float uTime;
uniform sampler2D uNoise;
uniform vec3 uColor;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec3 uRayOrigin;
uniform vec2 uSize;

void main() {

    vec2 uv = vec2(mod(uTime * 0.01, 1.0), vUv.y);
    vec4 col = texture(uNoise, uv) + vec4(uColor * 4.0, 1.0);
    vec4 clip = texture2D(uNoise, vec2(mod(uTime * 0.3, 1.0), vUv.y));
    float bw = smoothstep(0.0 + clip.r, vUv.x, clip.b);
    col = mod(col, 0.85) * bw;


    gl_FragColor = col;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
