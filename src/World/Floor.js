import * as THREE from 'three';

export default class Floor {
  constructor({ scene, resources, time, environment, debug }) {
    this.scene = scene;
    this.resources = resources;
    this.time = time;
    this.environment = environment;
    this.debug = debug;

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.addObjects();

    // Subscribe to time tick for animations (Activity 4.3: Event system)
    if (this.time) {
      this.time.on('tick', () => this.update());
    }

    if (this.debug) {
      this.setDebug();
    }
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(10, 10);
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      color: '#888888'
    });
    // Activity 4.2: Apply environment map to material
    this.environment.applyEnvironmentMapToMaterial(this.material);
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.position.y = 0;
    this.scene.add(this.mesh);
  }

  addObjects() {
    // Activity 4.2: Objects with realistic materials demonstrating PBR
    
    // Red metallic sphere - shows strong reflections
    const sphereGeom = new THREE.SphereGeometry(1, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: '#ff6b6b',
      metalness: 0.9,
      roughness: 0.1
    });
    this.environment.applyEnvironmentMapToMaterial(sphereMat);
    
    this.sphere = new THREE.Mesh(sphereGeom, sphereMat);
    this.sphere.castShadow = true;
    this.sphere.receiveShadow = true;
    this.sphere.position.set(-3, 1, 0);
    this.scene.add(this.sphere);

    // Teal matte cube - minimal reflections
    const cubeGeom = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const cubeMat = new THREE.MeshStandardMaterial({
      color: '#4ecdc4',
      metalness: 0.2,
      roughness: 0.8
    });
    this.environment.applyEnvironmentMapToMaterial(cubeMat);
    
    this.cube = new THREE.Mesh(cubeGeom, cubeMat);
    this.cube.castShadow = true;
    this.cube.receiveShadow = true;
    this.cube.position.set(0, 1, 0);
    this.scene.add(this.cube);

    // Yellow semi-reflective torus
    const torusGeom = new THREE.TorusGeometry(0.7, 0.2, 16, 32);
    const torusMat = new THREE.MeshStandardMaterial({
      color: '#ffd93d',
      metalness: 0.6,
      roughness: 0.4
    });
    this.environment.applyEnvironmentMapToMaterial(torusMat);
    
    this.torus = new THREE.Mesh(torusGeom, torusMat);
    this.torus.castShadow = true;
    this.torus.receiveShadow = true;
    this.torus.position.set(3, 1, 0);
    this.scene.add(this.torus);

    this.objects = [this.sphere, this.cube, this.torus];
  }

  update() {
    // Activity 4.3: Animate objects via time tick event
    if (this.sphere) {
      this.sphere.rotation.y += 0.003;
      this.sphere.rotation.x += 0.002;
    }
    if (this.cube) {
      this.cube.rotation.y += 0.002;
      this.cube.rotation.x += 0.001;
    }
    if (this.torus) {
      this.torus.rotation.y += 0.004;
      this.torus.rotation.z += 0.003;
    }
  }

  setDebug() {
    // Debug controls for metalness and roughness
    const sphereMat = this.sphere.material;
    this.debug.add(sphereMat, 'metalness').min(0).max(1).step(0.01).name('sphere.metalness');
    this.debug.add(sphereMat, 'roughness').min(0).max(1).step(0.01).name('sphere.roughness');
    
    const cubeMat = this.cube.material;
    this.debug.add(cubeMat, 'metalness').min(0).max(1).step(0.01).name('cube.metalness');
    this.debug.add(cubeMat, 'roughness').min(0).max(1).step(0.01).name('cube.roughness');
  }

  destroy() {
    this.scene.remove(this.mesh);
    this.objects.forEach(obj => this.scene.remove(obj));
    this.geometry.dispose();
    this.material.dispose();
    this.sphere.geometry.dispose();
    this.cube.geometry.dispose();
    this.torus.geometry.dispose();
    if (this.time) {
      this.time.off('tick', () => this.update());
    }
  }
}
