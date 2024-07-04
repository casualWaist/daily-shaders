uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uPositions;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec2 uMouse;
uniform vec3 uCamera;
varying vec2 vUv;
varying vec3 vPosition;
varying float vDistance;
varying float vSize;


void main(){
    float globe = texture(uTexture, vUv).a;
    if (globe == 0.0) discard;
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    if (dot(cxy, cxy) > 1.0) discard;
    float dist = (distance(vPosition, uCamera) - 4.0) / (10.0 - 4.0);
    gl_FragColor = vec4(uColor, 1.0 - dist);
}
