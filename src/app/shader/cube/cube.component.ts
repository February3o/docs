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
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.less']
})
export class CubeComponent implements OnInit {

  scene!: Scene;
  renderer!: WebGLRenderer;
  camera!: PerspectiveCamera;
  clock!: Clock;
  orbit_controls!: OrbitControls;

  vertexShader: string = `
                          //vertexShader
                          precision lowp float;
                          varying vec2 vUv;
                          varying vec3 vPosition;
                          uniform float uTime;
                          varying vec3 vNormal;
                          void main() {
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                            vUv = uv;
                            vPosition = position;
                            vNormal = normalize(normalMatrix * normal);
                        }`;
  fragmentShader: string = `
                        //fragmentShader
                        precision lowp float;
                        uniform vec3 scanColor;
                        varying vec2 vUv;
                        uniform float uTime;
                        uniform vec3 uSize;
                        varying vec3 vPosition;
                        varying vec3 vNormal;
                        void main() {
                          
                          float y = (vPosition.y / uSize.y) + 0.5;
                          float color = sin(-vUv.y + uTime * 0.3);
                          color = mod(color, 1.0);
                          color = step(0.02, color);
                          if(y < 0.01 || y > 0.99) 
                          color = 1.0;
                          float alpha = 1.0 - sin(vUv.y) * 0.7;

                          vec3 lightDirection = normalize(vec3(0.9, 1.0, 0.8)); // 光源方向
                          float lightIntensity = max(dot(vNormal, lightDirection), 0.0); // 光照强度
                          vec3 lightColor = vec3(1.0, 1.0, 1.0); // 光源颜色

                          vec3 finalColor = vec3(color, 1.0, color) * lightColor * lightIntensity;
                          gl_FragColor = vec4(finalColor, alpha);
                          
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
    this.scene.add(axis);

    const planeGeometry = new PlaneGeometry(5, 5);
    const planeMaterial = new MeshLambertMaterial({ color: 0xffffff, side: DoubleSide });
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);
    plane.receiveShadow = true;

    for (let i = 0; i < 18; i++) {
      const step = 1;
      const height = Number(Math.random() * step).toFixed(2)
      const cubeGeometry = new BoxGeometry(Math.random() * step, Number(height), Math.random() * step);
      // const cubeMaterial = new MeshStandardMaterial({ color: 0x00ff00, });
      cubeGeometry.computeBoundingBox();

      const { max, min } = <Box3>cubeGeometry.boundingBox;
      const size = new Vector3(
        max.x - min.x,
        max.y - min.y,
        max.z - min.z
      );
      const cubeMaterial = new ShaderMaterial({
        uniforms: {
          uOpacity: {
            value: 50
          },
          uTime: {
            value: 0.1
          },
          uSize: {
            value: size
          },
          scanColor: { value: new Color(0x00ff00) }  // 扫描颜色
        },
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader,
      })
      const cubeMesh = new Mesh(cubeGeometry, cubeMaterial);
      cubeMesh.position.set(Math.random() * 2, Number(height) / 2, Math.random() * 2);
      cubeMesh.castShadow = true;
      cubeMesh.name = "box";
      this.scene.add(cubeMesh);
    }



    const light = new DirectionalLight(0xffffff);
    const lightHelper = new DirectionalLightHelper(light, 0.2);
    light.position.set(-3, 2, -1);
    light.target = plane;
    light.castShadow = true;
    this.renderer.shadowMap.enabled = true;
    this.scene.add(plane, light, lightHelper);
    this.renderer.setAnimationLoop(this.animation.bind(this));

  }

  animation() {
    this.scene.traverse(function (object: any) {
      if (object.name === 'box') {

        object.material.uniforms.uTime.value += 0.02

      }
    });
    this.renderer.render(this.scene, this.camera);
  }


}
