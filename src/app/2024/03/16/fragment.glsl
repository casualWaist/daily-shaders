varying vec2 vUv;
varying vec2 vPoint;
varying vec3 vPosition;
uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uNoise;
uniform vec3 uColor;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec2 uSize;

float falloff = 3.0;

vec3 brownian(vec3 p) {
    vec3 result = vec3(0.0);
    float amp = 0.5;
    for (int i = 0; i < 3; i++) {
        result += (texture(uTexture, p.xy / amp * p.z).rgb * amp);
        amp /= falloff;
    }
    return result;
}

void main() {

    vec4 noise = texture(uNoise, vUv * uTime * 0.01);

    vec4 color = vec4(brownian(vec3(vPosition.xy, uTime * noise.x * 0.3)), 1.0);

    gl_FragColor = color;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
