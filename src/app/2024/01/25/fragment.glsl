precision highp float;

uniform vec2 resolution;
uniform float time;

void main() {
    // Normalize coordinates to range [-1, 1]
    vec2 normCoord = (gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);

    // Calculate polar coordinates
    float angle = atan(normCoord.y, normCoord.x);
    float radius = length(normCoord);

    // Define ring properties
    float numRings = 5.0; // Adjust the number of rings
    float ringWidth = 0.75; // Adjust the width of each ring
    float speed = 3.0;    // Adjust the speed of the animation

    // Calculate ring pattern
    float ring = mod(floor(radius * time), numRings);
    float ringColor = smoothstep(ringWidth, ringWidth + 0.5, abs(ring + 0.5));

    // Create color based on ring pattern
    vec3 color = vec3(ringColor, 1.0 - ringColor, 0.0 + ringColor);

    // Add animation to the rings
    float pulsation = time * speed;
    color *= pulsation;

    // Output final color
    gl_FragColor = vec4(color, 1.0);
}
