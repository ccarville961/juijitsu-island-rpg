export class CharacterCreator {
  constructor(game) {
    this.game = game;
    this.selectedIndex = 0;

    this.options = [
      { key: "name", label: "Name", values: ["ROOKIE"] },
      { key: "body", label: "Physique", values: ["Slim", "Athletic", "Strong"] },
      { key: "hair", label: "Hair Style", values: ["Short", "Curly", "Long"] },
      { key: "hairColor", label: "Hair Colour", values: ["Brown", "Black", "Blonde"] },
      { key: "face", label: "Face", values: ["Focused", "Calm", "Serious"] },
      { key: "skin", label: "Skin Colour", values: ["Pale", "Tan", "Dark"] },
      { key: "beard", label: "Beard", values: ["None", "Stubble", "Full"] },
      { key: "outfit", label: "Clothing", values: ["White Gi", "Rashguard", "Casual"] },
      { key: "confirm", label: "Confirm Design", values: ["START GAME"] }
    ];
  }

  render() {
    const player = this.game.state.player;

    player.name ??= "ROOKIE";
    player.body ??= "Athletic";
    player.hair ??= "Short";
    player.hairColor ??= "Brown";
    player.face ??= "Focused";
    player.skin ??= "Pale";
    player.beard ??= "None";
    player.outfit ??= "White Gi";

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
          <p class="creator-help">
            ↑/↓ row · ←/→ edit · ENTER confirm · Touch supported
          </p>

          <section class="preview-box">
            <h2>PREVIEW</h2>
            <div class="preview-stage">
              <div class="custom-sprite">
                <div class="sprite-hair"></div>
                <div class="sprite-head"></div>
                <div class="sprite-body"></div>
                <div class="sprite-belt"></div>
                <div class="sprite-legs"></div>
              </div>
            </div>
          </section>

          <section class="option-box">
            ${this.options.map((option, index) => `
              <div class="custom-row ${index === this.selectedIndex ? "selected" : ""}" data-index="${index}">
                <span>${index === this.selectedIndex ? ">" : ""} ${option.label}</span>
                <strong>${this.getValue(option)}</strong>
              </div>
            `).join("")}
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
  }

  getValue(option) {
    const value = this.game.state.player[option.key];
    return option.key === "confirm" ? "START GAME" : value;
  }

  bindControls() {
    document.querySelectorAll(".custom-row").forEach(row => {
      row.onclick = () => {
        this.selectedIndex = Number(row.dataset.index);
        this.feedback();
        this.render();
      };
    });

    document.getElementById("upBtn").onclick = () => this.move(-1);
    document.getElementById("downBtn").onclick = () => this.move(1);
    document.getElementById("leftBtn").onclick = () => this.change(-1);
    document.getElementById("rightBtn").onclick = () => this.change(1);
    document.getElementById("actionBtn").onclick = () => this.action();
    document.getElementById("confirmBtn").onclick = () => this.confirm();
    document.getElementById("saveBtn").onclick = () => this.save();
    document.getElementById("exitBtn").onclick = () => this.exit();

    window.onkeydown = event => {
      if (event.key === "ArrowUp") this.move(-1);
      if (event.key === "ArrowDown") this.move(1);
      if (event.key === "ArrowLeft") this.change(-1);
      if (event.key === "ArrowRight") this.change(1);
      if (event.key === "Enter" || event.key === " ") this.action();
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

    if (option.key === "confirm") return this.confirm();

    const current = this.game.state.player[option.key];
    const currentIndex = option.values.indexOf(current);
    let nextIndex = currentIndex + direction;

    if (nextIndex < 0) nextIndex = option.values.length - 1;
    if (nextIndex >= option.values.length) nextIndex = 0;

    this.game.state.player[option.key] = option.values[nextIndex];

    this.feedback();
    this.render();
  }

  action() {
    const option = this.options[this.selectedIndex];

    if (option.key === "confirm") {
      this.confirm();
    } else {
      this.change(1);
    }
  }

  confirm() {
    this.feedback();
    this.game.scenes.goTo("prologue");
  }

  save() {
    this.feedback();
    localStorage.setItem("jiuJitsuIslandSave", JSON.stringify(this.game.state));
    alert("Progress saved.");
  }

  exit() {
    this.feedback();
    this.game.scenes.goTo("start");
  }

  feedback() {
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }
}