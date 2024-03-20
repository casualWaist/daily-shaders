uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
varying vec3 vPosition;
varying vec2 vUv;

void main(){

    vec2 adjUv = vec2(vUv.x * 0.75, vUv.y * 0.3);
    vec4 tex = texture(uTexture, vec2(adjUv.x, adjUv.y + uTime * 0.1));
    float ss = smoothstep(0.1, 0.9, tex.r * vUv.y);
    ss *= smoothstep(0.0, 0.1, vUv.x);
    ss *= smoothstep(1.0, 0.9, vUv.x);
    ss *= smoothstep(0.0, 0.1, vUv.y);
    ss *= smoothstep(0.8, 0.4, vUv.y);

    gl_FragColor = tex * ss * 2.;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
