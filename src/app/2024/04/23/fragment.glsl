varying vec2 vUv;
varying vec2 vPoint;
varying vec2 vPoints;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec3 vViewDirection;
uniform vec3 textureScale;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec2 uSize;

void main() {

    vec2 nUv;
    if (abs(vWorldNormal.y) > 0.5) {
        nUv = vWorldPosition.xz;
    } else if (abs(vWorldNormal.x) > 0.5) {
        nUv = vWorldPosition.yz;
    } else {
        nUv = vWorldPosition.xy;
    }
    vec4 sampledDiffuseColor = texture( uTexture, nUv );

    gl_FragColor = sampledDiffuseColor * vec4(uColor, 1.0) + vec4(0.0, 0.0, 0.0, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
