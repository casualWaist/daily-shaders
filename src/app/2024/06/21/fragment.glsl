varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vFlow;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec2 uSize;
uniform vec3 uCamera;

void main() {

    vec3 viewDirection = normalize(vPosition - uCamera);
    vec4 texture = texture(uTexture, vUv);
    float fresnel = dot(viewDirection, vNormal);
    //fresnel /= smoothstep(1.0, vFlow.x, fresnel);
    //fresnel = pow(fresnel, 3.0);
    gl_FragColor = vec4(cross(texture.xyz, vFlow), mix(fresnel + 0.5, texture.r, vFlow.r));

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
