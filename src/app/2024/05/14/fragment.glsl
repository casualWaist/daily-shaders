varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform float uScroll;

float sdHyperCube( vec4 p, vec4 b ){
    vec4 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, max(d.y, max(d.z, d.w))), 0.0);
}

float map(vec4 p) {
    return sdHyperCube(p,
    mat4(
        1.0, uScroll * 0.01, 0.0, uScroll * 0.01,
        0.0, 1.0, 0.0, uScroll * 0.01,
        0.0, uScroll * 0.01, uScroll * 0.01, 0.0,
        uScroll * 0.01, 0.0, uScroll * 0.01, 1.0
    ) * vec4(1.));
}

void main() {

    // Initialization
    vec3 ro = vec3(0, 0, -3);         // ray origin
    ro.xz = mat2(cos(uScroll), sin(uScroll), -sin(uScroll), cos(uScroll)) * ro.xz;
    vec3 rd = normalize(vec3(vUv, 1)); // ray direction
    rd.xz = mat2(cos(uScroll), sin(uScroll), -sin(uScroll), cos(uScroll)) * rd.xz;
    vec3 col = vec3(0);               // final pixel color

    float t = 0.; // total distance travelled

    // #Raymarching #basicRaymarching #raymarchingStarter
    for (int i = 0; i < 80; i++) {
        vec3 p = ro + rd * t;     // position along the ray

        float d = map(vec4(p.x, p.y, p.z, 1.0));         // current distance to the scene

        t += d;                   // "march" the ray

        if (d < .001) break;      // early stop if close enough
        if (t > 100.) break;      // early stop if too far
    }

    // Coloring
    col = vec3(t * 0.2);           // color based on distance

    gl_FragColor = vec4(uColor - col, col.r);
}
