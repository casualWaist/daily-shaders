uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudsTexture;
uniform vec3 uSunDirection;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

float random2D(vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

void main(){

    float strips = mod((vPosition.y - uTime * 0.1) * 8., 1.0);
    strips = pow(strips, 3.0);

    // highlight edges
    vec3 viewDir = normalize(vPosition - cameraPosition);
    vec3 normNormal = normalize(vNormal);

    // flip the normal if the face is backfacing
    if (!gl_FrontFacing) {
        normNormal *= -1.;
    }
    float frensel = dot(viewDir, normNormal) + 1.;

    float falloff = smoothstep(0.8, 0.0, frensel);
    float holographic = strips * frensel * 2.5;
    holographic *= falloff;

    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    // Sun orientation
    float sunOrientation = dot(uSunDirection, normal);

    // Day / night color
    float dayMix = smoothstep(- 0.25, 0.5, sunOrientation);
    vec3 dayColor = texture(uDayTexture, vUv).rgb;
    vec3 nightColor = texture(uNightTexture, vUv).rgb;
    color = mix(nightColor, dayColor, dayMix);

    // Specular cloud color
    vec2 specularCloudsColor = texture(uSpecularCloudsTexture, vUv).rg;

    // Clouds
    float cloudsMix = smoothstep(0.05, 1.0, specularCloudsColor.g);
    cloudsMix *= dayMix;
    color = mix(color, vec3(1.0), cloudsMix);

    // Fresnel
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 3.0);

    // Atmosphere
    float atmosphereDayMix = smoothstep(- 0.5, 1.0, sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
    color = mix(color, vec3(holographic), fresnel * atmosphereDayMix);
    //color.b = min(holographic, color.b);

    // Final color
    gl_FragColor = vec4(color, 0.5 + mix(0.3, 0.9, holographic * random2D(vec2(uTime, 37.0))) * dayColor * color.b * strips);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
