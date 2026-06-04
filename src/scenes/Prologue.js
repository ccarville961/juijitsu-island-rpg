export class Prologue {
  constructor(game) {
    this.game = game;
  }

  render() {
    const player = this.game.state.player;

    this.game.root.innerHTML = `
      <main class="screen prologue-screen">
        <section class="panel story-panel">
          <h1>Welcome to Jiu-Jitsu Island</h1>

          <div class="dialogue-box">
            <p>
              ${player.name}, your journey begins at the Island Dojo.
              Coach Atlas sees potential in you, but the island will test your discipline,
              courage, and technique.
            </p>

            <p>
              Train hard, meet rivals, build friendships, and prepare for your first tournament.
            </p>
          </div>

          <button id="continueBtn">Continue to Island</button>
        </section>
      </main>
    `;

    document.getElementById("continueBtn").addEventListener("click", () => {
      this.game.state.progress.prologueComplete = true;
      this.game.scenes.goTo("islandMap");
    });
  }
}
