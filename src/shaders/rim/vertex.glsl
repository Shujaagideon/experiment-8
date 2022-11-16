varying vec2 vUv;
varying vec3 vPosition;
varying mat4 vModelMatrix;


void main(){
    vUv = uv;
    vPosition = position;
    vModelMatrix = modelMatrix;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}