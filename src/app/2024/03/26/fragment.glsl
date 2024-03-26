varying vec2 vUv;
varying vec2 vPoint;
uniform float uTime;
uniform vec3 uRayOrigin;
uniform vec2 uResolution;
uniform vec3 uBox;
uniform vec3 uBoxPos;
uniform vec3 uSpherePos;
uniform float uSphereRadius;

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
    return opSmoothSubtraction(sphere, box, 0.1);
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
