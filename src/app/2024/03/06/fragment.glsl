uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;

vec3 ambientLight(vec3 color, float intensity) {
    return color * intensity;
}

vec3 directionalLight(vec3 color, float intensity, vec3 normal, vec3 position, vec3 lightPos, vec3 viewDir, float specPower) {
    vec3 direction = normalize(lightPos - position);
    vec3 lightReflect = reflect(-direction, normal);
    float shading = dot(normal, direction);
    shading = max(0.0, shading);
    float specular = pow(max(0.0, -dot(lightReflect, viewDir)), specPower);
    return color * intensity * (shading + specular);
}

vec3 pointLight(vec3 color, float intensity, vec3 normal, vec3 position, vec3 lightPos, vec3 viewDir, float specPower, float decay) {
    vec3 lightDelta = lightPos - position;
    vec3 direction = normalize(lightDelta);
    float distance = length(lightDelta);
    vec3 lightReflect = reflect(-direction, normal);
    float shading = dot(normal, direction);
    shading = max(0.0, shading);
    float specular = pow(max(0.0, -dot(lightReflect, viewDir)), specPower);
    return color * intensity * (shading + specular) * max(0.0, (1.0 - distance *  decay));
}

void main(){

    vec3 viewDirection = normalize(vPosition - uRayOrigin);
    vec3 normal = normalize(vNormal);

    vec3 color = vec3(0.0);
    color *= uColor;
    color += ambientLight(vec3(1.0), 1.0);
    color += directionalLight(vec3(1.0), 3.8, normal, vPosition, vec3(1.0, 1.0, 0.0), viewDirection, 32.0);

    vec3 direction = vec3(0.0, -1.0, 0.0);
    float intensity = dot(normal, direction);
    intensity = smoothstep(-0.8, 2.5, intensity);
    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv *= 50.0;
    uv = mod(uv, 1.0);
    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5 * intensity, point);

    //gl_FragColor = vec4(mix(color, vec3(0.2, 0.4, 0.7), point), 1.0);
    gl_FragColor = vec4(uColor * color - point * 0.375, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
