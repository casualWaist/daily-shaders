varying vec2 vUv;
varying vec2 vPoint;
uniform float uTime;
uniform vec3 uRayOrigin;
uniform vec2 uResolution;

float sdSphere( vec3 p, float s ){
    return length(p)-s;
}

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

float map(vec3 p) {
    vec3 spherePos = vec3(sin(uTime) * 5., 0., 0.0);
    float sphere = sdSphere(p - spherePos, 4.);
    float sphere2 = sdSphere(p + spherePos, 4.);
    return smin(sphere, sphere2, 2.0);
}

void main() {

    // Initialization
    vec3 ro = vec3(vPoint * uResolution, -uRayOrigin.z);
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
