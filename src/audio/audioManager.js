export class AudioManager {
  constructor() {
    this.ctx = null;
    this.musicTimer = null;
  }

  start() {
    this.ctx ??= new AudioContext();
  }

  stopMusic() {
    if (this.musicTimer) clearInterval(this.musicTimer);
    this.musicTimer = null;
  }

  playTone(freq, duration = 0.12, type = "square", volume = 0.05) {
    this.start();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  sfx(name) {
    const map = {
      blast: [90, 0.18, "sawtooth", 0.09],
      triangle: [180, 0.22, "square", 0.08],
      spaz: [460, 0.09, "square", 0.07],
      crash: [55, 0.42, "sawtooth", 0.12],
      sleep: [120, 0.9, "sine", 0.05],
      learn: [660, 0.12, "triangle", 0.06]
    };

    this.playTone(...(map[name] || map.blast));
  }

  playMusic(mode = "chill") {
    this.stopMusic();
    this.start();

    const chill = [220, 277, 330, 277, 247, 294, 370, 294];
    const battle = [110, 110, 165, 147, 110, 220, 196, 165];

    const notes = mode === "battle" ? battle : chill;
    const speed = mode === "battle" ? 150 : 360;
    let i = 0;

    this.musicTimer = setInterval(() => {
      this.playTone(notes[i % notes.length], 0.1, mode === "battle" ? "square" : "triangle", 0.025);
      i++;
    }, speed);
  }
}