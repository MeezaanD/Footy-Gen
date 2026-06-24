export type PlayerValidationResult =
  | { valid: false; message: string }
  | { valid: true; value: string };

export function validatePlayerName(name: string, players: string[]): PlayerValidationResult {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, message: "Enter a player name." };
  }

  if (trimmed.length > 30) {
    return { valid: false, message: "Name is too long (max 30 chars)." };
  }

  if (players.some((player) => player.toLowerCase() === trimmed.toLowerCase())) {
    return { valid: false, message: "That player already exists." };
  }

  return { valid: true, value: trimmed };
}
