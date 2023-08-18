//fragmentShader
precision highp float;
uniform vec3 scanColor;
varying vec2 vUv;
uniform float uTime;
uniform vec3 uSize;
varying vec3 vPosition;
varying vec3 vNormal;
void main(){
    
    float y=(vPosition.y/uSize.y)+.5;
    float color=sin(-vUv.y+uTime*.1)*1.;
    color=mod(color,1.);
    color=step(.02,color);
    if(y<.01||y>.99){
        color=1.;
    }
    float alpha=1.-sin(vUv.y)*.7;
    
    vec3 lightDirection=normalize(vec3(.5,.7,-.5));// 光源方向
    float lightIntensity=max(dot(vNormal,lightDirection),0.);// 光照强度
    vec3 lightColor=vec3(1.,1.,1.);// 光源颜色
    vec3 finalColor=vec3(color,1.,color)*lightColor*lightIntensity;
    gl_FragColor=vec4(finalColor,alpha);
}