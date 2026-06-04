import { Game } from "./Game.js";

const gameRoot = document.getElementById("game");
const game = new Game(gameRoot);

game.start();
