export class AudioManager {
  constructor() {
    this.enabled = true;
    this.context = null;
    this.currentTrack = null;
    this.musicTimer = null;
    this.step = 0;
  }

  getContext() {
    if (!this.context) this.context = new AudioContext();
    if (this.context.state === "suspended") this.context.resume();
    return this.context;
  }

  playMusic(trackName = "chill") {
    if (!this.enabled) return;
    if (this.currentTrack === trackName) return;

    this.stopMusic();
    this.currentTrack = trackName;
    this.step = 0;

    const isFight = trackName === "fight";

    const tempo = isFight ? 240 : 760;
    const pattern = isFight
      ? [146, 164, 196, 220, 196, 164, 146, 130]
      : [196, 220, 246, 220, 196, 164, 196, 220];

    this.musicTimer = setInterval(() => {
      const note = pattern[this.step % pattern.length];

      this.playTone(
        note,
        isFight ? 0.11 : 0.2,
        isFight ? 0.025 : 0.018,
        "triangle"
      );

      if (isFight && this.step % 4 === 0) {
        this.playTone(73, 0.08, 0.025, "sine");
      }

      this.step++;
    }, tempo);
  }

  stopMusic() {
    if (this.musicTimer) clearInterval(this.musicTimer);
    this.musicTimer = null;
    this.currentTrack = null;
  }

  playSfx(name) {
    if (!this.enabled) return;

    if (name === "crash") {
      this.playNoise(0.16, 0.24);
      this.playTone(78, 0.12, 0.18, "sawtooth");
      return;
    }

    if (name === "triangle") {
      this.playTone(260, 0.1, 0.14, "square");
      setTimeout(() => this.playTone(170, 0.14, 0.12, "square"), 90);
      return;
    }

    if (name === "spaz") {
      [280, 190, 330, 140, 250].forEach((note, index) => {
        setTimeout(() => this.playTone(note, 0.045, 0.1, "square"), index * 45);
      });
      return;
    }

    if (name === "ko") {
      this.playTone(130, 0.25, 0.13, "sawtooth");
      setTimeout(() => this.playTone(82, 0.42, 0.1, "sawtooth"), 180);
      return;
    }

    if (name === "pop") {
      this.playTone(420, 0.08, 0.12, "square");
      return;
    }

    this.playTone(180, 0.08, 0.1, "square");
  }

  playSound(name) {
    this.playSfx(name);
  }

  playTone(frequency, duration = 0.1, volume = 0.1, type = "square") {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = frequency;

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  playNoise(duration = 0.15, volume = 0.18) {
    const ctx = this.getContext();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    const gain = ctx.createGain();

    source.buffer = buffer;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) this.stopMusic();
    return this.enabled;
  }
}