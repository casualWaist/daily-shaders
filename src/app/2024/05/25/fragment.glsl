varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform float uScroll;
uniform vec2 uSize;

float random2D(vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d ){
    return a + b*cos( 6.28318*(c*t+d) );
}

float sdFrame( vec3 p, vec3 b, float e ){
    p = abs(p  )-b;
    vec3 q = abs(p+e)-e;
    return min(min(
    length(max(vec3(p.x,q.y,q.z),0.0))+min(max(p.x,max(q.y,q.z)),0.0),
    length(max(vec3(q.x,p.y,q.z),0.0))+min(max(q.x,max(p.y,q.z)),0.0)),
    length(max(vec3(q.x,q.y,p.z),0.0))+min(max(q.x,max(q.y,p.z)),0.0));
}

float sdSphere( vec3 p, float s ){
    return length(p)-s;
}

float sdCube( vec3 p, vec3 b ){
    vec3 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, max(d.y, d.z)), 0.0);
}

float sdRoundBox( vec3 p, vec3 b, float r ){
    vec3 q = abs(p) - b + r;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
}

float sdVerticalCapsule( vec3 p, float h, float r ){
    p.y -= clamp( p.y, 0.0, h );
    return length( p ) - r;
}

float sdRoundedCylinder( vec3 p, float ra, float rb, float h ){
    vec2 d = vec2( length(p.xy)-2.0*ra+rb, abs(p.z) - h );
    return min(max(d.x,d.y),0.0) + length(max(d,0.0)) - rb;
}

float sdTriPrism( vec3 p, vec3 d, float w, float h ){
    vec3 q = abs(p);
    return max(q.z-d.y,max(q.x*w+p.y*h,-p.y)-d.x*0.5); // 0.866025 w 0.5 h
}

float sdTriPrismInv( vec3 p, vec3 d, float w, float h ){
    vec3 q = abs(p);
    return max(q.z-d.y,max(q.x*w+p.y*-h,p.y)-d.x*0.5); // 0.866025 w 0.5 h
}

float sUnion(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

float sSub(float a, float b, float k) {
    float h = clamp(0.5 - 0.5 * (b + a) / k, 0.0, 1.0);
    return mix(b, -a, h) + k * h * (1.0 - h);
}

float makeApostrophe(vec3 p){
    float offset = 2.5;
    float k = 0.125;
    float c = cos(k*p.y);
    float s = sin(k*p.y);
    mat2  m = mat2(c,-s,s,c);
    p = p + vec3(offset*2.5,-2.5,0.);
    float apos = sdRoundBox(vec3(m*p.xy,p.z), vec3(0.25, 1., 1.0), 0.25);
    return apos;
}

float makeTwo(vec3 p){
    float offset = 2.5;
    float base = sdRoundBox(p + vec3(offset,-2.,0.), vec3(2.5,2.,1.), 1.0);
    float box = sdRoundBox(p + vec3(offset,2.5,0.), vec3(2.5,1.,1.), 0.25);
    base = sUnion(base, box, 0.3);
    float centerCut = sdRoundBox(p + vec3(offset,-0.35,0.), vec3(1.,2.5,3.), 0.25);
    base = sSub(centerCut, base, 0.3);
    float centerHalf = sdRoundBox(p + vec3(offset,0.5,0.), vec3(3.5,1.5,3.), 0.25);
    base = sSub(centerHalf, base, 0.3);
    float c = cos(0.75);
    float s = sin(0.75);
    mat2  m = mat2(c,-s,s,c);
    float di = sdRoundBox(vec3(m*(p.xy+vec2(offset,0.5)), p.z + vec2(0.,0.)), vec3(2.75,0.5,1.), 0.25);
    base = sUnion(base, di, 0.3);

    return base;
}

float makeFour(vec3 p){
    float offset = 2.5;
    float base = sdRoundBox(p + vec3(-offset-2.,-0.25,0.), vec3(1.,3.75,1.), 0.25);
    float cross = sdRoundBox(p + vec3(-offset-1.,.5,0.), vec3(3.5,0.5,1.), 0.25);
    base = sUnion(base, cross, 0.3);
    float c = cos(0.85);
    float s = sin(0.85);
    mat2  m = mat2(c,-s,s,c);
    float di = sdRoundBox(vec3(m*(p.xy+vec2(-offset+0.5,-1.5)), p.z + vec2(0.,0.)), vec3(2.75,0.5,1.), 0.25);
    base = sUnion(base, di, 0.3);

    return base;
}

float straifObj(vec3 p, float off) {
    float offTime = uTime + off;
    float c = cos(offTime);
    float s = sin(offTime);
    float r = random2D(vec2(floor(offTime*0.25)+off, 1.0))*6.28 - 3.14;
    float r2 = random2D(vec2(floor(offTime*0.25)+off+5., 1.0))*6.28 - 3.14;
    mat2 m = mat2(r,-r2,r2,r);
    float v = mod(offTime*0.25, 1.0);
    vec3 mv = vec3(m*vec2(v*0.25+0.15, v*0.25), -v * 1.2 + 0.1)*uSize.x;
    float blob = sdSphere(p - mv, v + 0.2);

    return blob;
}

float map(vec3 p) {
    float apos = makeApostrophe(p);
    float two = makeTwo(p);
    float four = makeFour(p);

    float mixed = min(apos, min(two, four));

    float blob = straifObj(p, -0.10);
    mixed = sUnion(mixed, blob, 1.75);
    float blob2 = straifObj(p, 0.37);
    mixed = sUnion(mixed, blob2, 1.75);
    float blob3 = straifObj(p, -0.17);
    mixed = sUnion(mixed, blob3, 1.75);
    float blob4 = straifObj(p, 0.71);
    mixed = sUnion(mixed, blob4, 1.75);
    float blob6 = straifObj(p, 1.07);
    mixed = sUnion(mixed, blob6, 1.75);
    float blob7 = straifObj(p, 1.25);
    mixed = sUnion(mixed, blob7, 1.75);
    float blob8 = straifObj(p, 1.71);
    mixed = sUnion(mixed, blob8, 1.75);
    float blob10 = straifObj(p, 2.33);
    mixed = sUnion(mixed, blob10, 2.75);
    float blob11 = straifObj(p, 2.03);
    mixed = sUnion(mixed, blob11, 1.75);
    float blob12 = straifObj(p, 2.21);
    mixed = sUnion(mixed, blob12, 1.75);
    float blob13 = straifObj(p, 2.53);
    mixed = sUnion(mixed, blob13, 1.75);
    float blob14 = straifObj(p, 2.67);
    mixed = sUnion(mixed, blob14, 1.75);
    float blob16 = straifObj(p, 2.71);
    mixed = sUnion(mixed, blob16, 1.75);

    return mixed;
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

        float d = map(vec3(p.x, p.y, p.z));         // current distance to the scene

        t += d;                   // "march" the ray

        if (d < .001) break;      // early stop if close enough
        if (t > 100.) break;      // early stop if too far
    }

    // Coloring
    col = vec3(t * 0.03);           // color based on distance

    // #raymarchingColoring  dist     lightness  saturation  lightness        hue
    vec3 colorOff = palette(col.x*2., vec3(0.65), vec3(0.75), vec3(0.75), vec3(0.90, 0.10, 0.20));

    gl_FragColor = vec4(uColor * colorOff, 1.0 - col.r);
}
