varying vec2 vUv;
varying vec3 vPosition;
varying float vDistance;
varying float vSize;
uniform float uFocus;
uniform vec2 uResolution;
uniform sampler2D uPositions;
uniform float uTime;
uniform vec3 uCamera;
uniform vec3 uMouse;

// #particlesInGeometry #vertexShape
void main() {
    vUv = uv;
    float distMouse = pow(distance(vec3(-uMouse.x, uMouse.yz), position), 30.0) * 0.000000000000001;
    vec4 pos = texture(uPositions, uv);
    vec4 mvPosition = modelViewMatrix * vec4(mix(position, position + normal * pos.xyz, distMouse), 1.0);
    vPosition = mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
    vDistance = abs(7.0 - -mvPosition.z * 2.0);
    vSize = clamp(step(0.02, uv.x + 2.0) * vDistance * 5.0, 5.0, 10.0);
    gl_PointSize = vSize;
}
