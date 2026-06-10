export const CHARACTER_APPEARANCES = {
  coachAtlas: {
    name: "Coach Atlas",
    spriteType: "coach",
    spritePack: "black-gi-black-belt",
    body: "strong",
    height: "tall",
    hair: "bald",
    hairColor: "grey",
    face: "angry",
    glasses: "none",
    skin: "tan",
    beard: "full",
    outfit: "black-gi",
    belt: "black",
    rank: "black belt",
    hp: 100,
    stamina: 100
  },

  rivalKai: {
    name: "Kai",
    spriteType: "npc",
    spritePack: "blue-gi-purple-belt",
    body: "athletic",
    height: "medium",
    hair: "mohawk",
    hairColor: "black",
    face: "angry",
    glasses: "none",
    skin: "tan",
    beard: "stubble",
    outfit: "blue-gi",
    belt: "purple",
    rank: "purple belt",
    hp: 80,
    stamina: 90
  },

  studentMilo: {
    name: "Milo",
    spriteType: "npc",
    spritePack: "white-gi-white-belt",
    body: "small",
    height: "short",
    hair: "messy",
    hairColor: "blonde",
    face: "smile",
    glasses: "round",
    skin: "fair",
    beard: "none",
    outfit: "white-gi",
    belt: "white",
    rank: "white belt",
    hp: 45,
    stamina: 55
  },

  drGripps: {
    name: "Dr. Gripps",
    spriteType: "npc",
    spritePack: "doctor",
    body: "average",
    height: "medium",
    hair: "long",
    hairColor: "grey",
    face: "calm",
    glasses: "square",
    skin: "pale",
    beard: "goatee",
    outfit: "doctor",
    belt: "red",
    rank: "doctor",
    hp: 60,
    stamina: 40
  }
};

export function getCharacterAppearance(key) {
  const appearance = CHARACTER_APPEARANCES[key];

  if (!appearance) {
    console.warn(`Missing character appearance: ${key}`);
    return structuredClone(CHARACTER_APPEARANCES.playerDefault);
  }

  return structuredClone(appearance);
}

export function applyAppearanceDefaults(character, key = "playerDefault") {
  const defaults = CHARACTER_APPEARANCES[key] || CHARACTER_APPEARANCES.playerDefault;

  Object.entries(defaults).forEach(([field, value]) => {
    character[field] ??= value;
  });

  return character;
}