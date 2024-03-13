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
uniform float xSk3;
uniform float xT;

uniform float ySk;
uniform float yS;
uniform float ySk3;
uniform float yT;

uniform float zSk;
uniform float zSk3;
uniform float zS;
uniform float zT;

uniform float skY;
uniform float skX;
uniform float skZ;
uniform float wS;

void main() {
    vUv = uv;

    mat4 trans = mat4(
        xS, xSk, xSk3, xT,
        ySk, yS, ySk3, yT,
        zSk, zSk3, zS, zT,
        skY, skX, skZ, wS
    );

    /*
        matrix transform key:
            scale x, skew x 2D, skew x 3D, translation x
            skew y 2D, scale y, skew y 3D, translation y
            skew z along y, skew z along x, scale z, translation z
            skew scale y, skew scale x, skew scale z, scale all reversed
    */

    vPosition = vec4(position, 1.0) * trans;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vPosition;
}
