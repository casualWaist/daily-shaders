uniform float uTime;
varying vec3 vPosition;
varying vec2 vUv;
varying vec4 vGliphBounds;
varying float vGliphIndex;

void main(){
    vUv = uv;
    vGliphBounds = aTroikaGlyphBounds;
    vGliphIndex = aTroikaGlyphIndex;

    vec4 viewPosition = viewMatrix * vec4(position.x, position.y * mod(vGliphIndex, sin(uTime * 0.1) + 1.0), position.z, 1.0);
    vec4 projectedPosition = projectionMatrix * viewPosition;
    vPosition = projectedPosition.xyz;
    gl_Position = projectedPosition;

}
