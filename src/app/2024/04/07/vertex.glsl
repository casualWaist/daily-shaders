varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;
uniform sampler2D uTexture;

float random2D(vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

void main() {
    vUv = vec2(uv.x, 1.0 - uv.y);
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vPosition = modelPosition.xyz;

    // normal transformation
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
    vNormal = modelNormal.xyz;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
