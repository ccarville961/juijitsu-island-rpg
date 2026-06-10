import { renderGameControls } from "../ui/GameControls.js";
import { applyDefaultAppearance } from "../character/PlayerAppearance.js";
import { AnimationController } from "../sprites/AnimationController.js";
import { CharacterSpriteRendererV2 } from "../sprites/CharacterSpriteRendererV2.js";

export class CharacterCreator {
  constructor(game) {
    this.game = game;
    this.selectedIndex = 1;

    this.previewAnimation = new AnimationController({
      frameCount: 4,
      frameMs: 170
    });

    this.options = [
      { key: "name", label: "Name", type: "input" },
      { key: "body", label: "Physique", values: ["small", "average", "athletic", "strong", "heavy"] },
      { key: "height", label: "Height", values: ["short", "medium", "tall"] },
      { key: "hair", label: "Hair Style", values: ["short", "messy", "spiky", "curly", "long", "ponytail", "mullet", "mohawk", "bald"] },
      { key: "hairColor", label: "Hair Colour", values: ["black", "brown", "blonde", "red", "grey", "pink"] },
      { key: "face", label: "Face", values: ["focused", "calm", "serious", "angry", "smile", "scar"] },
      { key: "glasses", label: "Glasses", values: ["none", "round", "square", "shades"] },
      { key: "skin", label: "Skin Colour", values: ["pale", "fair", "tan", "brown", "dark"] },
      { key: "beard", label: "Beard", values: ["none", "stubble", "goatee", "full"] },
      { key: "outfit", label: "Clothing", values: ["white-gi", "blue-gi", "black-gi", "rashguard", "gym-vest", "gym-tee", "hoodie", "suit", "doctor", "striped", "casual", "naked"] },
      { key: "confirm", label: "Confirm Design", values: ["START GAME"] }
    ];
  }

  render() {
    this.game.audio?.playMusic("chill");

    const player = applyDefaultAppearance(this.game.state.player);

    player.belt = "white";
    player.level = player.level ?? 1;
    player.xp = player.xp ?? 0;

    this.syncSpritePack(player);

    this.game.root.innerHTML = `
      <main class="game-screen creator-screen">
        <section class="creator-frame">
          <section class="creator-shell">
            <section class="preview-box compact-preview">
              <h2>WHITE BELT</h2>
              <div class="preview-stage">
                <canvas id="spriteCanvas" width="192" height="256"></canvas>
              </div>
            </section>

            <section class="option-box">
              ${this.options.map((option, index) => this.renderOption(option, index)).join("")}
            </section>

            ${renderGameControls()}
          </section>
        </section>
      </main>
    `;

    this.bindControls();
    this.drawSprite();
    this.previewAnimation.start(() => this.drawSprite());
  }

  syncSpritePack(player) {
    player.belt = "white";

    const outfit = player.outfit || "white-gi";

    const spritePackMap = {
      naked: "naked",

      "white-gi": "white-gi-white-belt",
      "blue-gi": "blue-gi-white-belt",
      "black-gi": "black-gi-white-belt",

      rashguard: "rashguard",
      "gym-vest": "gym-vest",
      "gym-tee": "gym-tee",
      hoodie: "hoodie",
      suit: "suit",
      doctor: "doctor",
      striped: "striped",
      casual: "casual",
      naked: "naked"
    };

  player.spritePack = spritePackMap[outfit] || "white-gi-white-belt";
}

  drawSprite() {
    const canvas = document.getElementById("spriteCanvas");
    if (!canvas) return;

    this.syncSpritePack(this.game.state.player);

    CharacterSpriteRendererV2.draw(canvas, this.game.state.player, {
      animation: "idle",
      frame: this.previewAnimation.frame
    });
  }

  renderOption(option, index) {
    const selected = index === this.selectedIndex ? "selected" : "";

    if (option.type === "input") {
      return `
        <div class="custom-row ${selected}" data-index="${index}">
          <span>${selected ? ">" : ""} ${option.label}</span>
          <input id="nameInput" class="name-input" value="${this.game.state.player.name}" maxlength="14" />
        </div>
      `;
    }

    if (option.key === "confirm") {
      return `
        <div class="custom-row ${selected}" data-index="${index}">
          <span>${selected ? ">" : ""} ${option.label}</span>
          <strong>${option.values[0]}</strong>
        </div>
      `;
    }

    return `
      <div class="custom-row ${selected}" data-index="${index}">
        <span>${selected ? ">" : ""} ${option.label}</span>
        <div class="option-picker">
          <button class="mini-arrow" data-action="prev" data-index="${index}">◀</button>
          <strong>${this.game.state.player[option.key]}</strong>
          <button class="mini-arrow" data-action="next" data-index="${index}">▶</button>
        </div>
      </div>
    `;
  }

  bindControls() {
    document.querySelectorAll(".custom-row").forEach(row => {
      row.onclick = event => {
        if (event.target.classList.contains("mini-arrow")) return;
        if (event.target.id === "nameInput") return;

        this.selectedIndex = Number(row.dataset.index);

        if (this.options[this.selectedIndex].key === "confirm") {
          this.confirm();
          return;
        }

        this.feedback();
        this.render();
      };
    });

    document.querySelectorAll(".mini-arrow").forEach(button => {
      button.onclick = event => {
        event.stopPropagation();
        this.selectedIndex = Number(button.dataset.index);
        this.change(button.dataset.action === "prev" ? -1 : 1);
      };
    });

    const nameInput = document.getElementById("nameInput");

    if (nameInput) {
      nameInput.oninput = event => {
        this.game.state.player.name = event.target.value || "Rookie";
      };

      nameInput.onfocus = () => {
        this.selectedIndex = 0;
      };
    }

    document.getElementById("upBtn").onclick = () => this.move(-1);
    document.getElementById("downBtn").onclick = () => this.move(1);
    document.getElementById("leftBtn").onclick = () => this.change(-1);
    document.getElementById("rightBtn").onclick = () => this.change(1);
    document.getElementById("actionBtn").onclick = () => this.action();
    document.getElementById("confirmBtn").onclick = () => this.confirm();
    document.getElementById("saveBtn").onclick = () => this.save();
    document.getElementById("exitBtn").onclick = () => this.exit();

    window.onkeydown = event => {
      const typingName = document.activeElement?.id === "nameInput";

      if (typingName) {
        if (event.key === "Enter") document.activeElement.blur();
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        this.move(-1);
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        this.move(1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        this.change(-1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        this.change(1);
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.action();
      }
    };
  }

  move(direction) {
    this.selectedIndex += direction;

    if (this.selectedIndex < 0) this.selectedIndex = this.options.length - 1;
    if (this.selectedIndex >= this.options.length) this.selectedIndex = 0;

    this.feedback();
    this.render();
  }

  change(direction) {
    const option = this.options[this.selectedIndex];

    if (option.type === "input") {
      document.getElementById("nameInput")?.focus();
      return;
    }

    if (option.key === "confirm") {
      this.confirm();
      return;
    }

    const currentValue = this.game.state.player[option.key];
    let currentIndex = option.values.indexOf(currentValue);

    if (currentIndex === -1) currentIndex = 0;

    let nextIndex = currentIndex + direction;

    if (nextIndex < 0) nextIndex = option.values.length - 1;
    if (nextIndex >= option.values.length) nextIndex = 0;

    this.game.state.player[option.key] = option.values[nextIndex];
    this.syncSpritePack(this.game.state.player);

    this.feedback();
    this.render();
  }

  action() {
    const option = this.options[this.selectedIndex];

    if (option.type === "input") {
      return document.getElementById("nameInput")?.focus();
    }

    if (option.key === "confirm") {
      return this.confirm();
    }

    this.change(1);
  }

  async confirm() {
    this.save(false);
    this.feedback();

    this.syncSpritePack(this.game.state.player);

    this.game.state.player.spriteDataUrl = await CharacterSpriteRendererV2.toDataUrl(
      this.game.state.player,
      {
        width: 192,
        height: 256,
        animation: "idle",
        frame: 0
      }
    );

    this.previewAnimation.stop();
    this.game.scenes.goTo("prologue");
  }

  save(showMessage = true) {
    this.syncSpritePack(this.game.state.player);

    localStorage.setItem("jiuJitsuIslandSave", JSON.stringify(this.game.state));

    if (showMessage) {
      alert("Character saved.");
    }
  }

  exit() {
    this.feedback();
    this.previewAnimation.stop();
    this.game.scenes.goTo("start");
  }

  feedback() {
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }
}