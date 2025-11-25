import * as THREE from 'three';

export default class Renderer {
  constructor({ canvas, sizes }) {
    this.canvas = canvas;
    this.sizes = sizes;

    this.createRenderer();
    this.configureRenderer();

    this.sizes.on('resize', () => this.onWindowResize());
  }

  createRenderer() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false
    });
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  configureRenderer() {
    // Activity 4.2: Realistic Rendering Settings
    this.instance.toneMapping = THREE.ReinhardToneMapping;
    this.instance.toneMappingExposure = 1.5;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFShadowMap;
  }

  onWindowResize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }

  destroy() {
    this.instance.dispose();
  }
}
