import { gameData } from "../data/gameData.js";

export class IslandMap {
  constructor(game) {
    this.game = game;
  }

  render() {
    const player = this.game.state.player;

    this.game.root.innerHTML = `
      <main class="screen map-screen">
        <section class="hud">
          <strong>${player.name}</strong>
          <span>White Belt</span>
          <span>Energy: 100</span>
        </section>

        <section class="island">
          <h1>Jiu-Jitsu Island</h1>

          <div class="locations">
            ${gameData.locations.map(location => `
              <button class="location-card" data-location="${location.id}">
                <h2>${location.name}</h2>
                <p>${location.description}</p>
              </button>
            `).join("")}
          </div>

          <div id="locationInfo" class="location-info">
            Choose a location.
          </div>
        </section>
      </main>
    `;

    document.querySelectorAll(".location-card").forEach((button) => {
      button.addEventListener("click", () => {
        const location = gameData.locations.find(item => item.id === button.dataset.location);
        document.getElementById("locationInfo").textContent = `${location.name}: ${location.description}`;
      });
    });
  }
}
