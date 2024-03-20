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

    vUv = uv;
    vPoint = uMouse * uResolution;
    vPoints = points;

    vPosition = position;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
