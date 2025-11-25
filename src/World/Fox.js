import * as THREE from 'three';

export default class Fox {
  constructor({ scene, resources, time, debug }) {
    this.scene = scene;
    this.resources = resources;
    this.time = time;
    this.debug = debug;

    this.resource = this.resources.items.foxModel;

    this.setModel();
    this.setAnimation();

    this.time.on('tick', () => this.update());

    if (this.debug) {
      this.setDebug();
    }
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.02, 0.02, 0.02);
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.envMap = this.resources.items.environmentMapTexture;
        child.material.envMapIntensity = 0.5;
      }
    });
  }

  setAnimation() {
    this.animations = this.resource.animations;
    this.mixer = new THREE.AnimationMixer(this.model);
    this.action = this.mixer.clipAction(this.animations[2]); // Walking animation
    this.action.play();
  }

  update() {
    this.mixer.update(this.time.delta * 0.001);
  }

  setDebug() {
    const debugObject = { playIdle: () => this.playAnimation(0) };
    this.debug.add(debugObject, 'playIdle').name('Play Idle');
  }

  playAnimation(index) {
    const newAction = this.mixer.clipAction(this.animations[index]);
    newAction.reset();
    this.action.crossFadeTo(newAction, 0.5);
    this.action = newAction;
    this.action.play();
  }

  destroy() {
    this.scene.remove(this.model);
    this.mixer.stopAllAction();
  }
}
