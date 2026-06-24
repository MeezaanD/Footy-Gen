import { Sport } from "../types/session";

export type FormatOption = {
  playerCount: number;
  label: string;
};

export const SOCCER_FORMATS: FormatOption[] = [
  { playerCount: 10, label: "10 players / 5v5" },
  { playerCount: 12, label: "12 players / 6v6" },
  { playerCount: 14, label: "14 players / 7v7" },
  { playerCount: 22, label: "22 players / 11v11" },
];

export const PADEL_FORMATS: FormatOption[] = [
  { playerCount: 4, label: "4 players / 2v2" },
  { playerCount: 8, label: "8 players / 2 courts" },
  { playerCount: 12, label: "12 players / 3 courts" },
  { playerCount: 16, label: "16 players / 4 courts" },
];

export function getFormatsForSport(sport: Sport): FormatOption[] {
  return sport === "soccer" ? SOCCER_FORMATS : PADEL_FORMATS;
}

export function getDefaultFormatPlayerCount(sport: Sport): number {
  return sport === "soccer" ? 10 : 4;
}

export function getFormatLabel(sport: Sport, playerCount: number): string {
  const formats = getFormatsForSport(sport);
  return formats.find((format) => format.playerCount === playerCount)?.label ?? `${playerCount} players`;
}
