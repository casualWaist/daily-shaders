varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform float uScroll;

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

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}


float map(vec4 p) {
    vec4 spherePos = vec4(cos(uTime), 0., 0., sin(uScroll * 0.001));
    vec4 cubePos = vec4(0., 0., 0., 0.0);
    float sphere = sdHyperSphere(p + spherePos * 2.0, 1.);
    mat2 rotYZ = mat2(sin(-uScroll * 0.03), cos(-uScroll * 0.03), -cos(-uScroll * 0.03), sin(-uScroll * 0.03));
    vec2 xw = rotYZ * p.xw * 1.75;
    vec2 yz = vec2(1.);
    float sphere2 = sdHyperFrame(p - cubePos, vec4(xw.x, yz.xy, xw.y), cos(uScroll * 0.001) + 0.1);
    return smin(sphere, sphere2, 0.5);
}

// rotate raymarching camera

void main() {

    // Initialization
    vec3 ro = vec3(0, 0, -5);         // ray origin
    float aS = uScroll * 0.2;
    ro.xz = mat2(cos(aS), sin(aS), -sin(aS), cos(aS)) * ro.xz;
    vec3 rd = normalize(vec3(vUv, 1)); // ray direction
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
    col = vec3(t * 0.12);           // color based on distance
    vec3 colorOff = vec3(cos(uScroll * 0.1), sin(uScroll * 0.1), 1.0 - cos(uScroll * 0.1));

    gl_FragColor = vec4(uColor * colorOff, 1.0 - col.r);
}
