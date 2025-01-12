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
// GLSL simplex noise function by ashima / https://github.com/ashima/webgl-noise/blob/master/src/noise3D.glsl
// -------- simplex noise
vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
    i = mod289(i);
    vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z); //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_); // mod(j,N)

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 49.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
// simplex noise --------

float turbulence(vec3 p) {
    float sum = 0.0;
    float freq = 1.0;
    float amp = 1.0;

    for(int i = 0; i < 3; i++) {
        sum += abs(snoise(p * freq)) * amp;
        freq *= uLacunarity;
        amp *= uGain;
    }

    return sum;
}

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

vec4 samplerFire (vec3 p, vec4 scale) {
    vec2 st = vec2(sqrt(dot(p.xz, p.xz)), p.y);
    float z = p.z;

    if(st.x <= 0.0 || st.x >= 2.25 || st.y <= 0.0 || st.y >= 2.25) return vec4(st, z, 1.0);

    p.y -= (uSeed + uTime) * scale.w;
    p *= scale.xyz;

    st.y += smin(sqrt(st.y), uMagnitude, turbulence(p));

    if(st.y <= 0.0 || st.y >= 1.5) return vec4(st, z, 1.0);

    return vec4(0.0);
}

float sdSphere( vec3 p, float s ){
    return length(p)-s;
}

vec3 localize(vec3 p) {
    return (uInvModelMatrix * vec4(p, 1.0)).xyz;
}

void main() {
    vec3 rayOrigin = vWorldPos;
    vec3 rayDir = normalize(rayOrigin - cameraPosition);
    float rayLen = 0.0288 * length(uScale.xyz);

    vec4 col = vec4(0.0);

    for(int i = 0; i < 20; i++) {
        rayOrigin += rayDir * rayLen;

        vec3 lp = localize(rayOrigin);

        lp.y += 1.25;
        lp.xz *= 0.5;
        lp.y *= 0.25;
        col += samplerFire(lp, uNoiseScale);
    }

    col.a = col.r;
    col *= vec4(uColor, 1.0);

    gl_FragColor = vec4(vec3(0.9, 0.5, 0.6) + col.rgb / col.rba, col.a);
}
