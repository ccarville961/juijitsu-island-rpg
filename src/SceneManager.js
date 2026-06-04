export class SceneManager {
  constructor(game) {
    this.game = game;
    this.scenes = {};
    this.currentScene = null;
  }

  register(name, SceneClass) {
    this.scenes[name] = SceneClass;
  }

  goTo(name) {
    const SceneClass = this.scenes[name];

    if (!SceneClass) {
      console.error(`Scene not found: ${name}`);
      return;
    }

    this.game.root.innerHTML = "";
    this.currentScene = new SceneClass(this.game);
    this.currentScene.render();
  }
}
