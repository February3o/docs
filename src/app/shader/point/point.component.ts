import { Component, OnInit } from '@angular/core';
import { ThreeService } from 'src/app/service/three.service';
import {
  Clock,
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  BoxGeometry,
  MeshNormalMaterial,
  Mesh,
  Points,
  DirectionalLight,
  PlaneGeometry,
  MeshBasicMaterial,
  DoubleSide,
  AxesHelper,
  DirectionalLightHelper,
  Object3D,
  MeshLambertMaterial,
  MeshStandardMaterial,
  ShaderMaterial,
  Box3,
  Vector3,
  SphereGeometry,
  PointsMaterial,
  IcosahedronGeometry,
  Sphere,
  BufferGeometry,
  BufferAttribute,
  Float32BufferAttribute,
  AdditiveBlending,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import vertexShader from '!!raw-loader!../glsl/cube-glsl/vertexShader.glsl';

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.less']
})
export class PointComponent implements OnInit {

  scene!: Scene;
  renderer!: WebGLRenderer;
  camera!: PerspectiveCamera;
  clock!: Clock;
  orbit_controls!: OrbitControls;

  vertexShader: string = `
                          //vertexShader
                          precision lowp float;
                          varying vec2 vUv;
                          uniform float uTime;
                          varying vec3 vColor;
                          attribute vec4 aShift;
                          const float PI = 3.1415925;
                          void main() {
                            vec3 color1 = vec3(227., 155., 0.);
                            vec3 color2 = vec3(100., 50., 255.);
                            float d  = abs(position.y) / 10.0;
                            vColor = mix(color2, color1, d) / 255.;
                            vUv = uv;

                            vec3 transformed = position;
                            float theta = mod(aShift.x + aShift.z * uTime, PI * 2.);
                            float phi = mod(aShift.y +aShift.z * uTime, PI * 2.);
                            transformed += vec3(sin(phi) * cos(theta), cos(phi), sin(phi) * sin(theta)) * aShift.w;

                            vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
                            gl_PointSize = 50.0 / -mvPosition.z;
                            gl_Position = projectionMatrix * mvPosition;
                        }`;
  fragmentShader: string = `
                        //fragmentShader
                        precision lowp float;
                        varying vec2 vUv;
                        varying vec3 vColor;
                        void main() {
                          float r = length(gl_PointCoord - 0.5);
                          if(r > 0.5) discard;
                          gl_FragColor = vec4(vColor, smoothstep(0.5, 0.1, r));
                        }
                      `

  constructor(private threeService: ThreeService) { }

  ngOnInit(): void {
    const { scene, camera, renderer, orbit_controls, clock } = this.threeService.init();
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.orbit_controls = orbit_controls;
    this.clock = clock;
    this.updaetScene();
    this.renderer.render(this.scene, this.camera);
    this.orbit_controls.update()


  }

  updaetScene() {
    const axis = new AxesHelper(30);
    // this.scene.add(axis);

    const planeGeometry = new PlaneGeometry(5, 5);
    const planeMaterial = new MeshLambertMaterial({ color: 0xffffff});
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);
    plane.receiveShadow = true;

    const sphereGeometry = new IcosahedronGeometry(4, 6);
    const sphereMaterial = new PointsMaterial({color: 0xffffff, size: 0.05})
    const buffGeometry = new BufferGeometry();
    const positions = [];
    const shifts = [];
    const radius = 10;
    const count1 = 10000;
    const count2 = 50000 * 2;
    for(let i = 0; i < count1 + count2; i++ ) {
      // const angle = 2 * Math.PI*Math.random();
      // const x = Math.sin(angle) * radius * Math.random();

      // const y = Math.cos(angle) * radius * Math.random();

      let theta = Math.random() * Math.PI * 2;
      let phi = Math.acos((Math.random()*2 - 1));
      let angle = (Math.random() * 0.9 + 0.1)* Math.PI * 0.1;
      let strength = Math.random() * 0.9 + 0.1;
      shifts.push(theta, phi, angle, strength);
      if(i < count1) {
        const {x, y, z} = new Vector3().randomDirection().multiplyScalar(Math.random() * 0.5 + 9.5);
        positions.push(x, y, z)
      }else {
        const r = 10;
        const R = 40;
        const rand = Math.pow(Math.random(), 1.5);
        const rdis = Math.sqrt(R * R * rand + (1 - rand) * r * r);
        const {x , y, z } = new Vector3().setFromCylindricalCoords(rdis, Math.random() * 2 * Math.PI, (Math.random() - 0.5) * 2);
        positions.push(x, y, z);
      }

    }
    buffGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    buffGeometry.setAttribute('aShift', new Float32BufferAttribute(shifts, 4));
    const shaderMaterial = new ShaderMaterial({
      uniforms: {
        uTime: {value: 0}
      },
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      depthTest: false,
      transparent: true,
      blending: AdditiveBlending,
    })
    const sphereMesh = new Points(buffGeometry, shaderMaterial);
    sphereMesh.name = 'sphere';

    this.scene.add(sphereMesh);

    const light = new DirectionalLight(0xffffff);
    const lightHelper = new DirectionalLightHelper(light, 0.2);
    light.position.set(-3, 2, -1);
    light.target = plane;
    light.castShadow = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.capabilities.logarithmicDepthBuffer = false;
    // this.scene.add( light, lightHelper);
    this.camera.position.set(10,10,10)
    document.getElementById("point-container")?.appendChild(this.renderer.domElement);
    this.renderer.setAnimationLoop(this.animation.bind(this));

  }

  animation() {
    this.scene.traverse((object: any) => {
      if (object.name === 'box') {
        object.material.uniforms.uTime.value += 0.02

      }
      if (object.name === 'sphere') {
        object.material.uniforms.uTime.value += 0.02
        object.rotation.y += 0.0005

      }
    });
    this.renderer.render(this.scene, this.camera);
  }

  //写一个排序算法



}
