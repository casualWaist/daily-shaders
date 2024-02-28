uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform vec3 uColor;
varying vec3 vPosition;
varying vec2 vUv;

void main(){

    float angle = uTime * 0.25;
    float cosAngle = cos(-angle);
    float sinAngle = sin(-angle);
    vec2 aUv = vUv - 0.5;
    vec2 uv = vec2(aUv.x * cosAngle - aUv.y * sinAngle, aUv.x * sinAngle + aUv.y * cosAngle);

    vec4 rot = texture2D(uTexture, uv + 0.5);
    vec4 pos = texture2D(uTexture, vUv);

    float d = distance(uMouse + 0.5, vUv) / 8.0;
    float distFromCenter = distance(vUv, vec2(0.5, 0.5));
    vec4 rotFade = mix(rot, vec4(0.0, 0.0, 0.0, 1.0), distFromCenter * 2.0);
    vec4 color = vec4((rotFade.rgb - pos.rgb) / d, pos.a);

    gl_FragColor = color;

}
