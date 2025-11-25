import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Camera {
  constructor({ sizes, canvas }) {
    this.sizes = sizes;
    this.canvas = canvas;

    this.createPerspectiveCamera();
    this.createOrbitControls();

    this.sizes.on('resize', () => this.onWindowResize());
  }

  createPerspectiveCamera() {
    this.perspective = new THREE.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.perspective.position.set(0, 3, 6);
  }

  createOrbitControls() {
    this.controls = new OrbitControls(this.perspective, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
  }

  onWindowResize() {
    this.perspective.aspect = this.sizes.width / this.sizes.height;
    this.perspective.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }

  destroy() {
    this.controls.dispose();
  }
}
