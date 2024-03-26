varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vPoint;
varying vec2 vPoints;
uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform sampler2D uCanvas;
uniform vec2 uMouse;
uniform vec2 uSize;
attribute vec2 points;

void main() {

    vUv = uv;
    vPoint = uMouse * uResolution;

    vPosition = position;
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * viewPosition * vec4(2.0, 2.0, 1.0, 1.0);

    vec4 pic = texture2D(uTexture, vUv);
    vec4 off = texture2D(uCanvas, vUv);
    float pixIntensity = 1.0 - min(min(pic.r, pic.g), pic.b);
    gl_PointSize = uResolution.y * 0.25 * pixIntensity * off.x;
    gl_PointSize *= (1.0 / -viewPosition.z);
}
