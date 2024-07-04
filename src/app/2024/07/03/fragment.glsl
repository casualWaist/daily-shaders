uniform vec3 uColor;
uniform float uTime;
uniform vec2 uMouse;

uniform sampler2D uTexture;
uniform vec3 uCameraPos;

varying vec3 vPosition;
varying vec3 vWorldPos;
varying vec2 vUv;

void main() {

    float dots = step(0.025, mod(vUv.x * 20.0, 0.05));
    dots *= step(0.025, mod(vUv.y * 20.0, 0.05));
    vec4 col = texture(uTexture, vUv);
    col.a *= dots;
    gl_FragColor = col;

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
