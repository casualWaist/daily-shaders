uniform vec2 uWorld;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
varying vec3 vPosition;
varying vec2 vUv;

void main(){

    vec4 tex = texture2D(uTexture, vUv * (vPosition.xy / uWorld + 2.));
    float ss = smoothstep(0.1, 0.9, tex.r * vUv.y);
    ss *= smoothstep(0.0, 0.1, vUv.x);
    ss *= smoothstep(1.0, 0.9, vUv.x);
    ss *= smoothstep(0.0, 0.1, vUv.y);
    ss *= smoothstep(1., 0.9, vUv.y);

    gl_FragColor = vec4(tex.rgb * ss, tex.r);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
