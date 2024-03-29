uniform vec2 uResolution;
varying vec3 vPosition;
varying vec2 vUv;
varying vec4 vGliphBounds;
varying float vGliphIndex;

void main(){
    vec2 pos = normalize((vUv - 0.5) * uResolution);
    vec3 color = vPosition;

    gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
}
