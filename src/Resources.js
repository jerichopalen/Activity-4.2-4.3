import EventEmitter from './Utils/EventEmitter.js';
import * as THREE from 'three';

export default class Resources extends EventEmitter {
  constructor(items) {
    super();
    this.items = {};
    this.queue = items;
    this.loaded = 0;
    this.toLoad = this.queue.length;

    // If no items to load, emit ready immediately
    if (this.toLoad === 0) {
      this.createDefaultAssets();
      setTimeout(() => this.emit('ready'), 100);
    } else {
      this.startLoading();
    }
  }

  createDefaultAssets() {
    // Create a gradient-based cubemap for realistic environment reflections
    const createCanvasTexture = (color1, color2) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      
      const gradient = ctx.createLinearGradient(0, 0, 0, 256);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
      
      return new THREE.CanvasTexture(canvas);
    };

    // Create 6 cube faces with different gradients
    const textures = [
      createCanvasTexture('#87CEEB', '#E0F6FF'), // px - right (sky blue)
      createCanvasTexture('#87CEEB', '#E0F6FF'), // nx - left
      createCanvasTexture('#E8F4F8', '#87CEEB'), // py - top (light sky)
      createCanvasTexture('#8B7355', '#D2B48C'), // ny - bottom (ground)
      createCanvasTexture('#87CEEB', '#E0F6FF'), // pz - front
      createCanvasTexture('#87CEEB', '#E0F6FF')  // nz - back
    ];

    const cubeTexture = new THREE.CubeTexture(textures);
    this.items.environmentMapTexture = cubeTexture;
  }

  startLoading() {
    // Loading logic - for now just complete
    this.emit('ready');
  }

  itemLoadComplete(item, file) {
    this.items[item.name] = file;
    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.emit('ready');
    }
  }

  destroy() {
    super.destroy();
  }
}
