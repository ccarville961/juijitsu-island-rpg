export class IslandMap {
  constructor(game) {
    this.game = game;
  }

  render() {
    this.game.root.innerHTML = `
      <main class="game-screen">
        <section class="game-frame" style="color:white; padding:24px;">
          <h1>Jiu-Jitsu Island</h1>
          <p>Island map scene restored.</p>
          <button id="backBtn">Back to Start</button>
        </section>
      </main>
    `;

    document.getElementById("backBtn").onclick = () => {
      this.game.scenes.goTo("start");
    };
  }
}