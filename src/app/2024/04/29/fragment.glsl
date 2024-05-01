varying vec2 vUv;
varying vec2 vPoint;
varying vec3 vPosition;
varying vec2 vPoints;
varying vec3 vColor;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec3 uRayOrigin;
uniform vec2 uSize;

void main() {
    //float dist = 1.0 - distance(uRayOrigin, vPosition) * 0.001 + 0.75;

    //gl_FragColor = vec4(uColor, vColor.r * dist); // fade by distance from camera
    gl_FragColor = vec4(uColor, vColor.r);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
