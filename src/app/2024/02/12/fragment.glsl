uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
varying vec3 vPosition;
varying vec2 vUv;

void main(){

    float index = 10. - uTime - 1.;
    vec2 subUv = vec2(vUv.x * 0.1 + index * 0.1, vUv.y * 0.1 + 0.9);
    vec4 tex = texture(uTexture, subUv);

    gl_FragColor = tex;
}
