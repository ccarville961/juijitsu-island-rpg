export class CharacterCreator {
  constructor(game) {
    this.game = game;
  }

  render() {
    const player = this.game.state.player;

    this.game.root.innerHTML = `
      <main class="screen creator-screen">
        <section class="panel">
          <h1>Create Your Grappler</h1>

          <div class="creator-layout">
            <div class="character-preview">
              <div class="sprite ${player.body} ${player.hair} ${player.outfit}">
                <div class="hair"></div>
                <div class="head"></div>
                <div class="body"></div>
                <div class="belt"></div>
                <div class="legs"></div>
              </div>
            </div>

            <div class="creator-controls">
              <label>
                Name
                <input id="playerName" value="${player.name}" />
              </label>

              <label>
                Body
                <select id="bodySelect">
                  <option value="slim">Slim</option>
                  <option value="average">Average</option>
                  <option value="strong">Strong</option>
                </select>
              </label>

              <label>
                Hair
                <select id="hairSelect">
                  <option value="short">Short</option>
                  <option value="curly">Curly</option>
                  <option value="long">Long</option>
                </select>
              </label>

              <label>
                Outfit
                <select id="outfitSelect">
                  <option value="gi">Gi</option>
                  <option value="rashguard">Rashguard</option>
                  <option value="casual">Casual</option>
                </select>
              </label>

              <button id="confirmBtn">Confirm Character</button>
            </div>
          </div>
        </section>
      </main>
    `;

    document.getElementById("bodySelect").value = player.body;
    document.getElementById("hairSelect").value = player.hair;
    document.getElementById("outfitSelect").value = player.outfit;

    ["playerName", "bodySelect", "hairSelect", "outfitSelect"].forEach((id) => {
      document.getElementById(id).addEventListener("input", () => this.updateCharacter());
    });

    document.getElementById("confirmBtn").addEventListener("click", () => {
      this.updateCharacter();
      this.game.scenes.goTo("prologue");
    });
  }

  updateCharacter() {
    this.game.state.player.name = document.getElementById("playerName").value || "Rookie";
    this.game.state.player.body = document.getElementById("bodySelect").value;
    this.game.state.player.hair = document.getElementById("hairSelect").value;
    this.game.state.player.outfit = document.getElementById("outfitSelect").value;

    this.render();
  }
}
