export class Hospital {
  constructor(game) {
    this.game = game;
    this.dialogueIndex = 0;

    this.dialogue = [
      ["DOCTOR KIMURA", "Ah. You're awake."],
      ["DOCTOR KIMURA", "Coach Atlas?"],
      ["YOU", "..."],
      ["DOCTOR KIMURA", "Triangle?"],
      ["YOU", "..."],
      ["DOCTOR KIMURA", "Yeah. That checks out."],
      ["DOCTOR KIMURA", "Next time posture up. It usually works better than dying."],
      ["SYSTEM", "NEW TECHNIQUE LEARNED: POSTURE UP"],
      ["DOCTOR KIMURA", "Take this Aqua before you leave."],
      ["SYSTEM", "OBTAINED: AQUA x1"]
    ];
  }

  render() {
    this.unlockRewards();

    this.game.root.innerHTML = `
      <main class="hospital-screen">
        <section class="hospital-room">
          <h1>KIMURA MEMORIAL HOSPITAL</h1>

          <div class="hospital-map">
            <div class="hospital-bed">BED</div>
            <div class="doctor-kimura">DR<br>KIMURA</div>
            <div class="hospital-player">${this.game.state.player.name || "YOU"}</div>
            <button id="hospitalExit" class="hospital-exit">EXIT TO SPAZ ISLAND</button>
          </div>

          <div id="hospitalDialogue" class="hospital-dialogue"></div>
        </section>
      </main>
    `;

    this.showDialogue();

    document.addEventListener("keydown", this.keyHandler = (e) => {
      if (["Enter", " ", "ArrowRight"].includes(e.key)) this.nextDialogue();
    });

    this.game.root.addEventListener("click", this.clickHandler = () => this.nextDialogue());

    document.getElementById("hospitalExit").onclick = (e) => {
      e.stopPropagation();
      this.game.scenes.goTo("islandMap");
    };
  }

  unlockRewards() {
    const player = this.game.state.player;

    player.moves ??= [];
    player.items ??= {};

    if (!player.moves.includes("posture-up")) {
      player.moves.push("posture-up");
    }

    player.items.aqua = (player.items.aqua || 0) + 1;
  }

  showDialogue() {
    const box = document.getElementById("hospitalDialogue");
    const line = this.dialogue[this.dialogueIndex];

    if (!line) {
      box.innerHTML = `
        <p class="speaker">OBJECTIVE</p>
        <p>Leave the hospital and enter Spaz Island.</p>
      `;
      return;
    }

    box.innerHTML = `
      <p class="speaker">${line[0]}</p>
      <p>${line[1]}</p>
      <small>Click / tap / press Enter</small>
    `;
  }

  nextDialogue() {
    this.dialogueIndex += 1;
    this.showDialogue();
  }
}