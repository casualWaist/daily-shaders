varying vec2 vUv;
varying vec3 vPosition;
varying float vDistance;
varying float vSize;
uniform float uFocus;
uniform vec2 uResolution;
uniform sampler2D uPositions;
uniform float uTime;
uniform vec3 uCamera;

// #particlesInGeometry #vertexShape
void main() {
    vUv = uv;
    float cos = cos(uTime * 0.5);
    float sin = sin(uTime * 0.5);
    mat4 rotationMatrix = mat4(
        cos, 0.0, sin, 0.0,
        0.0, 1.0, 0.0, 0.0,
        -sin, 0.0, cos, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
    vec4 pos = texture(uPositions, uv);
    vec4 mvPosition = modelViewMatrix * rotationMatrix * pos;
    vPosition = mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
    vDistance = abs(7.0 - -mvPosition.z * 2.0);
    vSize = clamp(step(0.02, uv.x + 2.0) * vDistance * 5.0, 5.0, 10.0);
    gl_PointSize = vSize;
}
