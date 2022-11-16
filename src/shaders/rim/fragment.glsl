#include <output_fragment>


vec3 pos = vPosition;
vec3 normal = normalize(pos.xyz);
vec3 worldNormal = normalize(mat3(vModelMatrix) * normal.xyz);
vec3 worldPosition = (vModelMatrix * vec4(pos, 1.)).xyz;
vec3 V = normalize(cameraPosition - worldPosition);
float rim = 1. - max(dot(V, worldNormal), 0.);

rim = pow(smoothstep(0., 1., rim), 0.5);
vec4 color = texture2D(tDiffuse, vUv);

color += rim * 0.2;

gl_FragColor = color;