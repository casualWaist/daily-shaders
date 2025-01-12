varying vec2 vUv;
varying vec3 vPosition;
varying float vDistance;
varying float vSize;
uniform float uFocus;
uniform vec2 uResolution;
uniform sampler2D uPositions;
uniform float uTime;
uniform vec3 uCamera;
attribute vec3 tangent;

// #particlesInGeometry #vertexShape
void main() {
    vUv = uv;
    vec4 pos = texture(uPositions, uv);
    vec3 direction = normalize(tangent - position);
    vPosition = mix(position, tangent, mod(uTime * 0.1, 0.1));
    vec4 mvPosition = modelViewMatrix * vec4(vPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 0.1;
    /*vDistance = abs(uFocus - -mvPosition.z);
    vSize = (step(-0.5, uv.x)) * vDistance * 10.1;
    gl_PointSize = vSize;*/
}
