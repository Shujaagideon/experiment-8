uniform float factor;
uniform sampler2D tDiffuse;
varying vec2 vUv;

void main(){

    vec4 color = texture2D(tDiffuse, vUv);

    vec3 burn = color.xyz/(1. - color.xyz);
    // vec3 burn = 1.0 - (1.0 - color.xyz)/color.xyz * factor;
    gl_FragColor = vec4(burn * factor , 1.);
}