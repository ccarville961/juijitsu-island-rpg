import { CharacterSpriteRendererV2 } from "../sprites/CharacterSpriteRendererV2.js";
import { renderGameControls } from "../ui/GameControls.js";
import { getNPC } from "../data/npcs.js";

export class Hospital {
  constructor(game) {
    this.game = game;
    this.player = this.game.state.player;
    this.drKimura = getNPC("doctorKimura");

    this.dialogueStep = 0;
    this.dialogueComplete = false;
    this.aquaCollected = false;

    this.playerPos = { x: 72, y: 152 };
    this.playerDirection = "up";
    this.playerAnimation = "idle";
    this.playerFrame = 0;
    this.walkTimer = null;

    this.dialogue = [
      { speaker: "DR KIMURA", text: "You're an idiot for trying to take on Coach Atlas with no experience." },
      { speaker: "DR KIMURA", text: "He's known for beating up white belts for fun. It's basically his hobby." },
      { speaker: "DR KIMURA", text: "And you got caught in a Triangle Attack? Embarrassing." },
      { speaker: "DR KIMURA", text: "The defence is easy. Posture Up. Don't let your head get dragged down." },
      { speaker: "NEW MOVE LEARNED", text: "You learned: POSTURE UP." },
      { speaker: "DR KIMURA", text: "If you want revenge, you'll probably see Atlas at King Of The Hill." },
      { speaker: "DR KIMURA", text: "Only the best Jiu Jitsu black belts in the world enter that tournament." }
    ];
  }

  render() {
    const current = this.dialogue[this.dialogueStep];

    this.game.root.innerHTML = `
      <main class="game-screen hospital-screen">
        <section class="hospital-frame">
          <section class="hospital-play-area">
            <div class="hospital-room">
              <div class="hospital-wall">
                <div class="hospital-sign">KIMURA CLINIC</div>
                <div class="hospital-subtitle">PATCHING UP IDIOTS SINCE 1998</div>

                <div class="wall-detail xray-board">
                  <span>XRAY</span>
                  <strong>🦴</strong>
                </div>

                <div class="wall-detail med-cross">+</div>
                <div class="emoji-wall clipboard-wall">📋</div>
                <div id="hospitalDoor" class="hospital-door">EXIT</div>
              </div>

              <div class="hospital-floor">
                <div class="floor-shadow doctor-shadow"></div>
                <div class="floor-shadow player-shadow"></div>

                <div class="hospital-bed">
                  <div class="bed-headboard"></div>
                  <div class="bed-mattress"></div>
                  <div class="bed-pillow"></div>
                  <div class="bed-sheet"></div>
                  <div class="bed-blanket"></div>
                  <div class="bed-rail bed-rail-top"></div>
                  <div class="bed-rail bed-rail-bottom"></div>
                  <div class="bed-leg leg-one"></div>
                  <div class="bed-leg leg-two"></div>
                </div>

                <div class="hospital-curtain curtain-left"></div>
                <div class="hospital-curtain curtain-right"></div>

                <div class="heart-monitor">
                  <span>HP</span>
                  <i></i>
                </div>

                <div class="hospital-counter"></div>
                <div class="emoji-decor table-plant-one">🪴</div>
                <div class="emoji-decor table-plant-two">🌵</div>
                <div class="emoji-decor cabinet-emoji">🧰</div>

                ${
                  !this.aquaCollected
                    ? `
                      <div id="aquaItem" class="aqua-item" aria-label="Aqua">
                        <span class="aqua-cap"></span>
                        <span class="aqua-bottle"></span>
                        <span class="aqua-label">AQUA</span>
                      </div>
                    `
                    : ""
                }

                <canvas id="doctorCanvas" class="doctor-canvas" width="192" height="256"></canvas>
                <canvas id="playerCanvas" class="hospital-player-canvas" width="192" height="256"></canvas>
              </div>
            </div>
          </section>

          <section class="hospital-dialogue-box">
            ${
              !this.dialogueComplete
                ? `
                  <div class="dialogue-topline">
                    <p class="dialogue-speaker">${current.speaker}</p>
                    <p class="dialogue-progress">${this.dialogueStep + 1}/${this.dialogue.length}</p>
                  </div>
                  <p class="dialogue-text">${current.text}</p>
                  <small>Tap ACTION / CONFIRM</small>
                `
                : `
                  <div class="dialogue-topline">
                    <p class="dialogue-speaker">HOSPITAL</p>
                  </div>
                  <p class="dialogue-text">Stand beside Aqua and press ACTION. Then walk to the door.</p>
                  <small>D-PAD / WASD to move · ACTION to interact</small>
                `
            }
          </section>

          ${renderGameControls()}
        </section>
      </main>
    `;

    this.bindControls();
    this.drawSprites();
    this.positionPlayer();
  }

  drawSprites() {
    this.drawDoctor();
    this.drawPlayer();
  }

  drawPlayer() {
    CharacterSpriteRendererV2.draw(document.getElementById("playerCanvas"), this.player, {
      animation: this.playerAnimation,
      direction: this.playerDirection,
      frame: this.playerFrame
    });
  }

  drawDoctor() {
    CharacterSpriteRendererV2.draw(document.getElementById("doctorCanvas"), this.drKimura, {
      animation: "idle",
      direction: "down",
      frame: 0
    });
  }

  positionPlayer() {
    const playerCanvas = document.getElementById("playerCanvas");
    if (!playerCanvas) return;

    playerCanvas.style.left = `${this.playerPos.x}px`;
    playerCanvas.style.top = `${this.playerPos.y}px`;

    const shadow = document.querySelector(".player-shadow");
    if (shadow) {
      shadow.style.left = `${this.playerPos.x + 17}px`;
      shadow.style.top = `${this.playerPos.y + 88}px`;
    }
  }

  bindControls() {
    const bindMove = (id, dx, dy, direction) => {
      const button = document.getElementById(id);
      if (!button) return;

      button.onclick = event => {
        event.preventDefault();
        this.move(dx, dy, direction);
      };
    };

    document.getElementById("actionBtn").onclick = () => this.action();
    document.getElementById("confirmBtn").onclick = () => this.action();

    bindMove("upBtn", 0, -8, "up");
    bindMove("downBtn", 0, 8, "down");
    bindMove("leftBtn", -8, 0, "left");
    bindMove("rightBtn", 8, 0, "right");

    document.getElementById("saveBtn").onclick = () => {
      localStorage.setItem("jiuJitsuIslandSave", JSON.stringify(this.game.state));
      alert("Game saved.");
    };

    document.getElementById("exitBtn").onclick = () => {
      this.game.scenes.goTo("start");
    };

    window.onkeydown = event => {
      const key = event.key.toLowerCase();

      if (key === "enter" || key === " ") {
        event.preventDefault();
        this.action();
        return;
      }

      if (!this.dialogueComplete) return;

      if (key === "arrowup" || key === "w") this.move(0, -8, "up");
      if (key === "arrowdown" || key === "s") this.move(0, 8, "down");
      if (key === "arrowleft" || key === "a") this.move(-8, 0, "left");
      if (key === "arrowright" || key === "d") this.move(8, 0, "right");
    };
  }

  action() {
    if (!this.dialogueComplete) {
      this.nextDialogue();
      return;
    }

    if (this.isNearAqua() && !this.aquaCollected) {
      this.collectAqua();
      return;
    }

    if (this.isNearDoor()) {
      this.game.state.progress.hospitalComplete = true;
      this.game.scenes.goTo("islandMap");
    }
  }

  nextDialogue() {
    const current = this.dialogue[this.dialogueStep];

    if (current.speaker === "NEW MOVE LEARNED") {
      this.unlockPostureUp();
    }

    this.dialogueStep += 1;

    if (this.dialogueStep >= this.dialogue.length) {
      this.dialogueComplete = true;
    }

    this.render();
  }

  unlockPostureUp() {
    this.game.state.player.moves ??= [];

    if (!this.game.state.player.moves.includes("posture-up")) {
      this.game.state.player.moves.push("posture-up");
      this.game.audio?.playSfx?.("learn");
      navigator.vibrate?.([80, 40, 80]);
    }
  }

  getPlayerBounds(x = this.playerPos.x, y = this.playerPos.y) {
    return {
      x: x + 20,
      y: y + 62,
      width: 36,
      height: 30
    };
  }

  getCollisionBoxes() {
    return [
      { x: 12, y: 22, width: 144, height: 88 },
      { x: 151, y: 12, width: 42, height: 116 },
      { x: 214, y: 176, width: 102, height: 46 },
      { x: 238, y: 0, width: 56, height: 28 }
    ];
  }

  rectsOverlap(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  canMoveTo(x, y) {
    const playerBounds = this.getPlayerBounds(x, y);
    return !this.getCollisionBoxes().some(box => this.rectsOverlap(playerBounds, box));
  }

  move(dx, dy, direction = "down") {
    if (!this.dialogueComplete) return;

    this.playerDirection = direction;
    this.playerAnimation = "walk";
    this.playerFrame = (this.playerFrame + 1) % 2;

    const nextX = Math.max(18, Math.min(250, this.playerPos.x + dx));
    const nextY = Math.max(12, Math.min(170, this.playerPos.y + dy));

    if (this.canMoveTo(nextX, nextY)) {
      this.playerPos.x = nextX;
      this.playerPos.y = nextY;
    }

    this.positionPlayer();
    this.drawPlayer();

    clearTimeout(this.walkTimer);

    this.walkTimer = setTimeout(() => {
      this.playerAnimation = "idle";
      this.playerFrame = 0;
      this.drawPlayer();
    }, 140);
  }

  isNearAqua() {
    return Math.abs(this.playerPos.x - 226) < 24 && Math.abs(this.playerPos.y - 158) < 30;
  }

  collectAqua() {
    if (this.aquaCollected) return;

    this.aquaCollected = true;
    this.game.state.inventory ??= [];

    if (!this.game.state.inventory.some(item => item.id === "aqua")) {
      this.game.state.inventory.push({
        id: "aqua",
        name: "Aqua",
        effect: "Restores a small amount of health."
      });
    }

    this.game.audio?.playSfx?.("item");
    navigator.vibrate?.(80);

    this.render();
  }

  isNearDoor() {
    return Math.abs(this.playerPos.x - 238) < 56 && Math.abs(this.playerPos.y - 18) < 42;
  }
}