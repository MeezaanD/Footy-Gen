export type Sport = "soccer" | "padel";

export type GeneratedSession = {
  id: string;
  name?: string;
  sport: Sport;
  formatLabel: string;
  playerCount: number;
  teams: {
    name: string;
    players: string[];
  }[];
  createdAt: string;
};

export type SportDraft = {
  players: string[];
  sessionName?: string;
  formatPlayerCount: number;
};

export type DraftState = {
  soccer: SportDraft;
  padel: SportDraft;
};
