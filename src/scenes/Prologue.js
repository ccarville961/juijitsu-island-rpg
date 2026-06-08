import { SpriteRenderer } from "../sprites/SpriteRenderer.js";
import { NPCS } from "../data/npcs.js";
import { renderGameControls } from "../ui/GameControls.js";

export class Prologue {
  constructor(game) {
    this.game = game;
    this.step = 0;
    this.playerHp = 60;
    this.playerSt = 50;
    this.atlasHp = 999;
    this.atlasSt = 100;
    this.ended = false;
    this.busy = false;
    this.keyHandler = null;

    this.steps = [
      { type: "intro", text: "BJJ BLACK BELT COACH ATLAS wants to battle!" },
      { type: "dialogue", speaker: "COACH ATLAS", text: "Fuck me, they’re handing out white belts to traffic cones now?" },
      { type: "playerMove", move: "BLAST DOUBLE", text: "You shoot a blast double!" },
      { type: "coachMove", text: "Coach Atlas pulls guard and fires up a TRIANGLE!" },
      { type: "dialogue", speaker: "COACH ATLAS", text: "Cute. You brought wrestling to a strangling contest." },
      { type: "playerMove", move: "SPAZ", text: "You spaz with maximum white belt energy!" },
      { type: "staminaDrop", text: "Your stamina crashed to zero!" },
      { type: "dialogue", speaker: "COACH ATLAS", text: "Excellent. Now you are tired AND trapped." },
      { type: "coachFinish", text: "Coach Atlas tightens the triangle!" }
    ];
  }

  render() {
    this.game.audio?.playMusic?.("battle");

    this.game.root.innerHTML = `
      <main class="game-screen battle-screen">
        <section class="battle-frame">
          <section id="battleStage" class="battle-stage">
            <div class="dojo-bg">
              <div class="dojo-wall">
                <div class="medal-wall left-wall">
                  <span>🥇</span><span>🥈</span><span>🥇</span><span>🏆</span><span>🥇</span><span>🥉</span><span>🥇</span>
                  <span>🥈</span><span>🏆</span><span>🥇</span><span>🥇</span><span>🥉</span><span>🏆</span><span>🥇</span>
                  <span>🥇</span><span>🥇</span><span>🥈</span><span>🏆</span><span>🥇</span><span>🥉</span><span>🥇</span>
                </div>

                <div class="medal-wall right-wall">
                  <span>🏆</span><span>🥇</span><span>🥈</span><span>🥇</span><span>🏆</span><span>🥇</span><span>🥉</span>
                  <span>🥇</span><span>🥇</span><span>🏆</span><span>🥈</span><span>🥇</span><span>🥇</span><span>🏆</span>
                  <span>🥉</span><span>🥇</span><span>🏆</span><span>🥇</span><span>🥈</span><span>🥇</span><span>🥇</span>
                </div>

                <div class="dojo-sign">ATLAS GYM</div>
                <div class="dojo-banner">NO EASY ROUNDS</div>
              </div>

              <div class="mat-floor"></div>
            </div>

            <div class="enemy-panel">
              <div class="name-row">
                <strong>COACH ATLAS</strong>
                <span>BLACK BELT</span>
              </div>
              <div class="hp-wrap">
                <span>HP</span>
                <div class="hp-bar"><div id="atlasHp" class="hp-fill atlas-fill"></div></div>
              </div>
              <div class="hp-wrap">
                <span>ST</span>
                <div class="hp-bar"><div id="atlasSt" class="hp-fill stamina-fill"></div></div>
              </div>
            </div>

            <div class="player-panel">
              <div class="name-row">
                <strong>${this.game.state.player.name || "ROOKIE"}</strong>
                <span>WHITE BELT</span>
              </div>
              <div class="hp-wrap">
                <span>HP</span>
                <div class="hp-bar"><div id="playerHp" class="hp-fill player-fill"></div></div>
              </div>
              <div class="hp-wrap">
                <span>ST</span>
                <div class="hp-bar"><div id="playerSt" class="hp-fill stamina-fill"></div></div>
              </div>
            </div>

            <canvas id="prologuePlayerSprite" class="battle-player-sprite entering-player" width="128" height="192"></canvas>
            <canvas id="coachAtlasSprite" class="coach-atlas-battle-sprite entering-coach" width="128" height="192"></canvas>

            <div id="impactFlash" class="impact-flash"></div>

            <section class="battle-menu">
              <div id="battleText" class="battle-text"></div>
              <div id="battleActions" class="battle-actions"></div>
            </section>
          </section>

          ${renderGameControls()}
        </section>
      </main>
    `;

    this.drawPlayerSprite();
    this.drawCoachAtlas();
    this.updateBars();
    this.lockIntroAnimations();
    this.bindGameControls();
    this.showStep();
  }

  bindGameControls() {
    document.getElementById("upBtn").onclick = () => this.feedback();
    document.getElementById("downBtn").onclick = () => this.feedback();
    document.getElementById("leftBtn").onclick = () => this.feedback();

    document.getElementById("rightBtn").onclick = () => this.primaryAction();
    document.getElementById("actionBtn").onclick = () => this.primaryAction();
    document.getElementById("confirmBtn").onclick = () => this.primaryAction();

    document.getElementById("saveBtn").onclick = () => {
      this.feedback();
      localStorage.setItem("jiuJitsuIslandSave", JSON.stringify(this.game.state));
      alert("Game saved.");
    };

    document.getElementById("exitBtn").onclick = () => {
      this.feedback();
      this.game.scenes.goTo("start");
    };
  }

  primaryAction() {
    this.feedback();

    const battleButton = document.getElementById("battleActionBtn");

    if (battleButton) {
      battleButton.click();
      return;
    }

    this.next();
  }

  feedback() {
    if (navigator.vibrate) navigator.vibrate(30);
  }

  lockIntroAnimations() {
    const player = document.getElementById("prologuePlayerSprite");
    const coach = document.getElementById("coachAtlasSprite");

    player?.addEventListener("animationend", () => this.resetSprite(player), { once: true });
    coach?.addEventListener("animationend", () => this.resetSprite(coach), { once: true });
  }

  resetSprite(sprite) {
    if (!sprite) return;
    sprite.classList.remove("entering-player", "entering-coach", "player-lunge", "coach-attack", "player-hit");
    sprite.style.animation = "none";
    sprite.style.transform = "translate3d(0, 0, 0)";
    sprite.style.filter = "none";
    void sprite.offsetWidth;
    sprite.style.animation = "";
  }

  drawPlayerSprite() {
    const target = document.getElementById("prologuePlayerSprite");
    if (!target) return;

    const ctx = target.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, target.width, target.height);

    const savedSprite = this.game.state.player.spriteDataUrl;

    if (savedSprite) {
      const img = new Image();
      img.onload = () => {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, target.width, target.height);
      };
      img.src = savedSprite;
      return;
    }

    SpriteRenderer.draw(target, this.game.state.player);
  }

  drawCoachAtlas() {
    const canvas = document.getElementById("coachAtlasSprite");
    if (!canvas) return;
    SpriteRenderer.draw(canvas, NPCS.coachAtlas);
  }

  updateBars() {
    const playerHp = document.getElementById("playerHp");
    const playerSt = document.getElementById("playerSt");
    const atlasHp = document.getElementById("atlasHp");
    const atlasSt = document.getElementById("atlasSt");

    if (!playerHp || !playerSt || !atlasHp || !atlasSt) return;

    const playerHpPercent = Math.max(0, (this.playerHp / 60) * 100);
    const playerStPercent = Math.max(0, (this.playerSt / 50) * 100);

    playerHp.style.width = `${playerHpPercent}%`;
    playerSt.style.width = `${playerStPercent}%`;
    atlasHp.style.width = "100%";
    atlasSt.style.width = `${Math.max(0, this.atlasSt)}%`;

    playerHp.classList.toggle("low-health", playerHpPercent <= 25);
    atlasHp.classList.toggle("low-health", false);
  }

  showStep() {
    if (this.ended || this.busy) return;

    const current = this.steps[this.step];
    const text = document.getElementById("battleText");
    const actions = document.getElementById("battleActions");
    const stage = document.getElementById("battleStage");

    actions.innerHTML = "";
    stage.onclick = null;

    if (current.type === "playerMove") {
      text.innerHTML = `<p>What will ${this.game.state.player.name || "ROOKIE"} do?</p>`;
      actions.innerHTML = `<button id="battleActionBtn" class="move-button">${current.move}</button>`;

      document.getElementById("battleActionBtn").onclick = event => {
        event.stopPropagation();
        this.playPlayerMove(current);
      };

      return;
    }

    text.innerHTML = `
      ${current.speaker ? `<p class="battle-speaker">${current.speaker}</p>` : ""}
      <p>${current.text}</p>
      <small>Tap ACTION / CONFIRM / ▶</small>
    `;

    if (current.type === "coachMove") {
      this.coachAttackAnimation(false);
    }

    if (current.type === "staminaDrop") {
      this.playerSt = 0;
      this.updateBars();
      this.fxText("GASSED!", "yellow", "42%", "66%");
      this.playSfx("crash");
      this.shake(false);
    }

    if (current.type === "coachFinish") {
      this.playerHp = 0;
      this.updateBars();
      this.coachAttackAnimation(true);

      setTimeout(() => this.playSfx("sleep"), 700);
      setTimeout(() => this.endPrologue(), 1800);
      return;
    }

    this.keyHandler = event => {
      if (this.busy) return;
      if (["Enter", " ", "ArrowRight"].includes(event.key)) this.next();
    };

    document.addEventListener("keydown", this.keyHandler, { once: true });

    stage.onclick = () => {
      if (!this.busy) this.next();
    };
  }

  playPlayerMove(current) {
    if (this.busy) return;
    this.busy = true;

    document.getElementById("battleText").innerHTML = `<p>${current.text}</p>`;
    document.getElementById("battleActions").innerHTML = "";

    const player = document.getElementById("prologuePlayerSprite");
    this.resetSprite(player);

    player.classList.add("player-lunge");

    if (current.move === "BLAST DOUBLE") {
      this.playerSt = 25;
    }

    if (current.move === "SPAZ") {
      this.playerSt = 0;
    }

    this.updateBars();
    this.hitBurst("47%", "54%");
    this.fxText(current.move === "SPAZ" ? "SPAZ!" : "BLAST!", "white", "38%", "50%");
    this.playSfx(current.move === "SPAZ" ? "spaz" : "blast");
    this.pop();

    setTimeout(() => {
      this.resetSprite(player);
      this.busy = false;
      this.next();
    }, 750);
  }

  coachAttackAnimation(finisher = false) {
    const coach = document.getElementById("coachAtlasSprite");
    const player = document.getElementById("prologuePlayerSprite");

    this.resetSprite(coach);
    this.resetSprite(player);

    coach.classList.add("coach-attack");

    this.atlasSt = Math.max(0, this.atlasSt - (finisher ? 8 : 5));
    this.updateBars();

    setTimeout(() => {
      player.classList.add("player-hit");
    }, 180);

    this.flash("red");
    this.hitBurst("45%", "56%");
    this.fxText(finisher ? "SLEEP!" : "TRIANGLE!", "red", "44%", "36%");
    this.playSfx(finisher ? "crash" : "triangle");
    this.shake(finisher);

    setTimeout(() => {
      this.resetSprite(coach);
      this.resetSprite(player);
    }, 1400);
  }

  next() {
    if (this.busy || this.ended) return;

    document.removeEventListener("keydown", this.keyHandler);

    const stage = document.getElementById("battleStage");
    if (stage) stage.onclick = null;

    this.step += 1;
    this.showStep();
  }

  flash(type = "white") {
    const flash = document.getElementById("impactFlash");
    if (!flash) return;

    flash.classList.remove("white-hit", "red-hit");
    void flash.offsetWidth;
    flash.classList.add(type === "red" ? "red-hit" : "white-hit");

    setTimeout(() => {
      flash.classList.remove("white-hit", "red-hit");
    }, 420);
  }

  hitBurst(x, y) {
    const stage = document.getElementById("battleStage");
    if (!stage) return;

    const burst = document.createElement("div");
    burst.className = "hit-burst";
    burst.style.left = x;
    burst.style.top = y;

    stage.appendChild(burst);
    setTimeout(() => burst.remove(), 500);
  }

  fxText(label, colour, x, y) {
    const stage = document.getElementById("battleStage");
    if (!stage) return;

    const fx = document.createElement("div");
    fx.className = `fx-text fx-${colour}`;
    fx.textContent = label;
    fx.style.left = x;
    fx.style.top = y;

    stage.appendChild(fx);
    setTimeout(() => fx.remove(), 850);
  }

  shake(big = false) {
    const stage = document.getElementById("battleStage");
    if (!stage) return;

    stage.classList.remove("shake", "big-shake");
    void stage.offsetWidth;
    stage.classList.add(big ? "big-shake" : "shake");

    setTimeout(() => {
      stage.classList.remove("shake", "big-shake");
    }, big ? 750 : 400);
  }

  pop() {
    const stage = document.getElementById("battleStage");
    if (!stage) return;

    stage.classList.remove("pop");
    void stage.offsetWidth;
    stage.classList.add("pop");

    setTimeout(() => stage.classList.remove("pop"), 250);
  }

  endPrologue() {
    if (this.ended) return;
    this.ended = true;

    const stage = document.getElementById("battleStage");
    if (stage) stage.onclick = null;

    document.removeEventListener("keydown", this.keyHandler);

    const fadeBlack = document.createElement("div");
    fadeBlack.className = "battle-fade black";
    document.body.appendChild(fadeBlack);

    setTimeout(() => {
      this.game.root.innerHTML = `<main class="fade-white"></main>`;
      fadeBlack.remove();

      const fadeWhite = document.createElement("div");
      fadeWhite.className = "battle-fade white";
      document.body.appendChild(fadeWhite);

      setTimeout(() => {
        fadeWhite.remove();
        this.game.scenes.goTo("hospital");
      }, 1500);
    }, 2000);
  }

  playSfx(type) {
    if (this.game.audio?.sfx) {
      this.game.audio.sfx(type);
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const audio = new AudioCtx();
    const osc = audio.createOscillator();
    const gain = audio.createGain();

    const sounds = {
      blast: { freq: 90, duration: 0.16, type: "sawtooth" },
      triangle: { freq: 180, duration: 0.22, type: "square" },
      spaz: { freq: 420, duration: 0.12, type: "square" },
      crash: { freq: 60, duration: 0.35, type: "sawtooth" },
      sleep: { freq: 120, duration: 0.9, type: "sine" }
    };

    const s = sounds[type] || sounds.blast;

    osc.frequency.value = s.freq;
    osc.type = s.type;

    gain.gain.setValueAtTime(0.08, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + s.duration);

    osc.connect(gain);
    gain.connect(audio.destination);

    osc.start();
    osc.stop(audio.currentTime + s.duration);
  }
}