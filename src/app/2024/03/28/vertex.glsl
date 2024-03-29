varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float uSize;
uniform float uProgress;
attribute float aSize;
attribute float aTime;
attribute vec3 bPosition;

// range translation
float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax){
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

void main() {

    vec3 pos = position;
    float prog = sin(uTime * 0.5);

    vUv = vec2(uv.x, 1.0 - uv.y);
    vec4 modelPosition = modelMatrix * mix(vec4(pos, 1.0), vec4(bPosition, 1.0), prog);
    vPosition = modelPosition.xyz;
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uSize * uResolution.y * aSize * (1.0 / -viewPosition.z);

    // Windows doesn't let particles be smaller than one pixel so we hide it.
    if (gl_PointSize < 0.1) {
        gl_Position = vec4(9999.9);
    }
}
