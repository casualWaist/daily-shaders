varying vec2 vUv;
varying vec2 vPoint;
varying vec3 vPosition;
varying vec2 vPoints;
uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uNoise;
uniform vec3 uColor;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec3 uRayOrigin;
uniform vec2 uSize;

vec4 rgbShift(vec2 p ,vec4 shift) {
    shift *= 2.0 * shift.w - 1.0;
    vec2 rs = vec2(shift.x, -shift.y);
    vec2 gs = vec2(shift.y, -shift.z);
    vec2 bs = vec2(shift.z, -shift.x);

    float r = texture(uTexture, p + rs, 0.0).x;
    float g = texture(uTexture, p + gs, 0.0).y;
    float b = texture(uTexture, p + bs, 0.0).z;

    return vec4(r, g, b, 1.0);
}

vec4 noise(vec2 p ) {
    return texture(uNoise, p);
}

vec4 vec4pow(vec4 v,float p ) {
    // Don't touch alpha (w), we use it to choose the direction of the shift
    // and we don't want it to goone direction more often than the other
    return vec4(pow(v.x, p), pow(v.y, p), pow(v.z, p), v.w);
}

void main() {

    vec2 center = vec2(0.5);
    float disCenter = distance(vUv, center);
    vec2 coordCentered = gl_FragCoord.xy / uResolution - 1.0;
    float disMouse = distance(coordCentered, uMouse);

    float radius = 0.025;
    float thickness = 0.005;

    float blueShift = distance(disCenter, disMouse + 0.1);
    float redShift = distance(disCenter, disMouse + 0.125);
    float greenShift = distance(disCenter, disMouse + 0.15);
    float insideCircle = smoothstep(radius, radius + thickness, disMouse * (disCenter - disMouse));
    float outsideCircle = smoothstep(radius, radius - thickness, disMouse * (disCenter - disMouse) - radius);

    vec3 ring = mix(vec3(1.0, 1.0, 1.0), mix(vec3(1.0, 1.0, 1.0), vec3(0.0, 0.0, 0.0), insideCircle), outsideCircle);
    ring *= vec3(blueShift, redShift, greenShift);

    vec2 uv = vUv;
    uv *= 50.0 + blueShift + redShift + greenShift;
    uv = mod(uv, min(blueShift, 0.5));
    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.05, point);
    vec4 col = vec4(1.0 - ring - point, 1.0);

    gl_FragColor = col;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
