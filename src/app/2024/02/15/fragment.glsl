#define pi 3.14159265
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColor;
uniform sampler2D uTexture;
varying vec3 vPosition;
varying vec2 vUv;

float sdSphere( vec3 p, float s ){
    return length(p)-s;
}

float map(vec3 p) {
    vec3 spherePos = vec3(sin(uTime) * 0.5, 0., 0.);
    return sdSphere(p - spherePos, 1.);
}

// #rotatingCube
void main(){
    vec4 color = texture(uTexture, vUv);

    vec3 ro = vPosition;
    vec3 rd = normalize(vec3(vUv, 1));

    float t = 0.;
    int i;
    float d;

    for (int i = 0; i < 80; i++) {
        vec3 p = ro + rd * t;

        d = map(p);

        t += d;

        if (d < .001) break;
        if (t > 100.) break;
    }

    vec3 col = vec3(t * .2);

    gl_FragColor = color * vec4(col, d);
}
