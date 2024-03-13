uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
uniform vec2 uMouse;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;

void main(){

    vec2 point = uMouse * uResolution * 0.01;
    vec3 color = vec3(vPosition);
    color.gb *= mat2(1.0, point.x, point.y, 1.0);
    color.rg *= mat2(uMouse.x * 0.75, 0.0, 0.0, uMouse.y * 0.75);
    color.rb *= mat2(point.x, -uMouse.x * 0.75, -uMouse.y * 0.75, point.y);
    gl_FragColor = vec4(uColor * color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
