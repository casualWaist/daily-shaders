uniform float uTime;
uniform float uXorY;

varying float vElevation;
varying vec3 vPosition;
varying vec2 vUv;

void main(){

    float check = vUv.x;
    if (uXorY == 1.0) {
        check = vUv.y;
    }
    if (mod(check, 0.1) > 0.05) { discard;}
}
