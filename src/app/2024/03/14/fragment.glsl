varying vec2 vUv;
varying vec2 vPoint;
varying vec2 vPoints;
varying vec3 vPosition;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec2 uSize;

/* horizon line with a kind of rising sun
float red = dot(vUv * vPosition.xy / uSize, uSize * 0.8);
red *= dot(vUv, vPoint);
*/

void main() {

    float dis = distance(gl_FragCoord.xy / uResolution, uMouse + 1.0);
    float size = uResolution.y * 0.0001;
    float ring = smoothstep(size, size + uResolution.y * 0.000002, dis);
    float pDis = distance(vPosition.xy / uSize, vPoints);
    ring += smoothstep(size, size + uResolution.y * 0.00002, pDis);

    float red = smoothstep(0.45, 0.5, dot(vUv, vPoints));
    float green = step(0.0, dot(vUv, vPoint));
    float blue = mod(uTime, 1.0) * step(0.5, dot(vUv, vPoint));

    vec4 color = vec4(ring * red, 0.0, 0.0, ring);
    gl_FragColor = color;

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
