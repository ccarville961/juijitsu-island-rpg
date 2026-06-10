import { SceneManager } from "./SceneManager.js";
import { StartScreen } from "./scenes/StartScreen.js";
import { CharacterCreator } from "./scenes/CharacterCreator.js";
import { Prologue } from "./scenes/Prologue.js";
import { Hospital } from "./scenes/Hospital.js";
import { IslandMap } from "./scenes/IslandMap.js";
import { AudioManager } from "./audio/AudioManager.js";

export class Game {
  constructor(rootElement) {
    this.root = rootElement;
    this.audio = new AudioManager();
    this.state = {
      player: {
        name: "Rookie",
        body: "average",
        height: "medium",
        hair: "short",
        hairColor: "brown",
        face: "focused",
        glasses: "none",
        skin: "tan",
        beard: "none",
        outfit: "white-gi",
        belt: "white",
        spritePack: "white-gi-white-belt",
        level: 1,
        xp: 0
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
    this.scenes.register("hospital", Hospital);
    this.scenes.register("islandMap", IslandMap);

    this.scenes.goTo("start");
  }
}
