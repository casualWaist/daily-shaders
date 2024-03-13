uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
varying vec2 vPoint;

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
    return color * intensity * (shading + specular) * max(0.0, (1.0 - distance * decay));
}

void main(){

    vec3 viewDirection = normalize(vPosition - uRayOrigin);
    vec3 normal = normalize(vNormal);

    vec3 color = vec3(0.0);
    color += ambientLight(vec3(1.0), 0.1);
    color += directionalLight(vec3(1.0), 0.8, normal, vPosition, vec3(1.0, 1.0, 2.0), vec3(-1.0, -0.5, 0.1), 32.0);
    color += pointLight(vec3(1.0), 20.0, normal, vPosition, vec3(vPoint.x, vPoint.y, 0.25), -viewDirection, 2.0, 0.25);

    gl_FragColor = vec4(color * max(uColor * vec3(vPoint * 0.125, color.b), 0.05), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
