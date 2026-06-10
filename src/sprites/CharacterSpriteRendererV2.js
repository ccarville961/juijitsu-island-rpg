import { loadSpriteImage } from "./SpriteLoader.js";

export const CharacterSpriteRendererV2 = {
  frameWidth: 96,
  frameHeight: 128,

  getAnimationPath(character, animation = "idle") {
    const type = character?.spriteType || "player";
    const pack = character?.spritePack || "white-gi-white-belt";

    if (type === "coach") {
      return `./src/assets/sprites/characters/coach-atlas/${pack}/${animation}.png`;
    }

    if (type === "npc") {
      return `./src/assets/sprites/characters/npc/${pack}/${animation}.png`;
    }

    return `./src/assets/sprites/characters/player/${pack}/${animation}.png`;
  },

  getBodyScale(character) {
    return {
      widthScale: {
        small: 0.88,
        average: 1,
        athletic: 1.06,
        strong: 1.14,
        heavy: 1.22
      }[character?.body] || 1,

      heightScale: {
        short: 0.9,
        medium: 1,
        tall: 1.12
      }[character?.height] || 1
    };
  },

  getTintColours(character) {
    return {
      hair: {
        black: "#111111",
        brown: "#5a2d16",
        blonde: "#e3b84c",
        red: "#b83a28",
        grey: "#9a9a9a",
        pink: "#ff4fb3"
      }[character?.hairColor] || "#5a2d16",

      skin: {
        pale: "#f0b88c",
        fair: "#d99a6c",
        tan: "#b8794f",
        brown: "#8d5635",
        dark: "#5a3424"
      }[character?.skin] || "#b8794f"
    };
  },

  recolourSprite(sourceCanvas, character) {
    const ctx = sourceCanvas.getContext("2d", {
      willReadFrequently: true
    });

    const imageData = ctx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
    const data = imageData.data;
    const tint = this.getTintColours(character);
    const skinRGB = this.hexToRgb(tint.skin);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a === 0) continue;

      if (this.isSkinPixel(r, g, b)) {
        const shade = this.getBrightness(r, g, b);

        data[i] = skinRGB.r * shade;
        data[i + 1] = skinRGB.g * shade;
        data[i + 2] = skinRGB.b * shade;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  },

  isSkinPixel(r, g, b) {
    const isTooWhiteForSkin = r > 215 && g > 200 && b > 175;

    if (isTooWhiteForSkin) return false;

    return (
      r >= 90 &&
      r <= 245 &&
      g >= 55 &&
      g <= 190 &&
      b >= 30 &&
      b <= 135 &&
      r > g + 18 &&
      g > b + 10
    );
  },

  getBrightness(r, g, b) {
    const brightness = (r + g + b) / 3 / 160;
    return Math.max(0.55, Math.min(1.35, brightness));
  },

  hexToRgb(hex) {
    const clean = hex.replace("#", "");

    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16)
    };
  },

  getBodyAnchorY(sourceCanvas) {
    const ctx = sourceCanvas.getContext("2d", {
      willReadFrequently: true
    });

    const imageData = ctx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
    const data = imageData.data;

    for (let y = 56; y <= 72; y++) {
      let solidPixels = 0;

      for (let x = 34; x <= 62; x++) {
        const alpha = data[(y * sourceCanvas.width + x) * 4 + 3];
        if (alpha > 20) solidPixels++;
      }

      if (solidPixels >= 12) {
        return y - 8;
      }
    }

    return 48;
  },

  drawCustomHead(sourceCanvas, character, frame = 0) {
    const ctx = sourceCanvas.getContext("2d", {
      willReadFrequently: true
    });

    const tint = this.getTintColours(character);

    const skin = tint.skin;
    const hair = tint.hair;
    const outline = "#050510";
    const scar = "#ff2fa3";

    const px = (x, y, w, h, colour) => {
      ctx.fillStyle = colour;
      ctx.fillRect(x, y, w, h);
    };

    const hairStyle = character?.hair || "short";
    const face = character?.face || "focused";
    const beard = character?.beard || "none";
    const glasses = character?.glasses || "none";

    ctx.clearRect(14, 0, 72, 56);

    const neckY = this.getBodyAnchorY(sourceCanvas);
    const headX = 35;
    const headY = neckY - 24;

    px(42, neckY, 14, 12, outline);
    px(45, neckY, 8, 11, skin);

    px(39, neckY + 8, 20, 5, outline);
    px(43, neckY + 8, 12, 4, skin);

    px(headX, headY, 28, 28, outline);
    px(headX + 2, headY + 2, 24, 25, skin);

    px(headX + 4, headY + 3, 16, 5, "rgba(255,255,255,0.22)");
    px(headX + 5, headY + 21, 18, 5, "rgba(0,0,0,0.22)");

    px(headX - 4, headY + 11, 5, 11, outline);
    px(headX + 27, headY + 11, 5, 11, outline);
    px(headX - 3, headY + 12, 3, 8, skin);
    px(headX + 27, headY + 12, 3, 8, skin);

    if (hairStyle !== "bald") {
      if (hairStyle === "short") {
        px(headX - 2, headY - 7, 32, 10, outline);
        px(headX, headY - 8, 28, 8, hair);
        px(headX + 3, headY - 10, 8, 5, hair);
        px(headX + 13, headY - 11, 8, 5, hair);
        px(headX + 22, headY - 9, 5, 5, hair);
        px(headX - 3, headY - 1, 6, 11, outline);
        px(headX + 26, headY, 5, 10, outline);
        px(headX - 1, headY, 3, 8, hair);
        px(headX + 27, headY + 1, 3, 7, hair);
      }

      if (hairStyle === "messy") {
        px(headX - 3, headY - 9, 34, 13, outline);
        px(headX, headY - 14, 7, 9, hair);
        px(headX + 8, headY - 17, 8, 12, hair);
        px(headX + 18, headY - 14, 9, 9, hair);
        px(headX - 1, headY - 8, 30, 10, hair);
        px(headX - 4, headY - 1, 7, 15, hair);
        px(headX + 26, headY, 6, 14, hair);
      }

      if (hairStyle === "spiky") {
        px(headX - 3, headY - 8, 34, 10, outline);
        px(headX + 1, headY - 18, 5, 13, hair);
        px(headX + 10, headY - 22, 7, 17, hair);
        px(headX + 21, headY - 18, 5, 13, hair);
        px(headX - 1, headY - 7, 30, 8, hair);
        px(headX - 3, headY, 6, 13, hair);
        px(headX + 26, headY, 5, 12, hair);
      }

      if (hairStyle === "curly") {
        px(headX - 4, headY - 9, 36, 13, outline);
        px(headX - 2, headY - 14, 8, 8, hair);
        px(headX + 6, headY - 17, 8, 8, hair);
        px(headX + 15, headY - 16, 8, 8, hair);
        px(headX + 24, headY - 13, 7, 7, hair);
        px(headX - 2, headY - 8, 31, 10, hair);
        px(headX - 5, headY, 8, 16, hair);
        px(headX + 26, headY, 7, 15, hair);
      }

      if (hairStyle === "long") {
        px(headX - 5, headY - 9, 38, 13, outline);
        px(headX - 6, headY - 1, 9, 35, outline);
        px(headX + 26, headY - 1, 9, 35, outline);
        px(headX - 3, headY - 8, 32, 10, hair);
        px(headX - 4, headY + 1, 6, 30, hair);
        px(headX + 28, headY + 1, 5, 30, hair);
      }

      if (hairStyle === "ponytail") {
        px(headX - 3, headY - 9, 34, 13, outline);
        px(headX + 27, headY + 4, 10, 28, outline);
        px(headX - 1, headY - 8, 30, 10, hair);
        px(headX + 29, headY + 6, 6, 24, hair);
        px(headX - 3, headY, 6, 14, hair);
        px(headX + 25, headY, 5, 14, hair);
      }

      if (hairStyle === "mullet") {
        px(headX - 3, headY - 8, 34, 12, outline);
        px(headX - 3, headY + 3, 8, 24, outline);
        px(headX + 24, headY + 3, 8, 24, outline);
        px(headX + 6, headY + 20, 18, 13, outline);
        px(headX - 1, headY - 9, 30, 10, hair);
        px(headX + 4, headY - 12, 8, 6, hair);
        px(headX + 15, headY - 13, 8, 7, hair);
        px(headX - 1, headY + 4, 5, 20, hair);
        px(headX + 26, headY + 4, 4, 20, hair);
        px(headX + 8, headY + 22, 14, 9, hair);
      }

      if (hairStyle === "mohawk") {
        px(headX + 9, headY - 22, 11, 25, outline);
        px(headX + 11, headY - 24, 7, 26, hair);
        px(headX - 3, headY - 1, 7, 13, outline);
        px(headX + 25, headY - 1, 7, 13, outline);
        px(headX - 1, headY, 4, 10, hair);
        px(headX + 27, headY, 3, 10, hair);
      }
    }

    px(headX + 4, headY + 8, 21, 19, skin);

    if (face === "calm") {
      px(headX + 6, headY + 13, 7, 2, outline);
      px(headX + 17, headY + 13, 7, 2, outline);
      px(headX + 11, headY + 24, 8, 1, outline);
    }

    if (face === "focused") {
      px(headX + 6, headY + 9, 8, 2, outline);
      px(headX + 17, headY + 9, 8, 2, outline);
      px(headX + 8, headY + 13, 3, 4, outline);
      px(headX + 19, headY + 13, 3, 4, outline);
      px(headX + 10, headY + 24, 10, 2, outline);
    }

    if (face === "angry") {
      px(headX + 5, headY + 8, 9, 3, outline);
      px(headX + 16, headY + 8, 9, 3, outline);
      px(headX + 6, headY + 10, 8, 2, outline);
      px(headX + 16, headY + 10, 8, 2, outline);
      px(headX + 8, headY + 13, 4, 5, outline);
      px(headX + 19, headY + 13, 4, 5, outline);
      px(headX + 9, headY + 24, 13, 3, outline);
      px(headX + 11, headY + 23, 9, 1, outline);
    }

    if (face === "serious") {
      px(headX + 5, headY + 8, 10, 2, outline);
      px(headX + 16, headY + 8, 10, 2, outline);
      px(headX + 8, headY + 12, 4, 5, outline);
      px(headX + 19, headY + 12, 4, 5, outline);
      px(headX + 9, headY + 24, 12, 3, outline);
    }

    if (face === "smile") {
      px(headX + 7, headY + 12, 3, 4, outline);
      px(headX + 19, headY + 12, 3, 4, outline);
      px(headX + 9, headY + 22, 13, 4, outline);
      px(headX + 11, headY + 22, 9, 2, "#fffbe0");
    }

    if (face === "scar") {
      px(headX + 7, headY + 12, 3, 4, outline);
      px(headX + 19, headY + 12, 3, 4, outline);
      px(headX + 10, headY + 24, 10, 2, outline);
      px(headX + 22, headY + 5, 3, 20, scar);
      px(headX + 21, headY + 9, 5, 2, scar);
    }

    px(headX + 13, headY + 16, 3, 6, "rgba(0,0,0,0.35)");

    if (beard === "stubble") {
      px(headX + 6, headY + 21, 18, 5, "rgba(0,0,0,0.35)");
    }

    if (beard === "goatee") {
      px(headX + 11, headY + 22, 8, 3, hair);
      px(headX + 12, headY + 25, 6, 5, hair);
    }

    if (beard === "full") {
      px(headX + 4, headY + 19, 22, 10, outline);
      px(headX + 6, headY + 20, 18, 8, hair);
      px(headX + 10, headY + 27, 10, 5, hair);
    }

    if (glasses === "round") {
      px(headX + 4, headY + 11, 8, 7, outline);
      px(headX + 16, headY + 11, 8, 7, outline);
      px(headX + 7, headY + 13, 3, 3, "rgba(255,255,255,0.4)");
      px(headX + 19, headY + 13, 3, 3, "rgba(255,255,255,0.4)");
      px(headX + 12, headY + 13, 4, 1, outline);
    }

    if (glasses === "square") {
      px(headX + 4, headY + 11, 9, 6, outline);
      px(headX + 16, headY + 11, 9, 6, outline);
      px(headX + 7, headY + 13, 4, 2, "rgba(255,255,255,0.4)");
      px(headX + 19, headY + 13, 4, 2, "rgba(255,255,255,0.4)");
      px(headX + 13, headY + 13, 3, 1, outline);
    }

    if (glasses === "shades") {
      px(headX + 4, headY + 11, 21, 7, outline);
      px(headX + 6, headY + 12, 7, 5, "#111111");
      px(headX + 16, headY + 12, 7, 5, "#111111");
    }
  },

  async draw(canvas, character, options = {}) {
    if (!canvas || !character) return;

    const ctx = canvas.getContext("2d");
    const animation = options.animation || "idle";

    const rawFrame = options.frame || 0;
    const frame = animation === "walk" ? rawFrame : 0;

    const frameWidth = options.frameWidth || this.frameWidth;
    const frameHeight = options.frameHeight || this.frameHeight;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const image = await loadSpriteImage(this.getAnimationPath(character, animation));

    if (!image) {
      this.drawMissing(canvas);
      return;
    }

    const totalFrames = Math.floor(image.width / frameWidth);
    const safeFrame = Math.max(0, Math.min(totalFrames - 1, frame));

    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = frameWidth;
    sourceCanvas.height = frameHeight;

    const sourceCtx = sourceCanvas.getContext("2d");
    sourceCtx.imageSmoothingEnabled = false;

    sourceCtx.drawImage(
      image,
      safeFrame * frameWidth,
      0,
      frameWidth,
      frameHeight,
      0,
      0,
      frameWidth,
      frameHeight
    );

    this.recolourSprite(sourceCanvas, character);
    this.drawCustomHead(sourceCanvas, character, safeFrame);

    const { widthScale, heightScale } = this.getBodyScale(character);

    const drawWidth = canvas.width * widthScale;
    const drawHeight = canvas.height * heightScale;
    const drawX = (canvas.width - drawWidth) / 2;
    const drawY = canvas.height - drawHeight;

    ctx.drawImage(
      sourceCanvas,
      0,
      0,
      frameWidth,
      frameHeight,
      drawX,
      drawY,
      drawWidth,
      drawHeight
    );
  },

  async toDataUrl(character, options = {}) {
    const canvas = document.createElement("canvas");

    canvas.width = options.width || 192;
    canvas.height = options.height || 256;

    await this.draw(canvas, character, {
      animation: options.animation || "idle",
      frame: options.frame || 0
    });

    return canvas.toDataURL("image/png");
  },

  drawMissing(canvas) {
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ff2fa3";
    ctx.font = "16px monospace";
    ctx.textAlign = "center";

    ctx.fillText("MISSING", canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillText("SPRITE", canvas.width / 2, canvas.height / 2 + 14);
  }
};