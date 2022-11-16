uniform sampler2D tDiffuse;
uniform float v;
uniform float factor;

varying vec2 vUv;

#include <common>

void main() {

    vec4 sum = vec4( 0.0 );

    sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * v, vUv.y - 4.0 * v ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * v, vUv.y - 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * v, vUv.y - 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * v, vUv.y - 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * v, vUv.y + 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * v, vUv.y + 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * v, vUv.y + 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * v, vUv.y + 4.0 * v ) ) * 0.051;

    vec4 color = texture2D(tDiffuse, vUv);

    float l = linearToRelativeLuminance( color.rgb );

    vec4 luminance = vec4( l, l, l, color.w );
    vec4 final = (color + sum) * factor;
    gl_FragColor = final;
}