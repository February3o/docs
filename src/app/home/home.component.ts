import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import anime from 'animejs/lib/anime.es.js';
import { AmbientLight, BoxGeometry, Clock, DirectionalLight, DoubleSide, Mesh, MeshBasicMaterial, PerspectiveCamera, SRGBColorSpace, Scene, TextureLoader, Vector3, WebGLRenderer, sRGBEncoding } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThreeService } from '../service/three.service';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Easing, Tween, update } from "three/examples/jsm/libs/tween.module.js"

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  scene!: Scene;
  renderer!: WebGLRenderer;
  camera!: PerspectiveCamera;
  clock!: Clock;
  orbit_controls!: OrbitControls;

  constructor(private threeService: ThreeService) { }

  ngOnInit(): void {
    const { scene , camera, renderer, orbit_controls, clock } = this.threeService.init();
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.orbit_controls = orbit_controls;
    this.clock = clock;

    this.updateScene()
    this.renderer.render(this.scene, this.camera);
    this.orbit_controls.update();
    this.renderer.setClearColor(0xdedede, 1);
    this.renderer.setPixelRatio(window.devicePixelRatio);

  }

  updateScene() {

    const gltfLoader = new GLTFLoader();

    const textureLoader = new TextureLoader();
    const texture = textureLoader.load('assets/model/glb/baked1.jpg')
    texture.flipY = false;
    texture.colorSpace = SRGBColorSpace;
    const material = new MeshBasicMaterial({map: texture, side: DoubleSide})

    const desktop0 = textureLoader.load('assets/model/glb/desktop0.png')
    desktop0.colorSpace = SRGBColorSpace;
    desktop0.offset.y = 0.001;
    const desktopMaterial1 = new MeshBasicMaterial({map: desktop0})

    const desktop1 = textureLoader.load('assets/model/glb/desktop1.png')
    desktop1.colorSpace = SRGBColorSpace;
    const desktopMaterial0 = new MeshBasicMaterial({map: desktop1})

    gltfLoader.load('assets/model/glb/room.glb', (gltf) => {

      gltf.scene.traverse((e: any) => {
      if(e.name !== 'desktop-plane-0' && e.name !== 'desktop-plane-1') {
        e.material = material;
       }

       if(e.name == 'desktop-plane-0') {
        e.material = desktopMaterial1;
        const tweenB = new Tween({y: -0.3})
        .delay(1000)
        .to({y: -0.1}, 8000)
        .onUpdate((obj) => {
          e.material.map.offset.y = obj.y
        })
        const tween = new Tween({y: 0})
        .to({y: -0.3}, 6000)
        .onUpdate((obj)=> {
          e.material.map.offset.y = obj.y
        })
        .delay(5000)
        .repeat(Infinity)
        .yoyo(true)
        // .chain(tweenB)

        tween.start();
       }
       if(e.name == 'desktop-plane-1') {
        e.material = desktopMaterial0;
       }
      })
      this.scene.add(gltf.scene)
    })
    const texture2 = textureLoader.load('assets/model/glb/shadow-baked.jpg')
    texture2.flipY = false;
    texture2.colorSpace = SRGBColorSpace;
    const material2 = new MeshBasicMaterial({map: texture2,side: DoubleSide})
    gltfLoader.load('assets/model/glb/shadow-model.glb', (gltf) => {
      // gltf.scene.traverse((e: any) => {
      //   e.material = material2;
      // })
      //this.scene.add(gltf.scene)
    })
    gltfLoader.load('assets/model/glb/shadow-model1.glb', (gltf) => {

      // gltf.scene.traverse((e: any) => {
      //     e.material = material2;
      // })
      // this.scene.add(gltf.scene)
    })
    gltfLoader.load('assets/model/glb/shadow-model2.glb', (gltf) => {
      gltf.scene.traverse((e: any) => {
        e.material = material2;
    })
      this.scene.add(gltf.scene)
    })
    console.log(this.scene);

    const ambient = new AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);

    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    this.scene.add(directionalLight);

    this.camera.position.set(12, 6, -9);
    this.camera.lookAt(new Vector3(0, 0, 0));

    this.orbit_controls.enablePan = false;

    this.camera.updateProjectionMatrix();

    document.getElementById('home')?.appendChild(this.renderer.domElement);
    this.renderer.setAnimationLoop(this.animation.bind(this));
  }

  animation() {
    this.orbit_controls && this.orbit_controls.update();
    update()
    this.renderer.render(this.scene, this.camera);
  }

}
