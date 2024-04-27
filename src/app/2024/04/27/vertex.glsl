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

    vPosition = position;
    vec4 viewPosition = modelViewMatrix * vec4(position.xy, position.z, 1.0);
    gl_Position = projectionMatrix * viewMatrix * viewPosition;

    vec4 pic = texture(uTexture, vUv);
    float pixIntensity = 1.0 - min(min(pic.r, pic.g), pic.b);
    gl_PointSize = uResolution.y * 0.05 * pixIntensity;
    gl_PointSize *= (1.0 / -viewPosition.z);
}
