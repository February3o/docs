import { Component, OnInit } from '@angular/core';
import { ThreeService } from 'src/app/service/three.service';
import {
  Clock,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  MeshBasicMaterial,
  Vector3,
  SphereGeometry,
  TextureLoader,
  BackSide,
  AmbientLight,
  Fog,
  Vector2
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Easing, Tween, update } from "three/examples/jsm/libs/tween.module.js"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';



@Component({
  selector: 'app-gltf',
  templateUrl: './gltf.component.html',
  styleUrls: ['./gltf.component.less']
})
export class GltfComponent implements OnInit {

  scene!: Scene;
  renderer!: WebGLRenderer;
  camera!: PerspectiveCamera;
  clock!: Clock;
  orbit_controls!: OrbitControls;
  composer!: EffectComposer;

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
    this.renderer.setPixelRatio(window.devicePixelRatio);

    window.addEventListener('resize', () => {
      // 更新渲染
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      // 更新相机
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  updaetScene() {

    const gltfLoader = new GLTFLoader();
    gltfLoader.load('assets/model/gltf/road.glb', (gltf) => {
        this.scene.add(gltf.scene)
    })
    gltfLoader.load('assets/model/gltf/building_A.glb', (gltf) => {
      this.scene.add(gltf.scene)
    })
    gltfLoader.load('assets/model/gltf/building_B.glb', (gltf) => {
      this.scene.add(gltf.scene)
    })
    gltfLoader.load('assets/model/gltf/building_C.glb', (gltf) => {
      this.scene.add(gltf.scene)
    })
    gltfLoader.load('assets/model/gltf/building_D.glb', (gltf) => {
      this.scene.add(gltf.scene)
    })
    gltfLoader.load('assets/model/gltf/building_Park.glb', (gltf) => {
      this.scene.add(gltf.scene)
    })
    gltfLoader.load('assets/model/gltf/other_building.glb', (gltf) => {

      const build: any = gltf.scene.getObjectByName("其余建筑003");
      build.position.set(17,0,-30)
      const build2 = build.clone();
      build2.position.set(-17,0,-30)
      const build3 = build.clone();
      build3.position.set(40,0,-30)
      const build4 = build.clone();
      build4.position.set(-40,0,-30)
      gltf.scene.add(build2, build3, build4)
      this.scene.add(gltf.scene)
    })
    gltfLoader.load('assets/model/gltf/tree.glb', (gltf) => {
      this.scene.add(gltf.scene)
    })
    gltfLoader.load('assets/model/gltf/路灯.glb', (gltf) => {
      this.scene.add(gltf.scene)
    })
    gltfLoader.load('assets/model/gltf/车位车辆.glb', (gltf) => {
      this.scene.add(gltf.scene)
      const R = 50
      const tween = new Tween({angle: 0})
      .to({angle: Math.PI*(1-1/4)}, 8000)
      .onUpdate((obj)=> {
          this.camera.position.x = R*Math.cos(obj.angle)
          this.camera.position.z = R*Math.sin(obj.angle)
          this.camera.lookAt(0, 0, 0);
      })
      tween.start();
      this.initBloom()
    })

    //环境光
    const ambient = new AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);


    this.scene.fog = new Fog(0x001122, 10, 600);
    this.camera.position.set(100, 50, 0);
    this.camera.lookAt(new Vector3(0, 0, 0));

    this.orbit_controls.enablePan = false;
    // 缩放限制
    // this.orbit_controls.maxDistance = 10;
    this.camera.updateProjectionMatrix();
    document.getElementById("park")?.appendChild(this.renderer.domElement);
    this.renderer.setAnimationLoop(this.animation.bind(this));


  }

  animation() {
    this.orbit_controls && this.orbit_controls.update();
    update()
    if (this.composer)
      this.composer.render();
    else
      this.renderer.render(this.scene, this.camera);
  }

  initBloom() {
    const renderScene = new RenderPass(this.scene, this.camera);

    const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.6;
    bloomPass.strength = 1.5;
    bloomPass.radius = 0.4;

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);
  }

}
