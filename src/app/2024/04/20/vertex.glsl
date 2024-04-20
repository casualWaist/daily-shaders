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

void main() {

    vUv = uv;
    vPoint = uMouse * uResolution;

    vPosition = position;
    vec4 off = texture2D(uCanvas, vUv);
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * viewMatrix * viewPosition;
    gl_PointSize = uResolution.y * 0.03125;
    gl_PointSize *= (1.0 / -viewPosition.z);
}
