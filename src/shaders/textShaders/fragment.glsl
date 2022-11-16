uniform float time;
uniform float progress;
uniform float opacity;
uniform vec2 mouse;
uniform vec4 resolution;
uniform sampler2D uTexture;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d);
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d);


float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}


void main(){
    float noise = snoise4(vec4(vPosition* 0.5, time*0.2));
    vec4 image = texture2D(uTexture, vUv);

    float dist = distance(vUv, mouse);
    vec2 dir = normalize(vUv - mouse);

    float prox = 1. - map(dist, 0., 0.3, 0., 1.);

    vec2 newUv = vUv + prox*0.006 * dir + noise*progress;
    vec4 col = texture2D(uTexture, newUv);
    // col.rgb -= 0.8;
    // if(col.r < 0.2)discard;

    // gl_FragColor = vec4(0.0667, 0.1294, 0.1333, 1.0);
    gl_FragColor = image;
    gl_FragColor = col;
    gl_FragColor.w = opacity;
}