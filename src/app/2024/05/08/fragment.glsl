uniform vec2 uResolution;
uniform float uTime;
uniform float uProgress;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
varying vec3 vPosition;
varying vec2 vUv;
varying vec2 vCenter;

void main(){

    vec2 adjUv = vec2((vUv.x) * 0.1, (vUv.y));
    vec4 tex = texture(uTexture, vec2(adjUv.x + uTime * 0.1, adjUv.y));

    float yFade = 1.0 - abs(vCenter.y * 2.0);
    float power = smoothstep(0.0, 0.2, uProgress) * smoothstep(1.0, 0.8, uProgress);
    vec2 point = vec2(uProgress, 0.0);
    float dist = distance(vCenter + vec2(0.5, 0.0), point);
    float hotSpot = pow(1.0 - dist, 20.0) * power;


    float distCenterY = pow(1.0 - distance(vUv.y, 0.5), 40.0);
    float distCenterX = pow(1.0 - distance(vUv.x, uProgress), 2.0);
    float radCenter = pow(1.0 - distance(vCenter, vec2(0.0)), 2.0);
    vec3 lineColor = vec3(pow(yFade, 20.0), pow(yFade, 60.0), pow(yFade, 100.0));
    vec3 glowColor = vec3(1.0 - vCenter.y, 0.0, 0.0) + uColor;
    glowColor *= mix(distCenterY, distCenterX, radCenter) * radCenter;
    glowColor +=  uColor * distCenterY * distCenterX * 0.5;
    vec3 mask = vec3(point.x, 0.0, 0.0);

    float ss = smoothstep(0.1, 0.9, hotSpot * lineColor.r + glowColor.r);
    ss *= smoothstep(0.0, 0.1, (vUv.x));
    ss *= smoothstep(1.0, 0.9, (vUv.x));
    ss *= smoothstep(0.2, 0.4, (vUv.y));
    ss *= smoothstep(0.8, 0.4, (vUv.y));

    //gl_FragColor = vec4(distCenterX, 0.0, 0.0, 1.0);
    //gl_FragColor = tex * ss * 7. + vec4(vUv, 0.0, 1.0);
    gl_FragColor = vec4(hotSpot * lineColor + glowColor, ss);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
