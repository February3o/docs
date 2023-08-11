import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { MarkdownService } from "ngx-markdown"
@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.less']
})
export class StarComponent implements OnInit {
  constructor(private markdownService: MarkdownService) {

  }
  title = 'star';
  domWidth: number = window.innerWidth - 20;
  domHeight: number = 150;

  vertexShader: string = `
        //vertexShader
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vUv = uv;
        }`;
  fragmentShader: string = `
        //fragmentShader
        #define PI 3.1415926535897932384626433832795
        varying vec2 vUv;
        vec2 rotate(vec2 uv, float rotation, vec2 mid) {
          return vec2(
            cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
            cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
          );
        }
        uniform float uTime;
        void main() {
            vec2 rotatedUv = rotate(vUv, PI*0.25, vec2(0.5));
            float animation = mix(0.005, 0.05, (sin(uTime) + 1.0) * 0.5);
            float strength = animation / distance(vec2(rotatedUv.x,(rotatedUv.y - 0.5)*5.0 + 0.5), vec2(0.5));
            strength *= animation / distance(vec2(rotatedUv.y,(rotatedUv.x - 0.5)*5.0 + 0.5), vec2(0.5));
            vec3 adjustedColor = vec3(0.5, 0.7, 0.9);
            gl_FragColor = vec4(vec3(adjustedColor * strength ), 1.0);
        }`

  // links = require('@/src/assets/markdown/test.md').default;
  myValue = `print('hello-world')`;

  ngOnInit(): void {
    this.init();
    console.log(this.markdownService.compile('I am using __markdown__.'));
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
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      side: THREE.DoubleSide,

    })

    const plane = new THREE.Mesh(planeGeometry, planeMateria)

    scene.add(plane)


    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color(0xffffff));
    renderer.setSize(this.domWidth, this.domHeight);
    renderer.setAnimationLoop(animation);
    const dom = document.getElementById('star-container')?.appendChild(renderer.domElement);

    // animation

    function animation(time: any) {

      planeMateria.uniforms['uTime'].value += 0.02;
      renderer.render(scene, camera);

    }
  }

  onLoad(): void {
    // this.stripContent();
    // this.setHeadings();
  }

}
