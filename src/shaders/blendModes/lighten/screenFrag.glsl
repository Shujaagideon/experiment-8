uniform float factor;
uniform sampler2D tDiffuse;
varying vec2 vUv;

void main(){

    vec4 color = texture2D(tDiffuse, vUv);
    vec4 final = 1.0 - (1. - color)*(1. - vec4(0.1451, 0.1765, 0.2549, 1.0) * factor);
    gl_FragColor = final;
}