export const SpriteRenderer = {
  draw(canvas, p) {
    if (!canvas || !p) return;

    const ctx = canvas.getContext("2d");

  const scale = 4;
  const spriteYOffset = 3;

  const px = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * scale, (y + spriteYOffset) * scale, w * scale, h * scale);
  };

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const skin = {
    pale: "#f0b88c",
    fair: "#d99a6c",
    tan: "#b8794f",
    brown: "#8d5635",
    dark: "#5a3424"
  }[p.skin] || "#f0b88c";

  const hairColor = {
    black: "#000000",
    brown: "#4a2412",
    blonde: "#e8c45c",
    red: "#b3422f",
    grey: "#9a9a9a"
  }[p.hairColor] || "#4a2412";

  const outfitKey = p.outfit === "gi" ? "white-gi" : p.outfit;

  const outfitColor = {
    naked: skin,
    "white-gi": "#ffffff",
    "blue-gi": "#2455d6",
    "black-gi": "#151515",
    rashguard: "#35e8ff",
    "gym-vest": "#ff2fa3",
    "gym-tee": "#35e8ff",
    hoodie: "#5a25ff",
    suit: "#101827",
    doctor: "#f5f5f5",
    striped: "#ffffff",
    casual: "#ff8a20"
  }[outfitKey] || "#ffffff";

  const outline = "#050510";
  const headOutline = p.hair === "bald" ? "#050510" : outline;
  const patch = "#e63946";
  const white = "#ffffff";

  const cx = Math.floor(canvas.width / scale / 2);

  const bodyW = {
    small: 13,
    average: 15,
    athletic: 16,
    strong: 17,
    heavy: 19
  }[p.body] || 15;

  const torsoH = {
    short: 13,
    medium: 15,
    tall: 17
  }[p.height] || 15;

  const legH = {
    short: 7,
    medium: 9,
    tall: 11
  }[p.height] || 9;

  const headW = 13;
  const headH = 12;
  const headX = cx - Math.floor(headW / 2);
  const headY = 2;

  const neckY = headY + headH;
  const bodyY = neckY + 1;
  const bodyX = cx - Math.floor(bodyW / 2);
  const beltY = bodyY + torsoH - 2;
  const legY = beltY + 2;
  const footY = legY + legH;

  const isGi = ["white-gi", "blue-gi", "black-gi"].includes(outfitKey);
  const isSleeveless = ["naked", "gym-vest"].includes(outfitKey);
  const armColor = isSleeveless ? skin : outfitColor;
  const lowerColor = outfitKey === "naked" ? skin : outfitColor;

  // Head
  px(headX, headY, headW, headH, headOutline);
  px(headX + 1, headY + 1, headW - 2, headH - 2, skin);

  // Ears
  px(headX - 1, headY + 5, 1, 3, skin);
  px(headX + headW, headY + 5, 1, 3, skin);

  // Hair
  if (p.hair !== "bald") {
    if (p.hair === "short") {
      px(headX, headY - 2, headW, 4, hairColor);
      px(headX - 1, headY, 3, 5, hairColor);
      px(headX + headW - 2, headY, 3, 5, hairColor);
    }

    if (p.hair === "messy") {
      px(headX, headY - 2, headW, 4, hairColor);
      px(headX + 1, headY - 4, 2, 3, hairColor);
      px(headX + 5, headY - 5, 3, 4, hairColor);
      px(headX + 10, headY - 4, 2, 3, hairColor);
      px(headX - 1, headY, 3, 5, hairColor);
      px(headX + headW - 2, headY, 3, 5, hairColor);
    }

    if (p.hair === "spiky") {
      px(headX, headY - 2, headW, 3, hairColor);
      px(headX + 1, headY - 5, 2, 4, hairColor);
      px(headX + 5, headY - 7, 3, 6, hairColor);
      px(headX + 10, headY - 5, 2, 4, hairColor);
      px(headX - 1, headY, 3, 5, hairColor);
      px(headX + headW - 2, headY, 3, 5, hairColor);
    }

    if (p.hair === "curly") {
      px(headX - 1, headY - 3, headW + 2, 4, hairColor);
      px(headX + 1, headY - 5, 3, 3, hairColor);
      px(headX + 5, headY - 6, 3, 3, hairColor);
      px(headX + 9, headY - 5, 3, 3, hairColor);
      px(headX - 1, headY, 3, 6, hairColor);
      px(headX + headW - 2, headY, 3, 6, hairColor);
    }

    if (p.hair === "long") {
      px(headX - 1, headY - 2, headW + 2, 4, hairColor);
      px(headX - 1, headY, 3, 12, hairColor);
      px(headX + headW - 2, headY, 3, 12, hairColor);
    }

    if (p.hair === "ponytail") {
      px(headX - 1, headY - 2, headW + 2, 4, hairColor);
      px(headX - 1, headY, 3, 6, hairColor);
      px(headX + headW - 2, headY, 3, 6, hairColor);
      px(headX + headW + 1, headY + 4, 3, 9, hairColor);
    }
  }

  // Face
  px(headX + 4, headY + 6, 1, 3, outline);
  px(headX + 8, headY + 6, 1, 3, outline);

  if (p.face === "calm") {
    px(headX + 3, headY + 7, 3, 1, outline);
    px(headX + 8, headY + 7, 3, 1, outline);
  }

  if (p.face === "serious") {
    px(headX + 3, headY + 5, 3, 1, outline);
    px(headX + 8, headY + 5, 3, 1, outline);
  }

  if (p.face === "smile") {
    px(headX + 5, headY + 10, 4, 1, outline);
  } else {
    px(headX + 6, headY + 10, 2, 1, outline);
  }

  if (p.face === "scar") {
    px(headX + 10, headY + 4, 1, 8, "#ff2fa3");
  }

  // Glasses
  if (p.glasses === "round") {
    px(headX + 2, headY + 5, 4, 4, outline);
    px(headX + 7, headY + 5, 4, 4, outline);
    px(headX + 6, headY + 6, 1, 1, outline);
    px(headX + 3, headY + 6, 2, 2, skin);
    px(headX + 8, headY + 6, 2, 2, skin);
  }

  if (p.glasses === "square") {
    px(headX + 2, headY + 5, 4, 3, outline);
    px(headX + 7, headY + 5, 4, 3, outline);
    px(headX + 6, headY + 5, 1, 1, outline);
  }

  if (p.glasses === "shades") {
    px(headX + 2, headY + 5, 9, 3, outline);
  }

  // Beard, moved lower
  const beardColor = p.hairColor === "black" ? "#000000" : hairColor;

  if (p.beard === "stubble") {
    px(headX + 3, headY + 10, 7, 1, beardColor);
  }

  if (p.beard === "goatee") {
    px(headX + 5, headY + 10, 3, 1, beardColor);
    px(headX + 5, headY + 11, 3, 3, beardColor);
  }

  if (p.beard === "full") {
    px(headX + 2, headY + 9, 9, 2, beardColor);
    px(headX + 3, headY + 11, 7, 3, beardColor);
    px(headX + 5, headY + 13, 3, 2, beardColor);
  }

  // Neck
  px(cx - 2, neckY, 4, 1, skin);

  // Body
  px(bodyX, bodyY, bodyW, torsoH, outline);
  px(bodyX + 1, bodyY + 1, bodyW - 2, torsoH - 2, outfitColor);

  // Arms attached
  const armW = 4;
  const armH = torsoH - 1;
  const leftArmX = bodyX - armW;
  const rightArmX = bodyX + bodyW;

  px(leftArmX, bodyY + 1, armW, armH, outline);
  px(rightArmX, bodyY + 1, armW, armH, outline);
  px(leftArmX + 1, bodyY + 2, armW - 1, armH - 3, armColor);
  px(rightArmX, bodyY + 2, armW - 1, armH - 3, armColor);

  // Outfit details
  if (outfitKey === "naked") {
    px(cx - 1, bodyY + 5, 2, 1, "#5a3424");
    px(cx - 3, bodyY + 8, 1, 1, "#5a3424");
    px(cx + 3, bodyY + 8, 1, 1, "#5a3424");
  }

  if (outfitKey === "gym-vest") {
    px(cx - 2, bodyY + 1, 4, torsoH - 3, skin);
  }

  if (outfitKey === "gym-tee") {
    px(cx - 3, bodyY + 3, 6, 2, white);
  }

  if (outfitKey === "casual") {
    px(bodyX + 1, bodyY + 1, bodyW - 2, 5, "#ffb020");
  }

  if (outfitKey === "striped") {
    for (let y = bodyY + 1; y < beltY; y += 3) {
      px(bodyX + 1, y, bodyW - 2, 1, "#35e8ff");
    }
  }

  if (isGi || outfitKey === "doctor") {
    px(cx - 4, bodyY + 1, 1, torsoH - 2, outline);
    px(cx + 3, bodyY + 1, 1, torsoH - 2, outline);
    px(cx, bodyY + 1, 1, torsoH - 2, white);
  }

  if (outfitKey === "suit") {
    px(cx - 2, bodyY + 1, 4, torsoH - 2, white);
    px(cx, bodyY + 3, 1, torsoH - 4, "#ff2fa3");
  }

  if (outfitKey === "doctor") {
    px(cx, bodyY + 3, 1, torsoH - 4, "#35e8ff");
    px(cx + 4, bodyY + 5, 1, 2, patch);
  }

  if (isGi) {
    px(cx, bodyY + 6, 3, 4, patch);
    px(bodyX, beltY, bodyW, 2, outline);
  }

  // Hands with bottom outline
  px(leftArmX + 1, beltY - 1, 3, 4, outline);
  px(rightArmX, beltY - 1, 3, 4, outline);

  px(leftArmX + 1, beltY - 1, 3, 3, skin);
  px(rightArmX, beltY - 1, 3, 3, skin);

  // Legs
  px(cx - 7, legY, 6, legH, outline);
  px(cx + 1, legY, 6, legH, outline);
  px(cx - 6, legY, 4, legH, lowerColor);
  px(cx + 2, legY, 4, legH, lowerColor);

  // Feet
  px(cx - 8, footY, 7, 3, outline);
  px(cx + 1, footY, 7, 3, outline);
}
};