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
  SphereGeometry,
  TextureLoader,
  BackSide,
  Camera,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Easing, Tween, update } from "three/examples/jsm/libs/tween.module.js"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
// import * as rooms from "../../../assets/js/index";

const Animations = {
  animateCamera: (camera: Camera, controls: OrbitControls, newP: Vector3, newT: Vector3, time = 2000, callback: Function) => {
    const tween = new Tween({
      x1: camera.position.x,
      y1: camera.position.y,
      z1: camera.position.z,
      x2: controls.target.x,
      y2: controls.target.y,
      z2: controls.target.z
    });
    tween.to({
      x1: newP.x,
      y1: newP.y,
      z1: newP.z,
      x2: newT.x,
      y2: newT.y,
      z2: newT.z
    },
      time
    );
    tween.onUpdate(function (object) {
      camera.position.x = object.x1;
      camera.position.y = object.y1;
      camera.position.z = object.z1;
      controls.target.x = object.x2;
      controls.target.y = object.y2;
      controls.target.z = object.z2;
      controls.update()
    })
    tween.onComplete(function () {
      controls.enabled = true;
      controls.update();
      callback()
    })
    tween.easing(Easing.Cubic.InOut);
    tween.start();
  }
}

const rooms = [
  {
    name: "客厅",
    key: "living",
    position: new Vector3(0, 0, 0),
    target: new Vector3(0, 0, 5)
  },
  {
    name: "卧室",
    key: "bed",
    position: new Vector3(-32, 0, 0),
    target: new Vector3(0, 0, 5)
  },
  {
    name: "书房",
    key: "book",
    position: new Vector3(32, 0, 0),
    target: new Vector3(32, 6, 8)
  }
]

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.less']
})
export class RoomComponent implements OnInit {

  scene!: Scene;
  renderer!: WebGLRenderer;
  camera!: PerspectiveCamera;
  clock!: Clock;
  orbit_controls!: OrbitControls;
  rooms: Array<any> = rooms;

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

    // const axis = new AxesHelper(2000);
    // this.scene.add(axis);

    const textureLoader = new TextureLoader()
    const sphere = new SphereGeometry(16, 50, 50);
    const sphereMaterial = new MeshBasicMaterial({
      map: textureLoader.load('assets/map/map_living_room.jpg'),
      side: BackSide
    })
    const sphereMesh = new Mesh(sphere, sphereMaterial);
    sphereMesh.position.set(0, 0, 0);
    sphereMesh.rotation.y = Math.PI / 2;
    this.scene.add(sphereMesh)

    const sphere2 = new SphereGeometry(16, 50, 50);
    const sphereMaterial2 = new MeshBasicMaterial({
      map: textureLoader.load('assets/map/map_bed_room.jpg'),
      side: BackSide
    })
    const sphereMesh2 = new Mesh(sphere2, sphereMaterial2);
    sphereMesh2.position.set(-32, 0, 0);
    sphereMesh2.rotation.y = Math.PI / 2;
    this.scene.add(sphereMesh2)

    const sphere3 = new SphereGeometry(16, 50, 50);
    const sphereMaterial3 = new MeshBasicMaterial({
      map: textureLoader.load('assets/map/map_study_room.jpg'),
      side: BackSide
    })
    const sphereMesh3 = new Mesh(sphere3, sphereMaterial3);
    sphereMesh3.position.set(32, 0, 0);
    sphereMesh3.rotation.y = Math.PI / 2;
    this.scene.add(sphereMesh3)

    this.camera.position.x = -5;
    this.camera.lookAt(new Vector3(1, 0, 0));

    this.orbit_controls.enablePan = false;
    // 缩放限制
    this.orbit_controls.maxDistance = 10;
    this.camera.updateProjectionMatrix();
    document.getElementById("room-sphere")?.appendChild(this.renderer.domElement);
    this.renderer.setAnimationLoop(this.animation.bind(this));


  }

  animation() {

    this.orbit_controls && this.orbit_controls.update();
    update()
    this.renderer.render(this.scene, this.camera);
  }

  handleSwitchButtonClick(data: any) {

    const { x, y, z } = data.position;
    const newP = new Vector3(x, y, 2);
    const newT = new Vector3(x, y, z);

    Animations.animateCamera(this.camera, this.orbit_controls, newP, newT, 1600, () => {
      console.log(this.orbit_controls.target)
    });
    this.orbit_controls.update();

    // await sleep(1600);
    // data.currentRoom = room.key;
  }


}
