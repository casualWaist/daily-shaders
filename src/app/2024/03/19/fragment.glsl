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

    float SPEED = 0.075;
    float AMP = 0.025;

    vec2 p = vec2(vUv.x, vUv.y + uTime * SPEED);
    p.y += max((mod(vUv.y, 0.025)), 0.02);
    vec4 col = vec4(0.0, 0.0, 0.0, 1.0);

    // Elevating shift values to some high power (between 8 and 16 looks good)
    // helps make the stuttering look more sudden
    vec4 nRes = noise(vec2(SPEED * mod(uTime, 10.0), SPEED * mod(uTime, 10.0) * 0.04 ));
    vec4 shift = vec4pow(nRes, 8.0) * vec4(AMP, AMP, AMP, 1.0);

    col += rgbShift(p, shift);
    col += mod(vUv.y, 0.025);

    gl_FragColor = col;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
