import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-nomi',
  templateUrl: './nomi.component.html',
  styleUrls: ['./nomi.component.less']
})
export class NomiComponent implements OnInit {
  title = 'Nomi';
  domWidth: number = window.innerWidth - 20;
  domHeight: number = 150;

  ngOnInit(): void {
    this.init();
  }

  init() {
    // init

    const camera = new THREE.PerspectiveCamera(70, this.domWidth / this.domHeight, 0.01, 10);
    camera.position.z = 1;

    const scene = new THREE.Scene();

    // const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    // const material = new THREE.MeshNormalMaterial();

    // const mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);
    // const light = new THREE.AmbientLight(0xdeedff, 1.5)
    // scene.add(light)



    const planeGeometry = new THREE.PlaneGeometry(6, 6, 1);
    const planeMateria = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: {
          value: 50
        },
        uTime: {
          value: 0.1
        }
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vUv = uv;
        }`,
      fragmentShader: `
        #define PI 3.1415926535897932384626433832795
        varying vec2 vUv;
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy,vec2(12.9898,78.233))) * 43758.5453123);
        }

        vec2 rotate(vec2 uv, float rotation, vec2 mid) {
          return vec2(
            cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
            cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
          );
        }

        vec2 fade(vec2 t) {
          return t*t*t*(t*(t*6.0-15.0)+10.0);
        }

        vec4 permute(vec4 x) {
          return mod(((x*34.0)+1.0)*x, 289.0);
        }

        float cnoise(vec2 P) {
          vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
          vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
          Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
          vec4 ix = Pi.xzxz;
          vec4 iy = Pi.yyww;
          vec4 fx = Pf.xzxz;
          vec4 fy = Pf.yyww;
          vec4 i = permute(permute(ix) + iy);
          vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
          vec4 gy = abs(gx) - 0.5;
          vec4 tx = floor(gx + 0.5);
          gx = gx - tx;
          vec2 g00 = vec2(gx.x,gy.x);
          vec2 g10 = vec2(gx.y,gy.y);
          vec2 g01 = vec2(gx.z,gy.z);
          vec2 g11 = vec2(gx.w,gy.w);
          vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
          g00 *= norm.x;
          g01 *= norm.y;
          g10 *= norm.z;
          g11 *= norm.w;
          float n00 = dot(g00, vec2(fx.x, fy.x));
          float n10 = dot(g10, vec2(fx.y, fy.y));
          float n01 = dot(g01, vec2(fx.z, fy.z));
          float n11 = dot(g11, vec2(fx.w, fy.w));
          vec2 fade_xy = fade(Pf.xy);
          vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
          float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
          return 2.3 * n_xy;
        }

        uniform float uOpacity;
        uniform float uTime;
        void main() {
          // float barX = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
          // float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0 - 0.2, 1.0));
          // float strength = barX + barY;

          // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
          // strength *= 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

          // float strength = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;

          // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y + vUv.x) * 10.0) / 10.0);
          // float strength = random(gridUv); 

        //  float strength = 0.015 / distance(vUv, vec2(0.5)); //光晕效果

            vec2 rotatedUv = rotate(vUv, PI*0.25, vec2(0.5));
            float animation = mix(0.005, 0.05, (sin(uTime) + 1.0) * 0.5);
            float strength = animation / distance(vec2(rotatedUv.x,(rotatedUv.y - 0.5)*5.0 + 0.5), vec2(0.5));
            strength *= animation / distance(vec2(rotatedUv.y,(rotatedUv.x - 0.5)*5.0 + 0.5), vec2(0.5));


          //  vec2 waveUv = vec2(vUv.x + sin(vUv.y * 30.0) * 0.1, vUv.y + sin(vUv.x * 30.0) * 0.1);
          // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25)); //波浪效果

          // float angle = atan(vUv.x - 0.5,vUv.y - 0.5)/(PI * 2.0) + 0.5;
          // float strength = mod(angle * 20.0, 1.0);

          // float strength = step(0.9,sin(cnoise(vUv*uOpacity) * 30.0));
          // vec3 blackColor = vec3(0.0);
          // vec3 uvColor = vec3(vUv, 0.2);
          // vec3 mixColor = mix(blackColor, uvColor, strength);

          gl_FragColor = vec4(vec3(strength * vec3(0.5, 0.7, 0.9)), 1.0);
        }
      `,
      side: THREE.DoubleSide,

    })

    const plane = new THREE.Mesh(planeGeometry, planeMateria)

    scene.add(plane)


    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color(0xffffff));
    renderer.setSize(this.domWidth, this.domHeight);
    renderer.setAnimationLoop(animation);
    const dom = document.getElementById('nomi-container')?.appendChild(renderer.domElement);

    // animation

    function animation(time: any) {

      planeMateria.uniforms['uTime'].value += 0.02;
      renderer.render(scene, camera);

    }
  }

}
