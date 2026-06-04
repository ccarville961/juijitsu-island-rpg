import { gameData } from "../data/gameData.js";

export class StartScreen {
  constructor(game) {
    this.game = game;
  }

  render() {
    this.game.root.innerHTML = `
      <main class="screen start-screen">
        <section class="panel hero-panel">
          <h1>${gameData.title}</h1>
          <p>${gameData.subtitle}</p>

          <div class="menu">
            <button id="newGameBtn">New Game</button>
            <button id="continueBtn" disabled>Continue</button>
          </div>
        </section>
      </main>
    `;

    document.getElementById("newGameBtn").addEventListener("click", () => {
      this.game.scenes.goTo("characterCreator");
    });
  }
}
