import { SceneManager } from "./SceneManager.js";
import { StartScreen } from "./scenes/StartScreen.js";
import { CharacterCreator } from "./scenes/CharacterCreator.js";
import { Prologue } from "./scenes/Prologue.js";
import { IslandMap } from "./scenes/IslandMap.js";

export class Game {
  constructor(rootElement) {
    this.root = rootElement;

    this.state = {
      player: {
        name: "Rookie",
        body: "average",
        hair: "short",
        outfit: "gi"
      },
      progress: {
        prologueComplete: false
      }
    };

    this.scenes = new SceneManager(this);
  }

  start() {
    this.scenes.register("start", StartScreen);
    this.scenes.register("characterCreator", CharacterCreator);
    this.scenes.register("prologue", Prologue);
    this.scenes.register("islandMap", IslandMap);

    this.scenes.goTo("start");
  }
}
