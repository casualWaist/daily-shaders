uniform vec3 uColor;
uniform float uTime;
uniform float uSeed;
uniform mat4 uInvModelMatrix;
uniform vec3 uScale;

uniform vec4 uNoiseScale;
uniform float uMagnitude;
uniform float uLacunarity;
uniform float uGain;

uniform sampler2D uTexture;
uniform vec3 uCameraPos;

varying vec3 vPosition;
varying vec3 vWorldPos;
varying vec2 vUv;

float turbulence(vec3 p) {
    float sum = 0.0;
    float freq = 1.0;
    float amp = 1.0;

    for(int i = 0; i < 3; i++) {
        sum = snoise(p * freq) * amp;
        freq *= uLacunarity;
        amp *= uGain;
    }

    return sum;
}

vec4 samplerFire (vec3 p, vec4 scale) {
    vec2 st = vec2(sqrt(dot(p.xz, p.xz)), p.y);

    if(st.x <= 0.0 || st.x >= 2.0 || st.y <= 0.0 || st.y >= 2.0) return vec4(0.0);

    p.y += (uSeed + uTime) * scale.w;
    p *= scale.xyz;

    st.y += sqrt(st.y) * uMagnitude * turbulence(p);

    if(st.y <= 0.0 || st.y >= 2.0) return vec4(0.0);

    return texture(uTexture, st);
}

vec3 localize(vec3 p) {
    return (uInvModelMatrix * vec4(p, 1.0)).xyz;
}

void main() {

    csm_FragColor = vec4(uColor, 1.0);
}
