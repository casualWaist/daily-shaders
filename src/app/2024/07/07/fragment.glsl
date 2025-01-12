uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uPositions;
uniform sampler2D uTexture;
uniform sampler2D uColorTex;
uniform vec3 uColor;
uniform vec3 uMouse;
uniform vec3 uCamera;
varying vec2 vUv;
varying vec3 vPosition;
varying float vDistance;
varying float vSize;


void main(){
    vec2 revUv = vec2(1.0 - vUv.x, vUv.y);
    float globe = texture(uTexture, revUv).a;
    vec4 color = texture(uColorTex, vec2(mod(revUv.x + 0.5, 1.0), vUv.y));
    color += color;
    if (globe == 0.0) discard;
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    if (dot(cxy, cxy) > 1.0) discard;
    float dist = (distance(vPosition, uCamera) - 4.0) / (11.0 - 3.0);
    gl_FragColor = vec4(color.xyz, 1.0 - vSize * 0.098);
}
