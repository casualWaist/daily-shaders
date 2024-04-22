varying vec2 vUv;
varying vec2 vPoint;
varying vec3 vPosition;
varying vec2 vPoints;
uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uCanvas;
uniform vec3 uColor;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec3 uRayOrigin;
uniform vec2 uSize;

void main() {

    vec2 uv = gl_PointCoord;
    float distCent = distance(uv, vec2(0.5));

    if (distCent > 0.5) discard;

    vec4 color = texture2D(uCanvas, vUv);

    gl_FragColor = vec4(color.rgb * uColor, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
