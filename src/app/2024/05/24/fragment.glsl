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

float sdHyperFrame( vec3 p, vec3 b, float e ){
    p = abs(p  )-b;
    vec3 q = abs(p+e)-e;
    return min(min(
    length(max(vec3(p.x,q.y,q.z),0.0))+min(max(p.x,max(q.y,q.z)),0.0),
    length(max(vec3(q.x,p.y,q.z),0.0))+min(max(q.x,max(p.y,q.z)),0.0)),
    length(max(vec3(q.x,q.y,p.z),0.0))+min(max(q.x,max(q.y,p.z)),0.0));
}

float sdHyperSphere( vec3 p, float s ){
    return length(p)-s;
}

float sdHyperCube( vec3 p, vec3 b ){
    vec3 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, max(d.y, d.z)), 0.0);
}

float sdHyperRoundBox( vec3 p, vec3 b, float r ){
    vec3 q = abs(p) - b + r;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
}

float sdVerticalHyperCapsule( vec3 p, float h, float r ){
    p.y -= clamp( p.y, 0.0, h );
    return length( p ) - r;
}

float sdHyperRoundedCylinder( vec3 p, float ra, float rb, float h ){
    vec2 d = vec2( length(p.xy)-2.0*ra+rb, abs(p.z) - h );
    return min(max(d.x,d.y),0.0) + length(max(d,0.0)) - rb;
}

float sdHyperTriPrism( vec3 p, vec3 d, float w, float h ){
    vec3 q = abs(p);
    return max(q.z-d.y,max(q.x*w+p.y*h,-p.y)-d.x*0.5); // 0.866025 w 0.5 h
}

float sdHyperTriPrismInv( vec3 p, vec3 d, float w, float h ){
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
    float apos = sdHyperRoundBox(vec3(m*p.xy,p.z), vec3(0.25, 1., 1.0), 0.25);
    return apos;
}

float makeTwo(vec3 p){
    float offset = 2.5;
    float base = sdHyperRoundBox(p + vec3(offset,-2.,0.), vec3(2.5,2.,1.), 1.0);
    float box = sdHyperRoundBox(p + vec3(offset,2.5,0.), vec3(2.5,1.,1.), 0.25);
    base = sUnion(base, box, 0.3);
    float centerCut = sdHyperRoundBox(p + vec3(offset,-0.35,0.), vec3(1.,2.5,3.), 0.25);
    base = sSub(centerCut, base, 0.3);
    float centerHalf = sdHyperRoundBox(p + vec3(offset,0.5,0.), vec3(3.5,1.5,3.), 0.25);
    base = sSub(centerHalf, base, 0.3);
    float c = cos(0.75);
    float s = sin(0.75);
    mat2  m = mat2(c,-s,s,c);
    float di = sdHyperRoundBox(vec3(m*(p.xy+vec2(offset,0.5)), p.z + vec2(0.,0.)), vec3(2.75,0.5,1.), 0.25);
    base = sUnion(base, di, 0.3);

    return base;
}

float makeFour(vec3 p){
    float offset = 2.5;
    float base = sdHyperRoundBox(p + vec3(-offset-2.,-0.25,0.), vec3(1.,3.75,1.), 0.25);
    float cross = sdHyperRoundBox(p + vec3(-offset-1.,.5,0.), vec3(3.5,0.5,1.), 0.25);
    base = sUnion(base, cross, 0.3);
    float c = cos(0.85);
    float s = sin(0.85);
    mat2  m = mat2(c,-s,s,c);
    float di = sdHyperRoundBox(vec3(m*(p.xy+vec2(-offset+0.5,-1.5)), p.z + vec2(0.,0.)), vec3(2.75,0.5,1.), 0.25);
    base = sUnion(base, di, 0.3);

    return base;
}

float makeRing(vec3 p) {
    float c = cos(uTime);
    float s = sin(uTime);
    mat2  m = mat2(s,c,-c,s);
    vec2 q = vec2(m*p.yz);
    vec3 fp = vec3(p.x+8.25*s, q.x+8.25*c, q.y);
    float ring = sdHyperRoundedCylinder(vec3(p.x,q.x,q.y), 4.2, 1., 0.0625);
    ring = sSub(sdHyperRoundedCylinder(vec3(p.x,q.x,q.y), 4.12, 1.5, 3.0), ring, 0.3);
    ring = sUnion(sdHyperSphere(fp, 0.5), ring, 0.01);
    c = cos(uTime + 1.);
    s = sin(uTime + 1.);
    m = mat2(s,c,-c,s);
    q = vec2(m*p.xz);
    fp = vec3(q.x+8.25*c, p.y+8.25*s, q.y);
    float ring2 = sdHyperRoundedCylinder(vec3(q.x,p.y,q.y), 4.2, 1., 0.0625);
    ring2 = sSub(sdHyperRoundedCylinder(vec3(q.x,p.y,q.y), 4.12, 1.5, 3.0), ring2, 0.3);
    ring2 = sUnion(sdHyperSphere(fp, 0.5), ring2, 0.01);
    c = cos(uTime + 2.);
    s = sin(uTime + 2.);
    m = mat2(s,-c,c,s);
    q = vec2(m*p.xz+1.0);
    vec2 o = vec2(m*p.yz*0.2);
    fp = vec3(q.x+8.25*c, p.y+8.25*s, q.y+o.y);
    float ring3 = sdHyperRoundedCylinder(vec3(q.x,p.y,q.y+o.y), 4.2, 1., 0.0625);
    ring3 = sSub(sdHyperRoundedCylinder(vec3(q.x,p.y,q.y+o.y), 4.12, 1.5, 3.0), ring3, 0.3);
    ring3 = sUnion(sdHyperSphere(fp, 0.5), ring3, 0.01);

    return min(ring, min(ring2, ring3));
}

float straifObj(vec3 p) {
    float c = cos(uTime);
    float s = sin(uTime);
    float r = random2D(vec2(floor(uTime*0.25), 1.0))*6.28 - 3.14;
    float r2 = random2D(vec2(floor(uTime*0.25)+5., 1.0))*6.28 - 3.14;
    mat3 m = mat3(
        1.0, 0., 0.,
        0., c, -s,
        0., s, c
    );
    mat2 m2 = mat2(r,-r2,r2,r);
    float v = mod(uTime*0.25, 1.0);
    vec3 mv = vec3(m2*vec2(v), v)*uSize.x;
    float blob = sdHyperRoundBox(vec3(p.xy,p.z)+mv, m*vec3(0.5, 0.7, 1.), 0.5);

    return blob;
}

float map(vec3 p) {
    float apos = makeApostrophe(p);
    float two = makeTwo(p);
    float four = makeFour(p);
    float ring = makeRing(p);

    float mixed = min(apos, min(two, min(four, ring)));

    //float blob = straifObj(p);
    //mixed = sUnion(mixed, blob, 0.5);

    return mixed;
}

// rotate raymarching camera

void main() {

    // Initialization
    vec3 ro = vec3(0, 0, -15);         // ray origin
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

    // #raymarchingColoring  dist  lightness   saturation lightness        hue
    vec3 colorOff = palette(col.x*4., vec3(0.5), vec3(0.5), vec3(0.75), vec3(0.90, 0.10, 0.20));

    gl_FragColor = vec4(uColor * colorOff, 1.0 - col.r);
}
