uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
varying vec3 vPosition;
varying vec2 vUv;

void main(){

    vec2 adjUv = vec2(vUv.x * 4.75 * (sin(uTime) + 2.0), vUv.y * 4.3);
    vec4 tex = texture2D(uTexture, vec2(adjUv.x + sin(uTime * vPosition.x), adjUv.y + uTime * 0.1));
    float ss = smoothstep(0.1, 1.0, tex.r * vUv.y);
    ss *= smoothstep(0.0, 0.1, vUv.x);
    ss *= smoothstep(1.0, 0.9, vUv.x);
    ss *= smoothstep(0.0, 0.1, vUv.y);
    ss *= smoothstep(0.8, 0.4, vUv.y);

    gl_FragColor = vec4(uColor, tex * ss * 16.5);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
