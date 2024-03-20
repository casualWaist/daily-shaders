uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform float uIndexX;
uniform float uIndexY;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
varying vec3 vPosition;
varying vec2 vUv;
varying float vSize;

void main(){

    vec2 subUv = vec2(vUv.x * 0.5 + float(uIndexX), vUv.y * 0.5 - float(uIndexY));

    vec4 tex = texture(uTexture, gl_PointCoord * 0.5 + subUv);
    float dist = distance(vPosition, uRayOrigin) * 0.5;

    gl_FragColor = tex * dist;
    //gl_FragColor = vec4(vSize, 0., 0., 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
