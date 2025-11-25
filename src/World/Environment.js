import * as THREE from 'three';

export default class Environment {
  constructor({ scene, resources, debug }) {
    this.scene = scene;
    this.resources = resources;
    this.debug = debug;

    this.setSunLight();
    this.setEnvironmentMap();

    if (this.debug) {
      this.setDebug();
    }
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight('#ffffff', 2);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 20;
    this.sunLight.shadow.camera.left = -7;
    this.sunLight.shadow.camera.right = 7;
    this.sunLight.shadow.camera.top = 7;
    this.sunLight.shadow.camera.bottom = -7;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3, 3, 3);
    this.scene.add(this.sunLight);

    // Ambient light for fill
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
    this.scene.add(ambientLight);
  }

  setEnvironmentMap() {
    this.environmentMap = this.resources.items.environmentMapTexture;
    this.environmentMap.encoding = THREE.sRGBEncoding;

    this.scene.background = this.environmentMap;
    this.scene.environment = this.environmentMap;
  }

  setDebug() {
    this.debug.add(this.sunLight, 'intensity').min(0).max(10).step(0.001).name('sunLightIntensity');
    this.debug.add(this.sunLight.position, 'x').min(-5).max(5).step(0.001).name('sunLight.x');
    this.debug.add(this.sunLight.position, 'y').min(-5).max(5).step(0.001).name('sunLight.y');
    this.debug.add(this.sunLight.position, 'z').min(-5).max(5).step(0.001).name('sunLight.z');
  }

  applyEnvironmentMapToMaterial(material) {
    if (material.isMaterial) {
      material.envMap = this.environmentMap;
      material.envMapIntensity = 1;
      material.needsUpdate = true;
    }
  }

  destroy() {
    this.scene.remove(this.sunLight);
  }
}
