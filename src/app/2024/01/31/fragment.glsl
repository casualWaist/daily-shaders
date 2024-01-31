varying vec2 vUv;
uniform float time;

float sdSphere( vec3 p, float s ){
    return length(p)-s;
}

float sdVerticalCapsule( vec3 p, float h, float r ){
    p.y -= clamp( p.y, 0.0, h );
    return length( p ) - r;
}

float sdRoundedCylinder( vec3 p, float ra, float rb, float h ){
    vec2 d = vec2( length(p.xz)-2.0*ra+rb, abs(p.y) - h );
    return min(max(d.x,d.y),0.0) + length(max(d,0.0)) - rb;
}

float sdRoundCone( vec3 p, float r1, float r2, float h ){
    // sampling independent computations (only depend on shape)
    float b = (r1-r2)/h;
    float a = sqrt(1.0-b*b);

    // sampling dependant computations
    vec2 q = vec2( length(p.xz), p.y );
    float k = dot(q,vec2(-b,a));
    if( k<0.0 ) return length(q) - r1;
    if( k>a*h ) return length(q-vec2(0.0,h)) - r2;
    return dot(q, vec2(a,b) ) - r1;
}

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

float map(vec3 p) {
    vec3 spherePos = vec3(0., 0., time * 0.05);
    vec3 q = fract(p) - 0.5;
    float sphere = sdSphere(q - spherePos, 0.25);
    float sphere2 = sdSphere(q + spherePos, 0.25);
    return smin(sphere, sphere2, 1.);
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

    gl_FragColor = vec4(1. - col.x - sin(time), 1. - col.y + sin(time), 1. - col.z + cos(time), 1);
}
