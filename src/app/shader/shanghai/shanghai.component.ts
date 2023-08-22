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
  EdgesGeometry,
  LineSegments,
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
    this.camera.position.set(800, 400, 800);
    this.camera.updateProjectionMatrix();
    loader.load('assets/model/shanghai.FBX', (scene) => { //
      this.scene.add(scene);
      scene.traverse(child => {
        if (child.name === meshName) {
          this.setMaterial(child);
          this.aroundLine(child);
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

  aroundLine(mesh: any) {
    const geometry = new EdgesGeometry(mesh.geometry);
    const worldPosition = new Vector3();
    mesh.getWorldPosition(worldPosition);

    const { max, min } = mesh.geometry.boundingBox;

    const size = new Vector3(
      max.x - min.x,
      max.y - min.y,
      max.z - min.z
    )

    const material = this.lineMaterial({ max, min, size });

    const line = new LineSegments(geometry, material);

    line.name = "aroundLine";
    line.scale.copy(mesh.scale);
    line.rotation.copy(mesh.rotation);
    line.position.copy(worldPosition);

    this.scene.add(line);

  }
  lineShaderMaterial!: ShaderMaterial;

  lineMaterial({
    max,
    min,
    size
  }: any) {
    if (this.lineShaderMaterial) return this.lineShaderMaterial;

    this.lineShaderMaterial = new ShaderMaterial({
      transparent: true,
      uniforms: {
        uColor: {
          value: new Color("#ffffff")
        },
        uActive: {
          value: new Color("#000000")
        },
        uTime: {
          value: 0.1
        },
        uOpacity: {
          value: 0.6
        },
        uMax: {
          value: max,
        },
        uMin: {
          value: min,
        },
        uRange: {
          value: 200
        },
        uSpeed: {
          value: 0.2
        },
        uStartTime: {
          value: 0.1
        }
      },
      // 顶点着色器的GLSL代码。
      vertexShader: `
                    #define PI 3.14159265359

                    uniform mediump float uStartTime;
                    uniform mediump float uTime;
                    uniform mediump float uRange;
                    uniform mediump float uSpeed;
                
                    uniform vec3 uColor;
                    uniform vec3 uActive;
                    uniform vec3 uMin;
                    uniform vec3 uMax;
                
                    varying vec3 vColor;
                
                    float lerp(float x, float y, float t) {
                        return (1.0 - t) * x + t * y;
                    }
                    void main() { 
                        if (uStartTime >= 0.99) {
                            float iTime = mod(uTime * uSpeed - uStartTime, 1.0);
                            float rangeY = lerp(uMin.y, uMax.y, iTime);
                            if (rangeY < position.y && rangeY > position.y - uRange) {
                                float index = 1.0 - sin((position.y - rangeY) / uRange * PI);
                                float r = lerp(uActive.r, uColor.r, index);
                                float g = lerp(uActive.g, uColor.g, index);
                                float b = lerp(uActive.b, uColor.b, index);
                
                                vColor = vec3(r, g, b);
                                // vColor = vec3(0.0, 0.0, 0.0);
                            } else {
                                vColor = uColor;
                            }
                        }
                        vec3 vPosition = vec3(position.x, position.y, position.z * uStartTime);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
                    } 
      `,
      fragmentShader: `
                    precision mediump float;

                    float distanceTo(vec2 src, vec2 dst) {
                        float dx = src.x - dst.x;
                        float dy = src.y - dst.y;
                        float dv = dx * dx + dy * dy;
                        return sqrt(dv);
                    } 
                    
                    float lerp(float x, float y, float t) {
                        return (1.0 - t) * x + t * y;
                    }
                    
                    #define PI 3.14159265359
                    #define PI2 6.28318530718
                    uniform float uTime;
                    uniform float uOpacity;
                    uniform float uStartTime;

                    varying vec3 vColor; 

                    void main() {

                        gl_FragColor = vec4(vColor, uOpacity * uStartTime);
                    }
      `
    });

    return this.lineShaderMaterial;
  }

  animation() {
    // console.log(this.scene);
    this.scene.traverse(function (object: any) {
      if (object.name === meshName) {
        object.material.uniforms.uTime.value += 0.02;
      }
      if (object.name === "aroundLine") {

        if (object.material.uniforms.uStartTime.value < 1.0) {
          object.material.uniforms.uStartTime.value += 0.02;
        }

      }
    });
    this.renderer.render(this.scene, this.camera);
  }

}
