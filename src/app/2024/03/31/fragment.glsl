uniform vec3 uCameraPos;
uniform vec2 uResolution;
uniform float uTime;

varying float vElevation;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vParticle;

void main(){
    float dist = distance(vUv, vParticle);
    vec3 color = vec3(dist, vParticle);

    gl_FragColor = vec4(color, 1.0);
}
