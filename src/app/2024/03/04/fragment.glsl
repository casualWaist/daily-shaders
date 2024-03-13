uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec3 uRayOrigin;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;

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
    float tex = texture2D(uTexture, gl_PointCoord).r;
    float dist = distance(vPosition, uRayOrigin) * 0.5;
    light += pointLight(vec3(1., 1., 1.), 11.0, normalize(vNormal), vPosition, vec3(0.0, sin(uTime) * 4.0, cos(uTime) * 4.0), viewDir, 13.0, 0.25);
    light += pointLight(vec3(1., 1., 1.), 11.0, normalize(vNormal), vPosition, vec3(cos(uTime) * 4.0, 2.0, sin(uTime) * 4.0), viewDir, 13.5, 0.25);
    gl_FragColor = vec4(uColor * dist, tex * dist * light);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
