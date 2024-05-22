varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform float uScroll;
uniform vec2 uSize;

float sdHyperFrame( vec4 p, vec4 b, float e )
{
    p = abs(p  )-b;
    vec4 q = abs(p+e)-e;
    return min(min(
    length(max(vec4(p.x,q.y,q.z,q.w),0.0))+min(max(p.x,max(q.y,max(q.z, q.w))),0.0),
    length(max(vec4(q.x,p.y,q.z,q.w),0.0))+min(max(q.x,max(p.y,max(q.z, q.w))),0.0)),
    length(max(vec4(q.x,q.y,p.z,p.w),0.0))+min(max(q.x,max(q.y,max(p.z, p.w))),0.0));
}

float sdHyperSphere( vec4 p, float s ){
    return length(p)-s;
}

float sdHyperCube( vec4 p, vec4 b ){
    vec4 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, max(d.y, max(d.z, d.w))), 0.0);
}

float sdHyperRoundBox( vec4 p, vec4 b, float r ){
    vec4 q = abs(p) - b + r;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,max(q.z,q.w))),0.0) - r;
}

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

float makeI(vec4 p){
    float I = sdHyperRoundBox(p + vec4(uSize.x, 0.0, -2.0, 0.0), vec4(1.0, 3.0, 1.0, 1.0), 0.25);
    return I;
}

float map(vec4 p) {
    float I = makeI(p);

    return I;
}

// rotate raymarching camera

void main() {

    // Initialization
    vec3 ro = vec3(0, 0, -10);         // ray origin
    float aS = uScroll * 0.2;
    ro.xz = mat2(cos(aS), sin(aS), -sin(aS), cos(aS)) * ro.xz;
    float aspect = uSize.x / uSize.y;  // screen aspect ratio
    vec3 rd = normalize(vec3(vUv.x * aspect, vUv.y, 1)); // ray direction
    rd.xz = mat2(cos(aS), sin(aS), -sin(aS), cos(aS)) * rd.xz;
    vec3 col = vec3(0);               // final pixel color

    float t = 0.; // total distance travelled

    // #Raymarching #basicRaymarching #raymarchingStarter
    for (int i = 0; i < 80; i++) {
        vec3 p = ro + rd * t;     // position along the ray

        float d = map(vec4(p.x, p.y, p.z, 0.0));         // current distance to the scene

        t += d;                   // "march" the ray

        if (d < .001) break;      // early stop if close enough
        if (t > 100.) break;      // early stop if too far
    }

    // Coloring
    col = vec3(t * 0.05);           // color based on distance
    vec3 colorOff = vec3(cos(uScroll * 0.1), sin(uScroll * 0.1), 1.0 - cos(uScroll * 0.1));

    gl_FragColor = vec4(uColor * colorOff, 1.0 - col.r);
}
