uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

#pragma glslify: snoise4 = require(glsl-noise/simplex/4d);

void main(){
    vUv = uv;
    vPosition = position;
    vNormal = normal;

    float noise = snoise4(vec4(position* 3., time* 0.2)) * 3.5;
    vec3 pos = position + noise;
    // pos.y += 0.1 * (sin(pos.y * 20. + time) * 0.5+ 0.5);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}