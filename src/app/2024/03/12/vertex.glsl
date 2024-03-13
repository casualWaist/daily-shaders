varying vec2 vUv;
varying vec4 vPosition;
varying vec3 vNormal;
varying vec2 vPoint;
uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform vec2 uMouse;

uniform float xS;
uniform float xSk;
uniform float ySk;
uniform float yS;

void main() {

    mat2 trans = mat2(
        xS, xSk, ySk, yS
    );
    vUv = uv * trans;

    /*
        matrix transform key:
            scale x, skew x, skew y, scale y
    */

    vPosition = vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vPosition;
}
