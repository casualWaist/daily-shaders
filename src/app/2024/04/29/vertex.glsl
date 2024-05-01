varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vPoint;
varying vec2 vPoints;
varying vec3 vColor;
uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform vec2 uSize;
attribute vec3 col;

float random2D(vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

/*void main() {
    vUv = vec2(uv.x, 1.0 - uv.y);
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float glitchTime = uTime * 4. - modelPosition.y;
    float glitch = (sin(glitchTime) + sin(glitchTime * 0.392) + sin(glitchTime * 0.8523)) / 3.0;
    float glitchStrength = smoothstep(0.3, 1., glitch) * 0.25;
    vPosition = modelPosition.xyz;
    modelPosition.x += (random2D(modelPosition.xz + uTime) * 0.5 - 0.5) * glitchStrength;
    modelPosition.z += (random2D(modelPosition.zx + uTime) * 0.5 - 0.5) * glitchStrength;

    // normal transformation
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
    vNormal = modelNormal.xyz;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}*/

void main() {
    vUv = uv;
    vColor = col;
    vPosition = position;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
