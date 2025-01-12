uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uPositions;
uniform vec3 uColor;
uniform vec2 uMouse;
varying vec2 vUv;
varying vec3 vPosition;
varying float vDistance;
varying float vSize;

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax){
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

void main(){
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    if (dot(cxy, cxy) > 1.0) discard;
    float alpha = remap(vSize, 0.0, 10.0, 1.0, 0.0);
    gl_FragColor = vec4(vec3(1.0), (1.04 - clamp(vDistance * 1.5, 0.0, 1.0)));
}
