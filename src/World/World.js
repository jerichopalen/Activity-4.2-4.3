import Environment from './Environment.js';
import Floor from './Floor.js';
import Fox from './Fox.js';

export default class World {
  constructor({ scene, resources, time, sizes, camera, renderer, debug }) {
    this.scene = scene;
    this.resources = resources;
    this.time = time;
    this.sizes = sizes;
    this.camera = camera;
    this.renderer = renderer;
    this.debug = debug;

    // Wait for resources to be ready
    this.resources.on('ready', () => {
      this.setup();
    });
  }

  setup() {
    // Instantiate world elements
    this.environment = new Environment({
      scene: this.scene,
      resources: this.resources,
      debug: this.debug
    });

    this.floor = new Floor({
      scene: this.scene,
      resources: this.resources,
      time: this.time,
      environment: this.environment,
      debug: this.debug
    });

    // Only create Fox if model is available
    if (this.resources.items.foxModel) {
      this.fox = new Fox({
        scene: this.scene,
        resources: this.resources,
        time: this.time,
        debug: this.debug
      });
    }
  }

  destroy() {
    this.environment?.destroy();
    this.floor?.destroy();
    this.fox?.destroy();
  }
}
