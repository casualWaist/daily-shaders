varying vec2 vUv;
varying vec2 vPoint;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec2 uMouse;
uniform vec2 uResolution;

float drawLine (vec2 p1, vec2 p2, vec2 uv, float a) {
    float r = 0.;
    float one_px = 1. / uResolution.x + 0.01; //not really one px

    // get dist between points
    float d = distance(p1, p2);

    // get dist between current pixel and p1
    float duv = distance(p1, uv);

    //if point is on line, according to dist, it should match current uv
    r = 1. - floor(1. - (a * one_px) + distance(mix(p1, p2, clamp(duv / d, 0., 1.)),  uv));

    return r;
}

void main() {

    vec4 color = texture(uTexture, vUv);
    color += drawLine(vec2(0.5, 0.5), vPoint, vUv, 1.0);

    gl_FragColor = color * vec4(uColor, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
