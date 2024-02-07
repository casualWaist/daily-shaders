varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 resolution;
uniform sampler2D uPositions;
uniform float time;
void main() {
    vUv = uv;
    vec4 pos = texture2D(uPositions, uv);
    float radius = length(pos.xy);
    float angle = atan(pos.y, pos.x) + 0.1;
    vec3 targetPos = vec3(cos(angle), sin(angle), 0.0) * radius;
    pos.xy += (targetPos.xy - pos.xy);
    vec4 mvPosition = modelViewMatrix * vec4(pos.xyz * time * 0.1, 1.0 );
    gl_PointSize = 10. * ( 1. / - mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}
