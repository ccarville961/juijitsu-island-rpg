export class AnimationController {
  constructor({ frameCount = 4, frameMs = 160 } = {}) {
    this.frameCount = frameCount;
    this.frameMs = frameMs;
    this.frame = 0;
    this.timer = null;
  }

  start(onFrame) {
    this.stop();

    this.timer = setInterval(() => {
      this.frame = (this.frame + 1) % this.frameCount;
      onFrame(this.frame);
    }, this.frameMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  reset() {
    this.frame = 0;
  }
}
