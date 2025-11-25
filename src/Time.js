import EventEmitter from './Utils/EventEmitter.js';

export default class Time extends EventEmitter {
  constructor() {
    super();
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    this.tick();
  }

  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.emit('tick');
    this.raf = requestAnimationFrame(() => this.tick());
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    super.destroy();
  }
}
