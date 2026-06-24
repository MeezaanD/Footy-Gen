import { GeneratedSession, Sport } from "../types/session";
import { getFormatLabel } from "../utils/formatOptions";
import { shuffle } from "../utils/shuffle";

export type GenerateResult =
  | { success: false; message: string }
  | { success: true; session: GeneratedSession };

function createSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function buildSoccerTeams(players: string[]): GeneratedSession["teams"] {
  const half = players.length / 2;
  return [
    { name: "Team A", players: players.slice(0, half) },
    { name: "Team B", players: players.slice(half) },
  ];
}

function buildPadelTeams(players: string[]): GeneratedSession["teams"] {
  const teams: GeneratedSession["teams"] = [];
  const teamSize = 2;

  for (let i = 0; i < players.length; i += teamSize) {
    const courtIndex = Math.floor(i / 4) + 1;
    const sideIndex = Math.floor((i % 4) / teamSize);
    const sideLabel = sideIndex === 0 ? "Side A" : "Side B";
    const teamName = players.length === 4 ? `Team ${teams.length + 1}` : `Court ${courtIndex} — ${sideLabel}`;

    teams.push({
      name: teamName,
      players: players.slice(i, i + teamSize),
    });
  }

  return teams;
}

export function generateTeams(params: {
  sport: Sport;
  players: string[];
  formatPlayerCount: number;
  sessionName?: string;
}): GenerateResult {
  const { sport, players, formatPlayerCount, sessionName } = params;
  const formatLabel = getFormatLabel(sport, formatPlayerCount);

  if (players.length < formatPlayerCount) {
    return {
      success: false,
      message: `You need at least ${formatPlayerCount} players for ${formatLabel}.`,
    };
  }

  const selected = shuffle(players).slice(0, formatPlayerCount);
  const teams = sport === "soccer" ? buildSoccerTeams(selected) : buildPadelTeams(selected);

  const session: GeneratedSession = {
    id: createSessionId(),
    name: sessionName?.trim() || undefined,
    sport,
    formatLabel,
    playerCount: formatPlayerCount,
    teams,
    createdAt: new Date().toISOString(),
  };

  return { success: true, session };
}

export function getSessionDisplayName(session: GeneratedSession): string {
  if (session.name?.trim()) {
    return session.name.trim();
  }

  const sportLabel = session.sport === "soccer" ? "Soccer" : "Padel";
  return `${sportLabel} — ${session.formatLabel.split(" / ").pop() ?? session.formatLabel}`;
}
