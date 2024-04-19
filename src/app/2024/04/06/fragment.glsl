varying vec2 vUv;
varying vec2 vPoint;
varying vec3 vPosition;
varying vec2 vPoints;
uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uNoise;
uniform vec3 uColor;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec3 uRayOrigin;
uniform vec2 uSize;

float sdRoundBox( vec3 p, vec3 b, float r ) {
    vec3 q = abs(p) - b - r;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
}
float sdSphere( vec3 p, float s ){
    return length(p)-s;
}

float map(vec3 p) {
    float facing = dot(p, vPosition);
    return sdRoundBox(p * facing, vec3(0.4), 0.2);
}

vec3 palette( float t ) {
    vec3 a = vec3(0.0, 0.45, 0.75);
    vec3 b = vec3(0.75, 0.0, 0.75);
    vec3 c = vec3(0.75, 0.2345, 0.0);
    vec3 d = vec3(0.5,0.7,0.7);

    return a - b/cos( 6.28318*(c*t-d) );
}

void main() {

    vec3 ro = normalize(vPosition - uRayOrigin);
    vec3 rd = normalize(vec3(vUv, 1));
    vec3 col = vec3(0);

    float t = 0.;
    float s = 0.;

    for (int i = 0; i < 80; i++) {
        vec4 p = mat4(
            1., 0.0, 0., 0.,
            0., 1., 0.0, 0.,
            0., 0., 1., 0.,
            0., 0., 0.5, 1.
        ) * vec4(ro + rd * t, 1.0);

        float d = map(p.xyz * mod(uRayOrigin.z * 0.25, 4.0));

        t += d;
        s -= d;

        if (d < .001) break;
        if (t > 100.) break;
    }

    col = 1.0 - vec3(mix(t, s, vPosition.z * 0.05));
    col *= palette(sdSphere(col, mod(uTime, 10.0)));

    gl_FragColor = vec4(col, 1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
