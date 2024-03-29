varying vec2 vUv;
varying vec2 vPoint;
uniform float uTime;
uniform vec3 uRayOrigin;
uniform vec2 uResolution;
uniform vec3 uBox;
uniform vec3 uBoxPos;
uniform vec3 uSpherePos;
uniform float uSphereRadius;
uniform vec4 u0;
uniform vec4 u1;
uniform vec4 u2;
uniform vec4 u3;
uniform vec4 u4;
uniform vec4 u5;
uniform vec4 u6;
uniform vec4 u7;
uniform vec4 u8;
uniform vec4 u9;

float sdSphere( vec3 p, float s ) {
    return length(p)-s;
}

float sdBox( vec3 p, vec3 b ) {
    vec3 q = abs(p) - b;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float opSmoothSubtraction( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
    return mix( d2, -d1, h ) + k*h*(1.0-h);
}

float map(vec3 p) {
    float box = sdBox(p - uBoxPos, uBox);
    float sphere = sdSphere(p - uSpherePos + vec3(0.0, 0.0, cos(uTime)), uSphereRadius);
    float s0 = sdSphere(p - vec3(u0.xy, cos(uTime) - 0.0), u0.w);
    float s1 = sdSphere(p - vec3(u1.xy, cos(uTime) - 0.1), u1.w);
    float s2 = sdSphere(p - vec3(u2.xy, cos(uTime) - 0.2), u2.w);
    float s3 = sdSphere(p - vec3(u3.xy, cos(uTime) - 0.3), u3.w);
    float s4 = sdSphere(p - vec3(u4.xy, cos(uTime) - 0.4), u4.w);
    float s5 = sdSphere(p - vec3(u5.xy, cos(uTime) - 0.5), u5.w);
    float s6 = sdSphere(p - vec3(u6.xy, cos(uTime) - 0.6), u6.w);
    float s7 = sdSphere(p - vec3(u7.xy, cos(uTime) - 0.7), u7.w);
    float s8 = sdSphere(p - vec3(u8.xy, cos(uTime) - 0.8), u8.w);
    float s9 = sdSphere(p - vec3(u9.xy, cos(uTime) - 0.9), u9.w);
    float final = opSmoothSubtraction(sphere, box, 0.1);
    final = opSmoothSubtraction(s0, final, 0.1);
    final = opSmoothSubtraction(s1, final, 0.1);
    final = opSmoothSubtraction(s2, final, 0.1);
    final = opSmoothSubtraction(s3, final, 0.1);
    final = opSmoothSubtraction(s4, final, 0.1);
    final = opSmoothSubtraction(s5, final, 0.1);
    final = opSmoothSubtraction(s6, final, 0.1);
    final = opSmoothSubtraction(s7, final, 0.1);
    final = opSmoothSubtraction(s8, final, 0.1);
    final = opSmoothSubtraction(s9, final, 0.1);
    return final;
}

void main() {

    // Initialization
    vec3 ro = vec3(0.0, 0.0, -uRayOrigin.z);
    vec3 rd = normalize(vec3(vUv, 1));
    vec3 col = vec3(0);

    float t = 0.;

    // Raymarching
    for (int i = 0; i < 80; i++) {
        vec3 p = ro + rd * t;

        float d = map(p);

        t += d;

        if (d < .001) break;
        if (t > 100.) break;
    }

    // Coloring
    col = vec3(t * .2);

    gl_FragColor = vec4(1. - col.x - sin(uTime), 1. - col.y + sin(uTime), 1. - col.z + cos(uTime), 1);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
