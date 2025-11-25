import * as THREE from 'three';
import * as dat from 'dat.gui';
import Sizes from './Sizes.js';
import Time from './Time.js';
import Camera from './Camera.js';
import Renderer from './Renderer.js';
import Resources from './Resources.js';
import World from './World/World.js';

let instance = null;

export default class Experience {
  constructor(canvas) {
    // Singleton pattern
    if (instance) {
      return instance;
    }
    instance = this;

    this.canvas = canvas;

    // Setup core systems
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera({ sizes: this.sizes, canvas: this.canvas });
    this.renderer = new Renderer({ canvas: this.canvas, sizes: this.sizes });

    // Debug GUI
    this.debug = new dat.GUI({ width: 400 });
    this.debugObject = {};

    // Load resources (empty for now - using defaults)
    this.resources = new Resources([]);

    // Create world
    this.world = new World({
      scene: this.scene,
      resources: this.resources,
      time: this.time,
      sizes: this.sizes,
      camera: this.camera,
      renderer: this.renderer,
      debug: this.debug
    });

    // Add renderer exposure control
    this.debugObject.toneMappingExposure = this.renderer.instance.toneMappingExposure;
    this.debug
      .add(this.debugObject, 'toneMappingExposure')
      .min(0)
      .max(4)
      .step(0.001)
      .onChange(() => {
        this.renderer.instance.toneMappingExposure = this.debugObject.toneMappingExposure;
      })
      .name('Exposure');

    // Activity 4.2: Add environment map intensity control
    this.debugObject.envMapIntensity = 1;
    this.debug
      .add(this.debugObject, 'envMapIntensity')
      .min(0)
      .max(2)
      .step(0.01)
      .onChange(() => {
        // Update all materials with new envMapIntensity
        this.scene.traverse((child) => {
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                if (mat.envMap) mat.envMapIntensity = this.debugObject.envMapIntensity;
              });
            } else if (child.material.envMap) {
              child.material.envMapIntensity = this.debugObject.envMapIntensity;
            }
          }
        });
      })
      .name('envMapIntensity');

    // Update loop
    this.time.on('tick', () => this.update());
  }

  update() {
    this.camera.update();
    this.renderer.instance.render(this.scene, this.camera.perspective);
  }

  destroy() {
    this.sizes.destroy();
    this.time.destroy();
    this.camera.destroy();
    this.renderer.destroy();
    this.world.destroy();
    this.debug.destroy();
  }
}
