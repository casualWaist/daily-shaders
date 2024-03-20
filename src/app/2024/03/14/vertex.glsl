varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vPoint;
varying vec2 vPoints;
uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform vec2 uSize;
attribute vec2 points;

void main() {

    vUv = uv * uSize - uSize * 0.5;
    vPoint = uMouse * uResolution;
    vPoints = vec2(points.x + uMouse.x, points.y * (sin(uTime)) + 1.0) * uMouse;
    /*
        matrix transform key:
            scale x, skew x, skew y, scale y
    */

    vPosition = position;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
