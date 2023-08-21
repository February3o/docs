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
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
// import vertexShader from '!!raw-loader!../glsl/cube-glsl/vertexShader.glsl';
const meshName = "CITY_UNTRIANGULATED";

@Component({
  selector: 'app-shanghai',
  templateUrl: './shanghai.component.html',
  styleUrls: ['./shanghai.component.less']
})
export class ShanghaiComponent implements OnInit {

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
                        #define PI 3.1415926535897932384626433832795
                        precision lowp float;
                        uniform vec3 scanColor;
                        varying vec2 vUv;
                        uniform float uTime;
                        uniform vec3 uSize;
                        varying vec3 vPosition;
                        varying vec3 vNormal;
                        void main() {
                          float dTime = mod(uTime * 25.0, uSize.z); 
                          vec3 distColor = vec3(0.5, 0.5, 0.5);
                            float topY = vPosition.z + 10.0;
                            if (dTime > vPosition.z && dTime < topY) {
                                
                                float dIndex = sin((topY - dTime) / 10.0 * PI);

                                distColor = mix(distColor, scanColor,  dIndex); 
                            }
                          
                          gl_FragColor = vec4(vec3(distColor), 1.0);
                          
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
    const axis = new AxesHelper(2000);
    this.scene.add(axis);

    const planeGeometry = new PlaneGeometry(5, 5);
    const planeMaterial = new MeshLambertMaterial({ color: 0xffffff, side: DoubleSide });
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);
    plane.receiveShadow = true;

    const light = new DirectionalLight(0xffffff);
    const lightHelper = new DirectionalLightHelper(light, 0.2);
    light.position.set(1000, 1000, 1000);
    light.target = plane;
    light.castShadow = true;
    this.renderer.shadowMap.enabled = true;
    this.scene.add(light);
    const loader = new FBXLoader()
    this.camera.far = 10000;
    this.camera.position.set(1500, 800, 2000);
    this.camera.updateProjectionMatrix();
    loader.load('assets/model/shanghai.FBX', (scene) => { //
      this.scene.add(scene);
      scene.traverse(child => {
        if (child.name === meshName) {
          this.setMaterial(child)
        }
      })
    })
    document.getElementById("shanghai-container")?.appendChild(this.renderer.domElement);
    this.renderer.setAnimationLoop(this.animation.bind(this));


  }

  setMaterial(mesh: any) {
    mesh.geometry.computeBoundingBox();
    mesh.geometry.computeBoundingSphere();

    const {
      geometry
    } = mesh;

    // 获取geometry的长宽高 中心点
    const {
      center,
      radius
    } = geometry.boundingSphere;

    const {
      max,
      min
    } = geometry.boundingBox;

    const size = new Vector3(
      max.x - min.x,
      max.y - min.y,
      max.z - min.z
    );

    console.log(size)
    mesh.material = new ShaderMaterial({
      uniforms: {
        uOpacity: {
          value: 1
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

  }

  animation() {
    this.scene.traverse(function (object: any) {
      if (object.name === meshName) {
        object.material.uniforms.uTime.value += 0.02

      }
    });
    this.renderer.render(this.scene, this.camera);
  }

}
