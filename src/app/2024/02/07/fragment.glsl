
uniform vec2 resolution;
uniform float time;
uniform sampler2D uPositions;
uniform vec3 color;
uniform vec2 mouse;
varying vec2 vUv;
varying vec3 vPosition;


void main(){
    vec4 pos = texture2D(uPositions, vUv);
    pos.xy += vec2(0.01);
    gl_FragColor = vec4(pos.xy, 1., 1.);
}
