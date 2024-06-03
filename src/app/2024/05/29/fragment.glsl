uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uPositions;
uniform vec3 uColor;
uniform vec2 uMouse;
varying vec2 vUv;
varying vec3 vPosition;
varying float vFocus;

void main(){
    vec4 pos = texture(uPositions, vUv);
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    if (dot(cxy, cxy) > 1.0) discard;
    gl_FragColor = vec4(uColor, 1.0 - vFocus * 0.01);
}
