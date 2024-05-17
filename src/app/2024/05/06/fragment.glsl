uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
varying vec3 vPosition;
varying vec2 vUv;

void main(){

    float distCenterY = pow(1.0 - distance(vUv.y + 0.5, 0.5), 10.0);
    float distCenterX = pow(1.0 - distance(vUv.x + 0.5, 0.5), 2.0);
    float radCenter = pow(1.0 - distance(vUv, vec2(0.0)), 2.0);
    vec3 lineColor = vec3(1.0 - vUv.y, 0.0, 0.0) + uColor;
    lineColor *= distCenterX * distCenterY * radCenter;
    //lineColor +=  uColor * distCenterY * distCenterX * 0.5;
    vec2 adjUv = vec2((vUv.x + 0.5) * 0.75, (vUv.y + 0.5) * 0.3);
    vec4 tex = texture(uTexture, vec2(adjUv.x, adjUv.y + uTime * 0.1));
    float ss = smoothstep(0.1, 0.9, lineColor.r);
    ss *= smoothstep(0.0, 0.1, (vUv.x + 0.5));
    ss *= smoothstep(1.0, 0.9, (vUv.x + 0.5));
    ss *= smoothstep(0.0, 0.1, (vUv.y + 0.5));
    ss *= smoothstep(0.8, 0.4, (vUv.y + 0.5));

    //gl_FragColor = vec4(radCenter, 0.0, 0.0, 1.0);
    //gl_FragColor = tex * ss * 7. + vec4(vUv, 0.0, 1.0);
    gl_FragColor = vec4(lineColor, ss);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
