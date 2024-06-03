varying vec2 vUv;
varying vec3 vPosition;
varying float vDistance;
varying float vSize;
uniform vec2 uResolution;
uniform sampler2D uPositions;
uniform float uTime;
uniform vec3 uCamera;

// #particlesInGeometry #vertexShape
void main() {
    vUv = uv;
    vec4 pos = texture(uPositions, uv);
    vec4 mvPosition = modelViewMatrix * pos;
    gl_Position = projectionMatrix * mvPosition;
    vDistance = pow(abs(4.0 - -mvPosition.z), 2.0);
    vSize = (step(0.5 - (1.0 / 10.), uv.x)) * vDistance * 30.1;
    gl_PointSize = vSize;
}
