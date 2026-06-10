import { CharacterSpriteRendererV2 } from "../sprites/CharacterSpriteRendererV2.js";
import { AnimationController } from "../sprites/AnimationController.js";
import { renderGameControls } from "../ui/GameControls.js";
import { getNPC } from "../data/npcs.js";

export class Prologue {
  constructor(game) {
    this.game = game;
    this.step = 0;
    this.isAnimating = false;

    this.fadeOut = false;
    this.combatEffect = "";
    this.screenFlash = "";
    this.motionClass = "";

    this.playerStatus = { hp: 100, stamina: 100 };
    this.coachStatus = { hp: 100, stamina: 100 };

    this.playerAnim = new AnimationController({ frameCount: 4, frameMs: 140 });
    this.coachAnim = new AnimationController({ frameCount: 4, frameMs: 150 });

    this.coachAtlas = getNPC("coachAtlas");

    this.steps = [
      {
        type: "dialogue",
        speaker: "COACH ATLAS",
        text: "Look at this little white-belt retard. You dress yourself, or did your mum lose a bet?",
        music: "dojo",
        playerAnimation: "idle",
        coachAnimation: "idle"
      },
      {
        type: "choice",
        speaker: "YOU",
        text: "Coach Atlas is laughing at you. Your only move is to shoot.",
        actionLabel: "BLAST DOUBLE",
        music: "fight",
        playerAnimation: "run",
        coachAnimation: "idle",
        effectText: "CRASH!",
        flash: "flash-red",
        motion: "player-attacks",
        sfx: "crash",
        effect: () => {
          this.playerStatus.stamina = 50;
          this.coachStatus.hp = 95;
        }
      },
      {
        type: "dialogue",
        speaker: "YOU",
        text: "You blast double into him. CRASH! He pulls guards!.",
        music: "fight",
        playerAnimation: "idle",
        coachAnimation: "idle"
      },
      {
        type: "attack",
        speaker: "COACH ATLAS",
        text: "Cute. My turn.",
        music: "fight",
        playerAnimation: "idle",
        coachAnimation: "fight",
        effectText: "POP!",
        motion: "coach-attacks",
        sfx: "pop",
        effect: () => {
          this.coachStatus.stamina = 90;
        }
      },
      {
        type: "attack",
        speaker: "COACH ATLAS",
        text: "Atlas throws up a triangle like he’s closing a bear trap.",
        music: "fight",
        playerAnimation: "bow",
        coachAnimation: "fight",
        effectText: "TRIANGLE!",
        flash: "flash-purple",
        motion: "coach-attacks triangle-attack",
        sfx: "triangle",
        effect: () => {
          this.playerStatus.hp = 55;
          this.coachStatus.stamina = 86;
        }
      },
      {
        type: "choice",
        speaker: "YOU",
        text: "You are trapped. Your only option is pure white-belt spaz.",
        actionLabel: "SPAZ",
        music: "fight",
        playerAnimation: "run",
        coachAnimation: "idle",
        effectText: "SPAZ!",
        motion: "player-attacks spaz-attack",
        sfx: "spaz",
        effect: () => {
          this.playerStatus.stamina = 0;
        }
      },
      {
        type: "dialogue",
        speaker: "YOU",
        text: "You spaz with everything you have. Arms, legs, soul, dignity. Your stamina hits zero.",
        music: "fight",
        playerAnimation: "bow",
        coachAnimation: "idle"
      },
      {
        type: "attack",
        speaker: "COACH ATLAS",
        text: "Atlas tightens the triangle again.",
        music: "fight",
        playerAnimation: "bow",
        coachAnimation: "fight",
        effectText: "Zzz",
        flash: "flash-red",
        motion: "coach-attacks",
        sfx: "ko",
        effect: () => {
          this.playerStatus.hp = 0;
          this.coachStatus.stamina = 82;
        },
        autoFinish: true
      },
      {
        type: "ko",
        speaker: "COACH ATLAS",
        text: "Night night, dickhead.",
        music: "fight",
        playerAnimation: "bow",
        coachAnimation: "idle"
      }
    ];
  }

  render() {
    const current = this.steps[this.step];
    this.game.audio?.playMusic(current.music || "dojo");

    this.game.root.innerHTML = `
      <main class="game-screen prologue-screen ${this.fadeOut ? "fade-out" : ""} ${this.screenFlash}">
        <section class="prologue-frame">
          <section class="dojo-scene ${this.motionClass}">
            <div class="dojo-wall">
              <div class="dojo-sign">ATLAS GYM</div>
              <div class="dojo-subtitle">WHITE BELT KILLER</div>
              <div class="trophy-wall">${this.renderTrophyWall()}</div>
            </div>

            <div class="dojo-floor">
              ${this.renderFighterCard("coach", this.coachAtlas.name, "BLACK BELT", this.coachStatus)}
              ${this.renderFighterCard("player", this.game.state.player.name, "WHITE BELT", this.playerStatus)}

              <div class="impact-ring"></div>
              <div class="dust-burst dust-player"></div>
              <div class="dust-burst dust-coach"></div>

              ${this.combatEffect ? `<div class="combat-effect ${this.getEffectClass(this.combatEffect)}">${this.combatEffect}</div>` : ""}
            </div>
          </section>

          <section class="dialogue-box">
            <div class="dialogue-topline">
              <p class="dialogue-speaker">${current.speaker}</p>
              <p class="dialogue-progress">${this.step + 1}/${this.steps.length}</p>
            </div>

            <p class="dialogue-text">${current.text}</p>
            ${this.renderActionArea(current)}
          </section>

          ${renderGameControls()}
        </section>
      </main>
    `;

    this.bindControls();
    this.drawSprites();

    this.playerAnim.start(() => this.drawSprites());
    this.coachAnim.start(() => this.drawSprites());
  }

  renderTrophyWall() {
    return [
      "🏆", "🥇", "🥈", "🥉", "🥇", "🥈", "🏆",
      "🥇", "🥉", "🥇", "🏆", "🥈", "🥇", "🥉",
      "🥈", "🥇", "🏆", "🥉", "🥇", "🥈", "🥇"
    ].map(item => `<span>${item}</span>`).join("");
  }

  renderFighterCard(type, name, rank, status) {
    const hpClass = status.hp <= 35 ? "low" : "";

    return `
      <div class="fighter-card ${type}-card">
        <div class="status-panel">
          <div class="status-name">${name} · ${rank}</div>
          <div class="bar-row">
            <span>HP</span>
            <div class="bar hp ${hpClass}">
              <i style="width:${status.hp}%"></i>
            </div>
          </div>
          <div class="bar-row">
            <span>STA</span>
            <div class="bar stamina">
              <i style="width:${status.stamina}%"></i>
            </div>
          </div>
        </div>

        <canvas id="${type}Canvas" width="192" height="256"></canvas>
      </div>
    `;
  }

  renderActionArea(current) {
    if (current.type !== "choice") {
      return `<small>${this.isAnimating ? "..." : "Tap ACTION / CONFIRM"}</small>`;
    }

    return `
      <div class="combat-menu">
        <button id="combatActionBtn" class="combat-action" ${this.isAnimating ? "disabled" : ""}>
          ${current.actionLabel}
        </button>
      </div>
    `;
  }

  getEffectClass(effectText) {
    if (effectText === "CRASH!") return "crash";
    if (effectText === "TRIANGLE!") return "triangle";
    if (effectText === "POP!") return "pop";
    if (effectText === "SPAZ!") return "spaz";
    if (effectText === "Zzz") return "sleep";
    return "";
  }

  drawSprites() {
    const current = this.steps[this.step];
    const playerCanvas = document.getElementById("playerCanvas");
    const coachCanvas = document.getElementById("coachCanvas");

    if (playerCanvas) {
      CharacterSpriteRendererV2.draw(playerCanvas, this.game.state.player, {
        animation: current.playerAnimation || "walking",
        frame: current.playerAnimation === "walking" ? 0 : this.playerAnim.frame
      });
    }

    if (coachCanvas && this.coachAtlas) {
      CharacterSpriteRendererV2.draw(coachCanvas, this.coachAtlas, {
        animation: current.coachAnimation || "idle",
        frame: current.coachAnimation === "idle" ? 0 : this.coachAnim.frame
      });
    }
  }

  bindControls() {
    const advance = () => this.advance();

    document.getElementById("actionBtn").onclick = advance;
    document.getElementById("confirmBtn").onclick = advance;
    document.getElementById("combatActionBtn")?.addEventListener("click", advance);

    document.getElementById("saveBtn").onclick = () => {
      if (this.isAnimating) return;
      localStorage.setItem("jiuJitsuIslandSave", JSON.stringify(this.game.state));
      alert("Game saved.");
    };

    document.getElementById("exitBtn").onclick = () => {
      if (this.isAnimating) return;
      this.stopAnimations();
      this.game.scenes.goTo("start");
    };

    document.getElementById("upBtn").onclick = () => {};
    document.getElementById("downBtn").onclick = () => {};
    document.getElementById("leftBtn").onclick = () => {};
    document.getElementById("rightBtn").onclick = () => {};
  }

  advance() {
    if (this.isAnimating) return;

    const current = this.steps[this.step];

    if (current.type === "ko") {
      this.finishPrologue();
      return;
    }

    if (current.effectText || current.effect) {
      this.playStepEffect(current);
      return;
    }

    this.step += 1;
    this.render();
  }

  playStepEffect(current) {
    this.isAnimating = true;
    this.combatEffect = "";
    this.screenFlash = "";
    this.motionClass = "";
    this.render();

    setTimeout(() => {
      if (current.effect) current.effect();

      this.combatEffect = current.effectText || "";
      this.screenFlash = current.flash || "";
      this.motionClass = current.motion || "";

      this.triggerCombatFeedback(this.combatEffect, current.sfx);
      this.render();

      setTimeout(() => {
        this.combatEffect = "";
        this.screenFlash = "";
        this.motionClass = "";
        this.isAnimating = false;

        if (current.autoFinish) {
          this.step += 1;

          const speaker = document.querySelector(".dialogue-speaker");
          const text = document.querySelector(".dialogue-text");
          const progress = document.querySelector(".dialogue-progress");

          if (speaker) speaker.textContent = "COACH ATLAS";
          if (text) text.textContent = "Night night, dickhead.";
          if (progress) progress.textContent = `${this.step + 1}/${this.steps.length}`;

          setTimeout(() => this.finishPrologue(), 500);
          return;
        }

        this.step += 1;
        this.render();
      }, 900);
    }, 100);
  }

  triggerCombatFeedback(effectText, sfx) {
    if (navigator.vibrate) {
      if (effectText === "CRASH!") navigator.vibrate([90, 40, 120]);
      else if (effectText === "TRIANGLE!") navigator.vibrate([60, 30, 80]);
      else if (effectText === "SPAZ!") navigator.vibrate([40, 30, 40, 30, 80]);
      else if (effectText === "Zzz") navigator.vibrate([160, 80, 160]);
      else navigator.vibrate(60);
    }

    this.game.audio?.playSfx?.(sfx || "hit");
  }

  finishPrologue() {
    if (this.fadeOut) return;

    this.fadeOut = true;
    this.isAnimating = true;

    const screen = document.querySelector(".prologue-screen");
    const scene = document.querySelector(".dojo-scene");
    const playerCanvas = document.getElementById("playerCanvas");

    scene?.classList.add("ko-attack");
    screen?.classList.add("fade-out");
    playerCanvas?.classList.add("player-ko-fall");

    setTimeout(() => {
      this.game.state.progress.prologueComplete = true;
      this.stopAnimations();
      this.game.scenes.goTo("hospital");
    }, 1400);
  }

  stopAnimations() {
    this.playerAnim.stop();
    this.coachAnim.stop();
  }
}