uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uPositions;
uniform vec3 uColor;
uniform vec2 uMouse;
uniform vec3 uCamera;
varying vec2 vUv;
varying vec3 vPosition;
varying float vDistance;
varying float vSize;


void main(){
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    vec4 pos = texture(uPositions, vUv);
    float dist = distance(pos.xyz, vec3(sin(uTime) * 0.5,0.,-0.75));
    if (dot(cxy, cxy) > 1.0) discard;
    vec3 offColor = vec3(0.21, 0.312, 0.42);
    gl_FragColor = vec4(mix(uColor, offColor, dist), (1.04 - clamp(vDistance * 1.5, 0.0, 1.0)));
}
