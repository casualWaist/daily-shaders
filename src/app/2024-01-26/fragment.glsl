varying vec2 vUv;
uniform float time;

float sdSphere( vec3 p, float s ){
    return length(p)-s;
}

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}


float map(vec3 p) {
    vec3 spherePos = vec3(sin(time) * 3., 0, 0);
    float sphere = sdSphere(p - spherePos, 1.);
    float sphere2 = sdSphere(p + spherePos, 1.);
    return smin(sphere, sphere2, 2.);
}

void main() {

    // Initialization
    vec3 ro = vec3(0, 0, -3);         // ray origin
    vec3 rd = normalize(vec3(vUv, 1)); // ray direction
    vec3 col = vec3(0);               // final pixel color

    float t = 0.; // total distance travelled

    // Raymarching
    for (int i = 0; i < 80; i++) {
        vec3 p = ro + rd * t;     // position along the ray

        float d = map(p);         // current distance to the scene

        t += d;                   // "march" the ray

        if (d < .001) break;      // early stop if close enough
        if (t > 100.) break;      // early stop if too far
    }

    // Coloring
    col = vec3(t * .2);           // color based on distance

    gl_FragColor = vec4(col, 1);
}
