//vertexShader
precision highp float;
varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
varying vec3 vNormal;
void main(){
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
    vUv=uv;
    vPosition=position;
    vNormal=normalize(normalMatrix*normal);
}