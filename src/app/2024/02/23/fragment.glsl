uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform float uIndexX;
uniform float uIndexY;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
varying vec3 vPosition;
varying vec2 vUv;

void main(){

    vec2 subUv = vec2(vUv.x * 0.5 + float(uIndexX), vUv.y * 0.5 + float(uIndexY));
    vec4 tex = texture2D(uTexture, subUv);

    gl_FragColor = tex;
}
