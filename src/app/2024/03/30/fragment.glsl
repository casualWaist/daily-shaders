uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform vec3 uCameraPos;
uniform vec2 uResolution;

varying float vElevation;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

vec3 directionalLight(vec3 color, float intensity, vec3 normal, vec3 position, vec3 lightPos, vec3 viewDir, float specPower) {
    vec3 direction = normalize(lightPos - position);
    vec3 lightReflect = reflect(-direction, normal);
    float shading = dot(normal, direction);
    shading = max(0.0, shading);
    float specular = pow(max(0.0, -dot(lightReflect, viewDir)), specPower);
    return color * intensity * (shading + specular);
}

void main(){
    vec2 pos = normalize((vUv - 0.5) * uResolution);
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = uDepthColor;
    color *= directionalLight(color, 0.125, vNormal, vPosition, vec3(-1.0, 4.0, 1.0), uCameraPos, 2.0);

    gl_FragColor = vec4(color, 1.0);
}
