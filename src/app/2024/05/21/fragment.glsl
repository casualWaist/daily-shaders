varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform float uScroll;
uniform vec2 uSize;

float sdHyperFrame( vec4 p, vec4 b, float e ){
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

float sdVerticalHyperCapsule( vec4 p, float h, float r ){
    p.y -= clamp( p.y, 0.0, h );
    return length( p ) - r;
}

float sdHyperTriPrism( vec4 p, vec3 d, float w, float h ){
    vec4 q = abs(p);
    return max(q.w-d.z, max(q.z-d.y,max(q.x*w+p.y*h,-p.y)-d.x*0.5)); // 0.866025 w 0.5 h
}

float sdHyperTriPrismInv( vec4 p, vec3 d, float w, float h ){
    vec4 q = abs(p);
    return max(q.w-d.z, max(q.z-d.y,max(q.x*w+p.y*-h,p.y)-d.x*0.5)); // 0.866025 w 0.5 h
}

float sUnion(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

float sSub(float a, float b, float k) {
    float h = clamp(0.5 - 0.5 * (b + a) / k, 0.0, 1.0);
    return mix(b, -a, h) + k * h * (1.0 - h);
}

float makeApostrophe(vec4 p){
    float k = 0.125;
    float c = cos(k*p.y);
    float s = sin(k*p.y);
    mat2  m = mat2(c,-s,s,c);
    p = p + vec4(3.0,-2.,-2.,0.);
    float apos = sdHyperRoundBox(vec4(m*p.xy,p.zw), vec4(0.5, 1.5, 1.0, 1.0), 0.25);
    return apos;
}

float makeTwo(vec4 p){
    float sphere = sdHyperRoundBox(p + vec4(0.,-2.,-2.,0.), vec4(1.5,2.,1.,1.), 1.0);
    float box = sdHyperRoundBox(p + vec4(0.,.5,-2.,0.), vec4(1.5,2.5,1.,1.), 0.25);
    float outer = sUnion(sphere, box, 0.3);
    float centerCut = sdHyperRoundBox(p + vec4(0.,-2.35,-2.,0.), vec4(.5,.55,3.,1.), 0.25);
    outer = sSub(centerCut, outer, 0.3);
    float leftCut = sdHyperTriPrismInv(p + vec4(1.4,-0.8,-2.,0.), vec3(2.,1.,1.), 0.866025, 0.55);
    outer = sSub(leftCut, outer, 0.3);
    float rightCut = sdHyperTriPrism(p + vec4(-1.5,0.,-2.,0.), vec3(2.,1.,1.), 0.866025, 0.55);
    outer = sSub(rightCut, outer, 0.3);

    return outer;
}

float makeFour(vec4 p){
    float base = sdHyperRoundBox(p + vec4(-5.,-0.5,-2.,0.), vec4(0.5,3.5,1.,1.), 0.25);
    float cross = sdHyperRoundBox(p + vec4(-4.,.5,-2.,0.), vec4(2.5,0.5,1.,1.), 0.25);
    base = sUnion(base, cross, 0.3);
    float c = cos(0.95);
    float s = sin(0.95);
    mat2  m = mat2(c,-s,s,c);
    float di = sdHyperRoundBox(vec4(m*(p.xy+vec2(-3.5,-1.75)), p.zw + vec2(-2.,0.)), vec4(2.5,0.5,1.,1.), 0.25);
    base = sUnion(base, di, 0.3);

    return base;
}

float map(vec4 p) {
    float apos = makeApostrophe(p);
    float two = makeTwo(p);
    float four = makeFour(p);

    return min(apos, min(two, four));
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
