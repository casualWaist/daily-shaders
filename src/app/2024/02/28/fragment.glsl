uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;

void main(){

    float strips = mod((vPosition.y - uTime * 0.1) * 8., 1.0);
    strips = pow(strips, 3.0);

    // highlight edges
    vec3 viewDir = normalize(vPosition - cameraPosition);
    vec3 normNormal = normalize(vNormal);

    // flip the normal if the face is backfacing
    if (!gl_FrontFacing) {
        normNormal *= -1.;
    }
    float frensel = pow(dot(viewDir, normNormal) + 1., 2.0);

    float falloff = smoothstep(0.8, 0.0, frensel);
    float holographic = strips * frensel + frensel * 2.5;
    holographic *= falloff;

    gl_FragColor = vec4(uColor, holographic);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
