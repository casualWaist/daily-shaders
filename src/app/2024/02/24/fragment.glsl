uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
varying vec3 vPosition;
varying vec2 vUv;

mat2 Rot(float a) {
    float s=sin(a), c=cos(a);
    return mat2(c, -s, s, c);
}

void main(){

    float angle = uTime * 0.25;
    float cosAngle = cos(-angle);
    float sinAngle = sin(-angle);
    vec2 adjUv = vec2(vUv.x * 0.5, vUv.y * 0.5);
    vec2 aUv = vUv - 0.5 * uTime * 4.;
    vec2 uv = vec2(aUv.x * cosAngle - aUv.y * sinAngle, aUv.x * sinAngle + aUv.y * cosAngle);

    vec4 rot = texture2D(uTexture, uv + 0.5);
    float ss = smoothstep(0.1, 0.9, rot.r * vUv.y);
    ss *= smoothstep(0.0, 0.1, vUv.x);
    ss *= smoothstep(1.0, 0.9, vUv.x);
    ss *= smoothstep(0.0, 0.1, vUv.y);
    ss *= smoothstep(1., 0.1, vUv.y);

    gl_FragColor = rot * ss * 2.;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
