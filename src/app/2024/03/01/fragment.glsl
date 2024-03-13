uniform vec2 uResolution;
uniform float uTime;
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

    vec3 viewDir = normalize(vPosition - uRayOrigin);
    vec3 light = vec3(0.0);
    light += ambientLight(vec3(1.0), 0.01);
    light += directionalLight(vec3(0.1, 0.1, 1.0), 2.0, normalize(vNormal), vPosition, vec3(2.0, 0.0, 1.0), viewDir, 3.0);
    light += pointLight(vec3(0.1, 0.1, 1.0), 1.0, normalize(vNormal), vPosition, vec3(-2.0, 0.0, 1.0), viewDir, 3.0, 0.75);
    gl_FragColor = vec4(uColor * light, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
