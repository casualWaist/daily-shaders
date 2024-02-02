uniform float time;
uniform vec3 color;
varying vec2 vUv;
varying vec3 vPosition;
varying float vNoise;
//#pragma glslify: random = require(glsl-random)

void main() {
    float x = vNoise * vPosition.x;
    float y = vNoise * vPosition.y;
    float z = vNoise * vPosition.z;
    gl_FragColor.rgba = vec4(color.r + x * 2.0, color.g + y * 2.0, color.b + z * 2.0, 1.0);
}
