import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import anime from 'animejs/lib/anime.es.js';
import { AmbientLight,
  BoxGeometry,
  Clock,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  SRGBColorSpace,
  Scene,
  TextureLoader,
  VideoTexture,
  LinearFilter,
  RGBAFormat,
  Vector3,
  WebGLRenderer,
  sRGBEncoding } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThreeService } from '../service/three.service';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Easing, Tween, update } from "three/examples/jsm/libs/tween.module.js"
import { log } from 'console';

@Component({
  selector: 'app-street',
  templateUrl: './street.component.html',
  styleUrls: ['./street.component.less']
})
export class StreetComponent implements OnInit {

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
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setPixelRatio(window.devicePixelRatio);

  }

  updateScene() {

    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('assets/js/draco/');

    gltfLoader.setDRACOLoader(dracoLoader);

    const textureLoader = new TextureLoader();
    const textureBicycle = textureLoader.load('assets/model/street/Bicycle.jpg');
    textureBicycle.flipY = false;
    textureBicycle.colorSpace = SRGBColorSpace;
    const materialBicycle = new MeshBasicMaterial({map: textureBicycle, side: DoubleSide});

    const textureLower2 = textureLoader.load('assets/model/street/Lower2.jpg');
    textureLower2.flipY = false;
    textureLower2.colorSpace = SRGBColorSpace;
    const materialLower2 = new MeshBasicMaterial({map: textureLower2, side: DoubleSide});

    const textureTower1 = textureLoader.load('assets/model/street/Tower1.jpg');
    textureTower1.flipY = false;
    textureTower1.colorSpace = SRGBColorSpace;
    const materialTower1 = new MeshBasicMaterial({map: textureTower1, side: DoubleSide});

    const textureTower2 = textureLoader.load('assets/model/street/Tower2.jpg');
    textureTower2.flipY = false;
    textureTower2.colorSpace = SRGBColorSpace;
    const materialTower2 = new MeshBasicMaterial({map: textureTower2, side: DoubleSide});

    const textureTower3 = textureLoader.load('assets/model/street/Tower3.jpg');
    textureTower3.flipY = false;
    textureTower3.colorSpace = SRGBColorSpace;
    const materialTower3 = new MeshBasicMaterial({map: textureTower3, side: DoubleSide});

    const textureTower4 = textureLoader.load('assets/model/street/Tower4.jpg');
    textureTower4.flipY = false;
    textureTower4.colorSpace = SRGBColorSpace;
    const materialTower4 = new MeshBasicMaterial({map: textureTower4, side: DoubleSide});

    const textureSocial = textureLoader.load('assets/model/street/social.jpg'); //
    textureSocial.flipY = false;
    textureSocial.colorSpace = SRGBColorSpace;
    const materialSocial = new MeshBasicMaterial({map: textureSocial, side: DoubleSide});

    const texturePolesAndLights = textureLoader.load('assets/model/street/PolesAndLights.jpg'); //
    texturePolesAndLights.flipY = false;
    texturePolesAndLights.colorSpace = SRGBColorSpace;
    const materialPolesAndLights = new MeshBasicMaterial({map: texturePolesAndLights, side: DoubleSide});

    const textureImg1 = textureLoader.load('assets/model/street/img1.jpg'); //
    textureImg1.flipY = false;
    textureImg1.colorSpace = SRGBColorSpace;
    const materialImg1 = new MeshBasicMaterial({map: textureImg1, side: DoubleSide});

    const textureImg2 = textureLoader.load('assets/model/street/img2.jpg'); //
    textureImg2.flipY = false;
    textureImg2.colorSpace = SRGBColorSpace;
    const materialImg2 = new MeshBasicMaterial({map: textureImg2, side: DoubleSide});

    const textureImg3 = textureLoader.load('assets/model/street/img3.jpg'); //
    textureImg3.flipY = false;
    textureImg3.colorSpace = SRGBColorSpace;
    const materialImg3 = new MeshBasicMaterial({map: textureImg3, side: DoubleSide});

    const textureImg4 = textureLoader.load('assets/model/street/img4.jpg'); //
    textureImg4.flipY = false;
    textureImg4.colorSpace = SRGBColorSpace;
    const materialImg4 = new MeshBasicMaterial({map: textureImg4, side: DoubleSide});

    const textureImg5 = textureLoader.load('assets/model/street/img5.jpg'); //
    textureImg5.flipY = false;
    textureImg5.colorSpace = SRGBColorSpace;
    const materialImg5 = new MeshBasicMaterial({map: textureImg5, side: DoubleSide});

    const video1: any = document.getElementById('video1');
    const video1Texture =  new VideoTexture(video1);
    //video1Texture.flipY = false;
    video1Texture.minFilter = LinearFilter;
    video1Texture.magFilter = LinearFilter;
    video1Texture.format = RGBAFormat;
    const materialvideo1 = new MeshBasicMaterial({map: video1Texture});

    const video2: any = document.getElementById('video2');
    const video2Texture =  new VideoTexture(video2);
    // video2Texture.flipY = false;
    video2Texture.minFilter = LinearFilter;
    video2Texture.magFilter = LinearFilter;
    // video2Texture.format = RGBAFormat;
    const materialvideo2 = new MeshBasicMaterial({map: video2Texture,side: DoubleSide});

    const video3: any = document.getElementById('video3');
    const video3Texture =  new VideoTexture(video3);
    video3Texture.flipY = false;
    video3Texture.minFilter = LinearFilter;
    video3Texture.magFilter = LinearFilter;
    video3Texture.format = RGBAFormat;
    const materialvideo3 = new MeshBasicMaterial({map: video3Texture});

    const video4: any = document.getElementById('video4');
    const video4Texture =  new VideoTexture(video4);
    video4Texture.flipY = false;
    video4Texture.minFilter = LinearFilter;
    video4Texture.magFilter = LinearFilter;
    video4Texture.format = RGBAFormat;
    const materialvideo4 = new MeshBasicMaterial({map: video4Texture});

    const video5: any = document.getElementById('video5');
    const video5Texture =  new VideoTexture(video5);
    video5Texture.flipY = false;
    video5Texture.minFilter = LinearFilter;
    video5Texture.magFilter = LinearFilter;
    video5Texture.format = RGBAFormat;
    const materialvideo5 = new MeshBasicMaterial({map: video5Texture});

    const video6: any = document.getElementById('video6');
    const video6Texture =  new VideoTexture(video6);
    video6Texture.flipY = false;
    video6Texture.minFilter = LinearFilter;
    video6Texture.magFilter = LinearFilter;
    video6Texture.format = RGBAFormat;
    const materialvideo6 = new MeshBasicMaterial({map: video6Texture});

    const video7: any = document.getElementById('video7');
    const video7Texture =  new VideoTexture(video7);
    video7Texture.flipY = false;
    video7Texture.minFilter = LinearFilter;
    video7Texture.magFilter = LinearFilter;
    video7Texture.format = RGBAFormat;
    const materialvideo7 = new MeshBasicMaterial({map: video7Texture});

    const materialTower = new MeshBasicMaterial({
      color:0x00beff,
      transparent:true,
      opacity:.1,
      //开启线框
      wireframe:true
    })
    gltfLoader.load('assets/model/street/portfolio_scene.glb', (gltf) => {
      gltf.scene.traverse((e: any) => {
        if(e.name.indexOf('bicycle') !== -1) {
          e.material = materialBicycle;
         }

         if(e.name.indexOf('base') !== -1) {
          e.material = materialLower2;
         }

         if(e.name.indexOf('tower') !== -1) {

          e.material = materialTower1;
         }

         if(e.name.indexOf('two') !== -1) {
          e.material = materialTower2;
         }

         if(e.name.indexOf('three') !== -1) {
          e.material = materialTower3;
         }

         if(e.name.indexOf('four') !== -1) {
          e.material = materialTower4;
         }

         if(e.name.indexOf('social') !== -1) {
          e.material = materialSocial;
         }

         if(e.name.indexOf('wire') !== -1) {
          e.material = materialPolesAndLights;
         }

         if(e.name.indexOf('img1') !== -1) {
          e.material = materialImg1;
         }

         if(e.name.indexOf('img2') !== -1) {
          e.material = materialImg2;
         }

         if(e.name.indexOf('img3') !== -1) {
          e.material = materialImg3;
         }

         if(e.name.indexOf('089') !== -1) { //Plane.089
          e.material = materialImg4;
         }

         if(e.name.indexOf('090') !== -1) { //Plane.090
          e.material = materialImg5;
         }

         if(e.name.indexOf('video1') !== -1) {
          e.material = materialvideo1;
         }

         if(e.name.indexOf('video2') !== -1) {
          e.material = materialvideo2;
         }

         if(e.name.indexOf('video3') !== -1) {
          e.material = materialvideo3;
         }

         if(e.name.indexOf('video4') !== -1) {
          e.material = materialvideo4;
         }

         if(e.name.indexOf('open') !== -1) {
          e.material = materialvideo5;
         }

         if(e.name.indexOf('080') !== -1) {
          e.material = materialvideo6;
         }

         if(e.name.indexOf('032') !== -1) {
          e.material = materialvideo7;
         }
      })

      this.scene.add(gltf.scene)
    })

    // const ambient = new AmbientLight(0xffffff, 0.4);
    // this.scene.add(ambient);

    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    this.scene.add(directionalLight);

    this.camera.position.set(50, 80, 80);
    this.camera.lookAt(new Vector3(0, 0, 0));

    this.orbit_controls.enablePan = false;

    this.camera.updateProjectionMatrix();

    document.getElementById('street')?.appendChild(this.renderer.domElement);
    this.renderer.setAnimationLoop(this.animation.bind(this));
  }

  animation() {
    this.orbit_controls && this.orbit_controls.update();
    update()
    this.renderer.render(this.scene, this.camera);
  }
}
