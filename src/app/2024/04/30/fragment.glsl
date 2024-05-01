varying vec2 vUv;
varying vec2 vPoint;
varying vec3 vPosition;
varying vec2 vPoints;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;

void main() {

    float alpha = texture(uTexture, gl_PointCoord).r;
    float distCenter = length(gl_PointCoord - vec2(0.5));
    if (distCenter > 0.5) discard;

    gl_FragColor = vec4(uColor - alpha, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
