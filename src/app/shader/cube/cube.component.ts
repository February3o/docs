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
      const height = Number(Math.random() * 2).toFixed(2)
      const cubeGeometry = new BoxGeometry(Math.random() * 2, Number(height), Math.random() * 2);
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
        vertexShader:
          `varying vec2 vUv;
          varying vec3 vPosition;
          uniform float uTime;
          void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vUv = uv;
            vPosition = position;
        }`,
        fragmentShader: `
        //fragmentShader
          uniform vec3 scanColor;
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uSize;
          varying vec3 vPosition;
          void main() {
            

            // 计算当前片段所在的垂直位置（0.0到1.0）
            float verticalPosition = vPosition.y / uSize.y;
            
            // 根据时间和垂直位置计算扫描动画的偏移量
            float scanOffset =sin((uTime*0.4 - verticalPosition) *10.0);
            
            // 根据偏移量将扫描线限制在0.0到1.0之间
            float sacnWidth = 1.0;
            float scanLine = clamp(scanOffset, 0.0, sacnWidth);
            
            // 根据扫描线位置和指定的颜色进行颜色混合
            vec3 finalColor = mix(vec3(1.0), scanColor, scanLine / sacnWidth);
            
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,
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
