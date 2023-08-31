import { Injectable } from '@angular/core';
import {
  ACESFilmicToneMapping,
  Clock,
  Color,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

@Injectable()
export class ThreeService {

  scene!: Scene;
  renderer!: WebGLRenderer;
  camera!: PerspectiveCamera;
  clock!: Clock;
  orbit_controls!: OrbitControls;
  domWidth: number = window.innerWidth;
  domHeight: number = window.innerHeight;

  constructor() { }

  init() {
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({ antialias: true });
    this.camera = new PerspectiveCamera();
    this.clock = new Clock();
    this.orbit_controls = new OrbitControls(this.camera, this.renderer.domElement);

    this._initScene();
    this._initCamera();
    this._initRenderer();
    this._initResponsiveResize();

    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera);
    });

    return { scene: this.scene, camera: this.camera, renderer: this.renderer, orbit_controls: this.orbit_controls, clock: this.clock }
  }

  private _initScene() {
    this.scene.background = new Color(0x000000);
  }

  private _initCamera() {
    this.camera.fov = 55;
    this.camera.aspect = this.domWidth / this.domHeight;
    this.camera.near = 0.1;
    this.camera.far = 1000;
    this.camera.position.set(3, 3, 3);
    this.camera.updateProjectionMatrix();
  }

  private _initRenderer() {
    this.renderer.shadowMap.enabled = true;
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.setSize(this.domWidth, this.domHeight);
    // this.renderer.domElement.style.position = "absolute";
    // this.renderer.domElement.style.zIndex = "1";
    // this.renderer.domElement.style.top = "0px";
    // document.getElementById("cube-container")?.appendChild(this.renderer.domElement);
  }

  private _initResponsiveResize() {
    window.addEventListener("resize", () => {
      this.camera.aspect = this.domWidth / this.domHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.domWidth, this.domHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
    });
  }
}
