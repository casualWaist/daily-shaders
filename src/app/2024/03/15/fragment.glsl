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
uniform vec2 uSize;

void main() {

    float dis = distance(gl_FragCoord.xy / uResolution, uMouse + 1.0);
    float size = uResolution.y * 0.0001;
    float ring = smoothstep(size, size + uResolution.y * 0.000002, dis);

    float red = step(1.1, distance(gl_FragCoord.xy / uSize, vPoints));
    float green = step(0.5, dot(vUv, vPoints));
    float blue = step(0.5, dot(vUv, vPoints));
    vec4 noise = texture(uNoise, vUv * uTime + 2.0 * 0.001);

    vec3 c = vec3(cos(uTime), sin(uTime), 0.0);
    vec3 col = vec3(smoothstep(vec4(c * ring, 1.0), vec4(c * ring, 1.0) + 0.01, noise));
    vec4 color = vec4(col, 1.0);

    gl_FragColor = color;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
