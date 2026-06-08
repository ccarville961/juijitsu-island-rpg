export function renderGameControls() {
  return `
    <section class="game-controls">
      <div class="dpad">
        <button id="upBtn" class="dpad-up">▲</button>
        <button id="leftBtn" class="dpad-left">◀</button>
        <button id="rightBtn" class="dpad-right">▶</button>
        <button id="downBtn" class="dpad-down">▼</button>
      </div>

      <div class="action-grid">
        <button id="actionBtn">ACTION</button>
        <button id="confirmBtn">CONFIRM</button>
        <button id="saveBtn">SAVE</button>
        <button id="exitBtn">EXIT</button>
      </div>
    </section>
  `;
}