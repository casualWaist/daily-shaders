#define pi 3.14159265
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColor;
varying vec3 vPosition;

float drawLine (vec2 p1, vec2 p2, vec2 uv, float a)
{
    float r = 0.;
    float one_px = 1. / uResolution.x + 0.01; //not really one px

    // get dist between points
    float d = distance(p1, p2);

    // get dist between current pixel and p1
    float duv = distance(p1, uv);

    //if point is on line, according to dist, it should match current uv
    r = 1.-floor(1.-(a*one_px)+distance (mix(p1, p2, clamp(duv/d, 0., 1.)),  uv));

    return r;
}

float drawCircle(vec2 p, float d, vec2 uv)
{
    return (distance(p, uv) <= d) ? 1. : 0.;
}

void main(){
    vec2 uv = gl_FragCoord.xy * vPosition.xy / uResolution.xy;
    float t = uTime*1.5; //Pro Tip™: multipluy time to go faster!

    //in uv space
    vec2 p1 = vec2(0.5 + sin(t)*.2, 0.25 + cos(t+pi)*.1);
    vec2 p2 = vec2(0.5 + sin(t+pi)*.2, 0.25 + cos(t)*.1);
    vec2 p3 = vec2(0.5 + sin(t+pi/2.)*.2, 0.25 + cos(t-.5*pi)*.1);
    vec2 p4 = vec2(0.5 + sin(t-pi/2.)*.2, 0.25 + cos(t+.5*pi)*.1);
    vec2 p5 = vec2(0.5 + sin(t)*.2, 0.75 + cos(t+pi)*.1);
    vec2 p6 = vec2(0.5 + sin(t+pi)*.2, 0.75 + cos(t)*.1);
    vec2 p7 = vec2(0.5 + sin(t+pi/2.)*.2, 0.75 + cos(t-.5*pi)*.1);
    vec2 p8 = vec2(0.5 + sin(t-pi/2.)*.2, 0.75 + cos(t+.5*pi)*.1);


    float lines = drawLine(p1, p5, uv, 1.)
    + drawLine(p2, p6, uv, 1.)
    + drawLine(p1, p3, uv, 1.)
    + drawLine(p3, p2, uv, 1.)
    + drawLine(p1, p4, uv, 1.)
    + drawLine(p4, p2, uv, 1.)
    + drawLine(p5, p7, uv, 1.)
    + drawLine(p7, p6, uv, 1.)
    + drawLine(p6, p8, uv, 1.)
    + drawLine(p8, p5, uv, 1.)
    + drawLine(p3, p7, uv, 1.)
    + drawLine(p4, p8, uv, 1.);

    float d = 0.003;
    float dots = drawCircle(p1, d, uv)
    + drawCircle(p2, d, uv)
    + drawCircle(p3, d, uv)
    + drawCircle(p4, d, uv)
    + drawCircle(p5, d, uv)
    + drawCircle(p6, d, uv)
    + drawCircle(p7, d, uv)
    + drawCircle(p8, d, uv);

    gl_FragColor = vec4(uColor.r - lines*.6-dots, uColor.g + dots, uColor.b + dots, 1.);
}
