export class StartScreen {
  constructor(game) {
    this.game = game;
    this.selectedIndex = 0;
  }

  render() {
    this.game.audio?.playMusic("chill");
    this.game.root.innerHTML = `
<main class="game-screen start-screen">
  <section class="start-frame">
    <div class="title-card">
          <div class="logo-circle">
            <div class="stripe pink"></div>
            <div class="stripe orange"></div>
            <div class="stripe yellow"></div>
            <div class="stripe cyan"></div>
            <div class="stripe beach"></div>
            <div class="logo-palm">🌴</div>
          </div>

          <h1 class="game-title">JIU-JITSU<br>ISLAND</h1>
          <div class="title-divider"></div>
          <p class="tagline">King of the Hill begins here.</p>

          <div class="menu-buttons">
            <button id="newGameBtn" class="menu-button active">NEW GAME</button>
            <button id="continueBtn" class="menu-button" disabled>CONTINUE</button>
            <button id="settingsBtn" class="menu-button">SETTINGS</button>
          </div>

          <div id="settingsPanel" class="settings-panel hidden">
            <label>
              Sound
              <input id="soundToggle" type="checkbox" checked>
            </label>

            <label>
              Haptic Feedback
              <input id="hapticsToggle" type="checkbox" checked>
            </label>
          </div>
    </div>
  </section>
</main>
    `;

    this.buttons = [...document.querySelectorAll(".menu-button")].filter(
      button => !button.disabled
    );

    document.getElementById("newGameBtn").addEventListener("click", () => {
      this.feedback();
      this.game.scenes.goTo("characterCreator");
    });

    document.getElementById("settingsBtn").addEventListener("click", () => {
      this.feedback();
      document.getElementById("settingsPanel").classList.toggle("hidden");
    });

    this.buttons.forEach((button, index) => {
      button.addEventListener("mouseenter", () => {
        this.selectedIndex = index;
        this.updateSelectedButton();
      });

      button.addEventListener("touchstart", () => {
        this.feedback();
        this.selectedIndex = index;
        this.updateSelectedButton();
      });
    });

    window.onkeydown = event => {
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        this.moveSelection(1);
      }

      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        this.moveSelection(-1);
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.buttons[this.selectedIndex].click();
      }
    };
  }

  moveSelection(direction) {
    this.feedback();
    this.selectedIndex += direction;

    if (this.selectedIndex < 0) {
      this.selectedIndex = this.buttons.length - 1;
    }

    if (this.selectedIndex >= this.buttons.length) {
      this.selectedIndex = 0;
    }

    this.updateSelectedButton();
  }

  updateSelectedButton() {
    this.buttons.forEach(button => button.classList.remove("active"));
    this.buttons[this.selectedIndex].classList.add("active");
  }

  feedback() {
    const hapticsToggle = document.getElementById("hapticsToggle");

    if (hapticsToggle && hapticsToggle.checked && navigator.vibrate) {
      navigator.vibrate(35);
    }
  }
}