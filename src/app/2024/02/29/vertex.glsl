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

// range translation
float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax){
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

void main() {

    vec3 pos = position;
    float prog = uProgress * aTime;

    float expole = remap(prog, 0.0, 0.1, 0.0, 1.0);
    expole = clamp(expole, 0.0, 1.0);
    expole = 1.0 - pow(1.0 - expole, 3.0);
    pos *= expole;

    float fall = remap(prog, 0.1, 1.0, 0.0, 1.0);
    fall = clamp(fall, 0.0, 1.0);
    fall = 1.0 - pow(1.0 - fall, 3.0);
    pos.y -= fall * 0.2;

    float sizeUp = remap(prog, 0.0, 0.125, 0.0, 1.0);
    float sizeDown = remap(prog, 0.125, 1.0, 1.0, 0.0);
    float size = min(sizeUp, sizeDown);
    size = clamp(size, 0.0, 1.0);

    float twinkle = remap(prog, 0.2, 0.8, 0.0, 1.0);
    twinkle = clamp(twinkle, 0.0, 1.0);
    float twink = sin(prog * 30.) * 0.5 + 0.5;
    twink = 1. - twink * twinkle;

    vUv = vec2(uv.x, 1.0 - uv.y);
    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uSize * uResolution.y * size * aSize * twink * (1.0 / -viewPosition.z);

    // Windows doesn't let particles be smaller than one pixel so we hide it.
    if (gl_PointSize < 0.1) {
        gl_Position = vec4(9999.9);
    }
}
