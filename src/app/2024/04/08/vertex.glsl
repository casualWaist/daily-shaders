varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vAtmos;
uniform float uTime;

float random2D(vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    vUv = uv;
    vNormal = modelNormal;
    vPosition = modelPosition.xyz;
    float glitchTime = uTime * 4. - modelPosition.y;
    float glitch = (sin(glitchTime) + sin(glitchTime * 0.392) + sin(glitchTime * 0.8523)) / 3.0;
    float glitchStrength = smoothstep(0.3, 1., glitch) * 0.25;
    modelPosition.x += (random2D(modelPosition.xz + uTime) * 0.5 - 0.5) * glitchStrength;
    modelPosition.z += (random2D(modelPosition.zx + uTime) * 0.5 - 0.5) * glitchStrength;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

}
