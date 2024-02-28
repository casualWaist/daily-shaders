uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform float uIndexX;
uniform float uIndexY;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
varying vec3 vPosition;
varying vec2 vUv;

float drawCircle(vec2 p, float d, vec2 uv){
    return (distance(p, uv) <= d) ? 1. : 0.;
}

void main(){

    vec2 uv = gl_FragCoord.xy * vPosition.xy / uResolution.xy;

    vec2 p1 = vec2(0.5*.2, 0.25 + cos(uTime+3.14)*.1);

    float dots = drawCircle(p1, 0.3, uv + (sin(uTime) + 1.0) * 0.5);

    float distanceToCenter = length(vPosition);

    float normalizedDistance = distanceToCenter / 2.;

    vec3 color = vec3(normalizedDistance * (abs(sin(uTime * 0.5)) + 0.75));

    float red = smoothstep(uColor.r, color.r, normalizedDistance);
    float green = smoothstep(uColor.g, color.g, normalizedDistance);
    float blue = smoothstep(uColor.b, color.b, normalizedDistance);

    gl_FragColor = vec4(red * uColor.r, green * uColor.g, blue * uColor.b, 1.0);
}
