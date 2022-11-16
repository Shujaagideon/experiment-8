#include <fog_pars_vertex>

varying vec2 vUv;
uniform float time;

void main() {
    vUv = uv;

    #include <begin_vertex>

    // transformed = normalize(transformed);
    float t = time;
    transformed.z += .08 * (
        cos(0.5*t+100.0*vUv.x) + sin(0.5*t+100.0*vUv.y)
    );

    #include <project_vertex>
    #include <fog_vertex>
}