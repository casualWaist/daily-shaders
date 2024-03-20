uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
varying vec3 vPosition;
varying vec2 vUv;

void main(){

    vec4 tex = texture(uTexture, vUv);

    gl_FragColor = tex - vec4(uColor, 0.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
