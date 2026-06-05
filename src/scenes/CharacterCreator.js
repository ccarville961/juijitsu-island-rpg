export class CharacterCreator {
  constructor(game) {
    this.game = game;
    this.selectedIndex = 1;

    this.options = [
      { key: "name", label: "Name", type: "input" },
      { key: "body", label: "Physique", values: ["small", "average", "athletic", "strong", "heavy"] },
      { key: "height", label: "Height", values: ["short", "medium", "tall"] },
      { key: "hair", label: "Hair Style", values: ["short", "messy", "spiky", "curly", "long", "ponytail", "bald"] },
      { key: "hairColor", label: "Hair Colour", values: ["black", "brown", "blonde", "red", "grey"] },
      { key: "face", label: "Face", values: ["focused", "calm", "serious", "smile", "scar"] },
      { key: "glasses", label: "Glasses", values: ["none", "round", "square", "shades"] },
      { key: "skin", label: "Skin Colour", values: ["pale", "fair", "tan", "brown", "dark"] },
      { key: "beard", label: "Beard", values: ["none", "stubble", "goatee", "full"] },
      { key: "outfit", label: "Clothing", values: ["naked", "white-gi", "blue-gi", "black-gi", "rashguard", "gym-vest", "gym-tee", "hoodie", "suit", "doctor", "striped", "casual"] },      { key: "confirm", label: "Confirm Design", values: ["START GAME"] }
    ];
  }

  render() {
    const player = this.game.state.player;

    player.name ??= "Rookie";
    player.body ??= "average";
    player.height ??= "medium";
    player.hair ??= "short";
    player.hairColor ??= "brown";
    player.face ??= "focused";
    player.glasses ??= "none";
    player.skin ??= "pale";
    player.beard ??= "none";
    player.outfit ??= "white-gi";

    this.game.root.innerHTML = `
      <main class="creator-screen">
        <header class="game-hud">
          <strong>JIU JITSU ISLAND</strong>
          <span>WHITE</span>
          <span>Lv1</span>
          <span>HP 60/60</span>
          <span>ST 50/50</span>
        </header>

        <section class="creator-shell">
          <h1>CREATE YOUR WHITE BELT</h1>
          <p class="creator-help">↑/↓ row · ←/→ edit · click arrows · type name · touch supported</p>

          <section class="preview-box">
            <h2>PREVIEW</h2>
            <div class="preview-stage">
              <canvas id="spriteCanvas" width="128" height="192"></canvas>
            </div>
          </section>

          <section class="option-box">
            ${this.options.map((option, index) => this.renderOption(option, index)).join("")}
          </section>

          <section class="mobile-controls">
            <div class="dpad">
              <button id="upBtn" class="dpad-up">▲</button>
              <button id="leftBtn" class="dpad-left">◀</button>
              <button id="rightBtn" class="dpad-right">▶</button>
              <button id="downBtn" class="dpad-down">▼</button>
            </div>

            <div class="action-grid">
              <button id="actionBtn">ACTION</button>
              <button id="confirmBtn">CONFIRM</button>
              <button id="saveBtn">SAVE</button>
              <button id="exitBtn">EXIT</button>
            </div>
          </section>
        </section>
      </main>
    `;

    this.bindControls();
    this.drawSprite();
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

      if (event.key === "ArrowUp") { event.preventDefault(); this.move(-1); }
      if (event.key === "ArrowDown") { event.preventDefault(); this.move(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); this.change(-1); }
      if (event.key === "ArrowRight") { event.preventDefault(); this.change(1); }
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); this.action(); }
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

    this.feedback();
    this.render();
  }

  action() {
    const option = this.options[this.selectedIndex];
    if (option.type === "input") return document.getElementById("nameInput")?.focus();
    if (option.key === "confirm") return this.confirm();
    this.change(1);
  }

  confirm() {
    this.save(false);
    this.feedback();
    this.game.scenes.goTo("prologue");
  }

  save(showMessage = true) {
    this.feedback();
    localStorage.setItem("jiuJitsuIslandSave", JSON.stringify(this.game.state));
    if (showMessage) alert("Character saved.");
  }

  exit() {
    this.feedback();
    this.game.scenes.goTo("start");
  }

  feedback() {
    if (navigator.vibrate) navigator.vibrate(30);
  }



   drawSprite() {
  const canvas = document.getElementById("spriteCanvas");
  const ctx = canvas.getContext("2d");
  const p = this.game.state.player;

  const scale = 4;
  const spriteYOffset = 3;

  const px = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * scale, (y + spriteYOffset) * scale, w * scale, h * scale);
  };

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const skin = {
    pale: "#f0b88c",
    fair: "#d99a6c",
    tan: "#b8794f",
    brown: "#8d5635",
    dark: "#5a3424"
  }[p.skin] || "#f0b88c";

  const hairColor = {
    black: "#000000",
    brown: "#4a2412",
    blonde: "#e8c45c",
    red: "#b3422f",
    grey: "#9a9a9a"
  }[p.hairColor] || "#4a2412";

  const outfitKey = p.outfit === "gi" ? "white-gi" : p.outfit;

  const outfitColor = {
    naked: skin,
    "white-gi": "#ffffff",
    "blue-gi": "#2455d6",
    "black-gi": "#151515",
    rashguard: "#35e8ff",
    "gym-vest": "#ff2fa3",
    "gym-tee": "#35e8ff",
    hoodie: "#5a25ff",
    suit: "#101827",
    doctor: "#f5f5f5",
    striped: "#ffffff",
    casual: "#ff8a20"
  }[outfitKey] || "#ffffff";

  const outline = "#050510";
  const headOutline = p.hair === "bald" ? "#050510" : outline;
  const patch = "#e63946";
  const white = "#ffffff";

  const cx = Math.floor(canvas.width / scale / 2);

  const bodyW = {
    small: 13,
    average: 15,
    athletic: 16,
    strong: 17,
    heavy: 19
  }[p.body] || 15;

  const torsoH = {
    short: 13,
    medium: 15,
    tall: 17
  }[p.height] || 15;

  const legH = {
    short: 7,
    medium: 9,
    tall: 11
  }[p.height] || 9;

  const headW = 13;
  const headH = 12;
  const headX = cx - Math.floor(headW / 2);
  const headY = 2;

  const neckY = headY + headH;
  const bodyY = neckY + 1;
  const bodyX = cx - Math.floor(bodyW / 2);
  const beltY = bodyY + torsoH - 2;
  const legY = beltY + 2;
  const footY = legY + legH;

  const isGi = ["white-gi", "blue-gi", "black-gi"].includes(outfitKey);
  const isSleeveless = ["naked", "gym-vest"].includes(outfitKey);
  const armColor = isSleeveless ? skin : outfitColor;
  const lowerColor = outfitKey === "naked" ? skin : outfitColor;

  // Head
  px(headX, headY, headW, headH, headOutline);
  px(headX + 1, headY + 1, headW - 2, headH - 2, skin);

  // Ears
  px(headX - 1, headY + 5, 1, 3, skin);
  px(headX + headW, headY + 5, 1, 3, skin);

  // Hair
  if (p.hair !== "bald") {
    if (p.hair === "short") {
      px(headX, headY - 2, headW, 4, hairColor);
      px(headX - 1, headY, 3, 5, hairColor);
      px(headX + headW - 2, headY, 3, 5, hairColor);
    }

    if (p.hair === "messy") {
      px(headX, headY - 2, headW, 4, hairColor);
      px(headX + 1, headY - 4, 2, 3, hairColor);
      px(headX + 5, headY - 5, 3, 4, hairColor);
      px(headX + 10, headY - 4, 2, 3, hairColor);
      px(headX - 1, headY, 3, 5, hairColor);
      px(headX + headW - 2, headY, 3, 5, hairColor);
    }

    if (p.hair === "spiky") {
      px(headX, headY - 2, headW, 3, hairColor);
      px(headX + 1, headY - 5, 2, 4, hairColor);
      px(headX + 5, headY - 7, 3, 6, hairColor);
      px(headX + 10, headY - 5, 2, 4, hairColor);
      px(headX - 1, headY, 3, 5, hairColor);
      px(headX + headW - 2, headY, 3, 5, hairColor);
    }

    if (p.hair === "curly") {
      px(headX - 1, headY - 3, headW + 2, 4, hairColor);
      px(headX + 1, headY - 5, 3, 3, hairColor);
      px(headX + 5, headY - 6, 3, 3, hairColor);
      px(headX + 9, headY - 5, 3, 3, hairColor);
      px(headX - 1, headY, 3, 6, hairColor);
      px(headX + headW - 2, headY, 3, 6, hairColor);
    }

    if (p.hair === "long") {
      px(headX - 1, headY - 2, headW + 2, 4, hairColor);
      px(headX - 1, headY, 3, 12, hairColor);
      px(headX + headW - 2, headY, 3, 12, hairColor);
    }

    if (p.hair === "ponytail") {
      px(headX - 1, headY - 2, headW + 2, 4, hairColor);
      px(headX - 1, headY, 3, 6, hairColor);
      px(headX + headW - 2, headY, 3, 6, hairColor);
      px(headX + headW + 1, headY + 4, 3, 9, hairColor);
    }
  }

  // Face
  px(headX + 4, headY + 6, 1, 3, outline);
  px(headX + 8, headY + 6, 1, 3, outline);

  if (p.face === "calm") {
    px(headX + 3, headY + 7, 3, 1, outline);
    px(headX + 8, headY + 7, 3, 1, outline);
  }

  if (p.face === "serious") {
    px(headX + 3, headY + 5, 3, 1, outline);
    px(headX + 8, headY + 5, 3, 1, outline);
  }

  if (p.face === "smile") {
    px(headX + 5, headY + 10, 4, 1, outline);
  } else {
    px(headX + 6, headY + 10, 2, 1, outline);
  }

  if (p.face === "scar") {
    px(headX + 10, headY + 4, 1, 8, "#ff2fa3");
  }

  // Glasses
  if (p.glasses === "round") {
    px(headX + 2, headY + 5, 4, 4, outline);
    px(headX + 7, headY + 5, 4, 4, outline);
    px(headX + 6, headY + 6, 1, 1, outline);
    px(headX + 3, headY + 6, 2, 2, skin);
    px(headX + 8, headY + 6, 2, 2, skin);
  }

  if (p.glasses === "square") {
    px(headX + 2, headY + 5, 4, 3, outline);
    px(headX + 7, headY + 5, 4, 3, outline);
    px(headX + 6, headY + 5, 1, 1, outline);
  }

  if (p.glasses === "shades") {
    px(headX + 2, headY + 5, 9, 3, outline);
  }

  // Beard, moved lower
  const beardColor = p.hairColor === "black" ? "#000000" : hairColor;

  if (p.beard === "stubble") {
    px(headX + 3, headY + 10, 7, 1, beardColor);
  }

  if (p.beard === "goatee") {
    px(headX + 5, headY + 10, 3, 1, beardColor);
    px(headX + 5, headY + 11, 3, 3, beardColor);
  }

  if (p.beard === "full") {
    px(headX + 2, headY + 9, 9, 2, beardColor);
    px(headX + 3, headY + 11, 7, 3, beardColor);
    px(headX + 5, headY + 13, 3, 2, beardColor);
  }

  // Neck
  px(cx - 2, neckY, 4, 1, skin);

  // Body
  px(bodyX, bodyY, bodyW, torsoH, outline);
  px(bodyX + 1, bodyY + 1, bodyW - 2, torsoH - 2, outfitColor);

  // Arms attached
  const armW = 4;
  const armH = torsoH - 1;
  const leftArmX = bodyX - armW;
  const rightArmX = bodyX + bodyW;

  px(leftArmX, bodyY + 1, armW, armH, outline);
  px(rightArmX, bodyY + 1, armW, armH, outline);
  px(leftArmX + 1, bodyY + 2, armW - 1, armH - 3, armColor);
  px(rightArmX, bodyY + 2, armW - 1, armH - 3, armColor);

  // Outfit details
  if (outfitKey === "naked") {
    px(cx - 1, bodyY + 5, 2, 1, "#5a3424");
    px(cx - 3, bodyY + 8, 1, 1, "#5a3424");
    px(cx + 3, bodyY + 8, 1, 1, "#5a3424");
  }

  if (outfitKey === "gym-vest") {
    px(cx - 2, bodyY + 1, 4, torsoH - 3, skin);
  }

  if (outfitKey === "gym-tee") {
    px(cx - 3, bodyY + 3, 6, 2, white);
  }

  if (outfitKey === "casual") {
    px(bodyX + 1, bodyY + 1, bodyW - 2, 5, "#ffb020");
  }

  if (outfitKey === "striped") {
    for (let y = bodyY + 1; y < beltY; y += 3) {
      px(bodyX + 1, y, bodyW - 2, 1, "#35e8ff");
    }
  }

  if (isGi || outfitKey === "doctor") {
    px(cx - 4, bodyY + 1, 1, torsoH - 2, outline);
    px(cx + 3, bodyY + 1, 1, torsoH - 2, outline);
    px(cx, bodyY + 1, 1, torsoH - 2, white);
  }

  if (outfitKey === "suit") {
    px(cx - 2, bodyY + 1, 4, torsoH - 2, white);
    px(cx, bodyY + 3, 1, torsoH - 4, "#ff2fa3");
  }

  if (outfitKey === "doctor") {
    px(cx, bodyY + 3, 1, torsoH - 4, "#35e8ff");
    px(cx + 4, bodyY + 5, 1, 2, patch);
  }

  if (isGi) {
    px(cx, bodyY + 6, 3, 4, patch);
    px(bodyX, beltY, bodyW, 2, outline);
  }

  // Hands with bottom outline
  px(leftArmX + 1, beltY - 1, 3, 4, outline);
  px(rightArmX, beltY - 1, 3, 4, outline);

  px(leftArmX + 1, beltY - 1, 3, 3, skin);
  px(rightArmX, beltY - 1, 3, 3, skin);

  // Legs
  px(cx - 7, legY, 6, legH, outline);
  px(cx + 1, legY, 6, legH, outline);
  px(cx - 6, legY, 4, legH, lowerColor);
  px(cx + 2, legY, 4, legH, lowerColor);

  // Feet
  px(cx - 8, footY, 7, 3, outline);
  px(cx + 1, footY, 7, 3, outline);
}
}