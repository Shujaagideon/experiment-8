#include <common>
#include <packing>
#include <fog_pars_fragment>

varying vec2 vUv;
uniform sampler2D tDepth;
uniform sampler2D tDudv;
uniform sampler2D map;
uniform vec3 waterColor;
uniform vec3 foamColor;
uniform float cameraNear;
uniform float cameraFar;
uniform float time;
uniform float threshold;
uniform vec2 resolution;

float getDepth( const in vec2 screenPosition ) {
    #if DEPTH_PACKING == 1
        return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );
    #else
        return texture2D( tDepth, screenPosition ).x;
    #endif
}

float getViewZ( const in float depth ) {
    return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );
}

void main() {

    vec2 screenUV = gl_FragCoord.xy / resolution;

    float fragmentLinearEyeDepth = getViewZ( gl_FragCoord.z );
    float linearEyeDepth = getViewZ( getDepth( screenUV ) );

    float diff = saturate( fragmentLinearEyeDepth - linearEyeDepth );

    vec2 displacement = texture2D( tDudv, ( vUv * 2.0 ) - time * 0.005 ).rg;
    displacement = ( ( displacement * 2.0 ) - 1.0 ) * 1.0;
    // diff /= displacement.x;
    diff *= displacement.y;

    vec3 gColor = mix( foamColor, waterColor, step( threshold, diff ) );
    // gl_FragColor.a = 0.5;
    vec3 color = texture2D( map,
        vUv * 100.0 +
        0.5*vec2(
        cos(time*0.001*0.1),
        sin(time*0.001*0.1)
        ) +
        0.02*vec2(
        cos(time*0.0012+3.2*100.0*vUv.x),
        sin(time*0.001+3.0*100.0*vUv.y)
        )
    ).rgb;
    vec3 color2 = texture2D( map,
        vUv * 130.0 +
        0.8*vec2(
        cos(time*0.001*0.1),
        sin(time*0.001*0.1)
        ) +
        0.01*vec2(
        cos(1.7 + time*0.0012+3.2*100.0*vUv.x),
        sin(1.7 + time*0.001+3.0*100.0*vUv.y)
        )
    ).rgb;
    gl_FragColor.rgb = mix(waterColor * clamp(1.0 - color2, 0.9, 1.0), foamColor, color.r)*-0.3 + gColor;

    gl_FragColor.a = 1.;
    #include <tonemapping_fragment>
    #include <encodings_fragment>
    #include <fog_fragment>
}

    // gl_FragColor = vec4(0.1451, 0.3059, 0.3961, 1.0);