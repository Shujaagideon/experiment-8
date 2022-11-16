uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;


void main(){
    vUv = uv;
    vPosition = position;
    vNormal = normal;

    vec3 pos = position;
    // pos.y += 0.1 * (sin(pos.y * 20. + time) * 0.5+ 0.5);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}