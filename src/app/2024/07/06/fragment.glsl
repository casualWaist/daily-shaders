uniform vec2 uResolution;
uniform float uTime;
uniform float uProgress;
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
    vec2 revUv = vec2(1.0 - vUv.x, vUv.y);
    vec4 color = texture(uTexture, revUv);
    color += color;
    if (color.r == 0.0) discard;
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    if (dot(cxy, cxy) > 1.0) discard;
    float dist = pow((distance(vPosition, uCamera) - 4.0) / 9.0, clamp(uProgress * 0.2, 0.0, 0.5));
    gl_FragColor = vec4(color.xyz, 1.0 - dist);
}
