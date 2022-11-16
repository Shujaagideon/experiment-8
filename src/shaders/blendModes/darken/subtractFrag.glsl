uniform float factor;
uniform sampler2D tDiffuse;
varying vec2 vUv;

void main(){

    vec4 color = texture2D(tDiffuse, vUv);
    
    // gl_FragColor = vec4(0.1882, 0.3373, 0.3451, 1.);
    gl_FragColor = vec4(vec3(color.xyz - (color.xyz * factor)), 1.);
}