
uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uPositions;
uniform vec3 uColor;
uniform vec2 uMouse;
varying vec2 vUv;
varying vec3 vPosition;

// #ring #ringAroundPointer #circle #circleAroundPointer
void main(){
    float distance = distance(gl_FragCoord.xy / uResolution, uMouse);
    float radius = 0.025;
    float thickness = 0.005;
    float insideCircle = smoothstep(radius, radius + thickness, distance);
    float outsideCircle = smoothstep(radius, radius - thickness, distance - 0.01);
    vec3 color = mix(uColor, mix(uColor, vec3(1., 0.5, 0.5), outsideCircle), insideCircle);
    vec2 dir = vec2(0., -1.);
    vec2 perp = normalize(vec2(dir.y, -dir.x));
    vec2 offset = perp * (thickness * 0.5);
    vec2 bodStart = uMouse + offset;
    vec2 bodEnd = uMouse - offset;
    color.rg *= bodStart + (bodEnd - bodStart) * uMouse.y;
    gl_FragColor = vec4(color, 1.);
}
