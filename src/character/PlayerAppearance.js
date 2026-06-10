export const DEFAULT_PLAYER_APPEARANCE = {
  name: "Rookie",
  body: "average",
  height: "medium",
  hair: "short",
  hairColor: "brown",
  face: "focused",
  glasses: "none",
  skin: "fair",
  beard: "none",
  outfit: "white-gi",
  belt: "white",
  spritePack: "white-gi-white-belt",
  level: 1,
  xp: 0
};

export function applyDefaultAppearance(player) {
  Object.entries(DEFAULT_PLAYER_APPEARANCE).forEach(([key, value]) => {
    player[key] ??= value;
  });

  return player;
}
