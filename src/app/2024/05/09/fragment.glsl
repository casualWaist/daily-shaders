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

    // geometry
    float distCenterY = pow(1.0 - distance(vUv.y, 0.5), 40.0);
    float distCenterX = pow(1.0 - distance(vUv.x, uProgress), 2.0);
    float radCenter = pow(1.0 - distance(vCenter, vec2(0.0)), 2.0);

    // bright spot
    float yFade = 1.0 - abs(vCenter.y * 2.0);
    float fadeTime = smoothstep(0.1, 0.5, uProgress) * smoothstep(0.9, 0.5, uProgress);
    float fadePos = smoothstep(0.2, 1.0, radCenter);
    vec2 point = vec2(uProgress, 0.0);
    float dist = distance(vCenter + vec2(0.5, 0.0), point);
    float hotSpot = pow(1.0 - dist, 20.0) * fadeTime;

    // glow
    vec3 lineColor = vec3(pow(yFade, 20.0), pow(yFade, 60.0), pow(yFade, 100.0));
    vec3 glowColor = vec3(hotSpot, 0.0, 0.0) + uColor;
    glowColor *= mix(distCenterY, distCenterX * fadeTime * 0.1, radCenter) * fadePos;
    glowColor +=  uColor * distCenterY * distCenterX * fadePos;
    vec3 mask = vec3(hotSpot);

    // edge feathering
    vec3 combinedColor = hotSpot * lineColor + glowColor * fadePos * fadeTime;
    float ss = smoothstep(0.1, 0.9, combinedColor.r);
    ss *= smoothstep(0.0, 0.1, (vUv.x));
    ss *= smoothstep(1.0, 0.9, (vUv.x));
    ss *= smoothstep(0.2, 0.4, (vUv.y));
    ss *= smoothstep(0.8, 0.4, (vUv.y));

    // noise
    float orgMoTex = (texture(uTexture, vec2(vUv.x * 2.0 - sin(uTime) * 0.1, abs(vUv.y) - uTime * 0.1))).r;
    float horzMoTex = (texture(uTexture, vec2(vUv.x * 2.0 - sin(uTime) * 0.1 * orgMoTex, abs(vCenter.y) - uTime * 0.1))).r * 0.5 - 0.75;
    float vertMoTex = (texture(uTexture, vec2(vUv.x * 0.1, abs(vCenter.y) - uTime * 0.2 * orgMoTex))).r * 0.1 - 0.75;/*
    float angle = mod(atan(vUv.x - uProgress, vCenter.y), 0.6);
    vec2 adjUv = vUv * mix(vertMoTex.r, angle, hotSpot);
    vec4 rayMoTex = texture(uTexture, vec2(pow(adjUv.x, 2.0) - uTime * 0.1, adjUv.y));*/

    // mixing
    /*vec3 lineFade = lineColor * fadePos * horzMoTex.r * vertMoTex.r;
    vec3 glowFade = glowColor * fadePos * fadeTime * hotSpot;
    vec3 finalColor = (combinedColor + lineFade + glowFade * ss) * fadePos;*/
    vec3 finalColor = combinedColor + horzMoTex * vertMoTex * uColor * fadePos;

    gl_FragColor = vec4(finalColor + lineColor * fadePos * glowColor * (orgMoTex * 10.0), finalColor.r);
    //gl_FragColor = vec4(lineFade, 1.0);
    //gl_FragColor = rayMoTex * fadePos * hotSpot;
    //gl_FragColor = vec4(combinedColor + lineColor * tex.r, ss);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
