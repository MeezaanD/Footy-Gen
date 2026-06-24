import AsyncStorage from "@react-native-async-storage/async-storage";

import { DraftState, GeneratedSession, Sport, SportDraft } from "../types/session";
import { getDefaultFormatPlayerCount } from "../utils/formatOptions";

const SESSIONS_KEY = "nextup_sessions_v1";
const DRAFT_KEY = "nextup_draft_v1";
const LEGACY_PLAYERS_KEY = "football_players";

function createDefaultSportDraft(sport: Sport): SportDraft {
  return {
    players: [],
    sessionName: undefined,
    formatPlayerCount: getDefaultFormatPlayerCount(sport),
  };
}

export function createDefaultDraftState(): DraftState {
  return {
    soccer: createDefaultSportDraft("soccer"),
    padel: createDefaultSportDraft("padel"),
  };
}

function isValidSportDraft(value: unknown, sport: Sport): value is SportDraft {
  if (!value || typeof value !== "object") {
    return false;
  }

  const draft = value as SportDraft;
  const formats = sport === "soccer" ? [10, 12, 14, 22] : [4, 8, 12, 16];

  return (
    Array.isArray(draft.players) &&
    draft.players.every((player) => typeof player === "string") &&
    formats.includes(draft.formatPlayerCount) &&
    (draft.sessionName === undefined || typeof draft.sessionName === "string")
  );
}

export async function loadSessions(): Promise<GeneratedSession[]> {
  try {
    const raw = await AsyncStorage.getItem(SESSIONS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as GeneratedSession[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (session) =>
        typeof session?.id === "string" &&
        (session.sport === "soccer" || session.sport === "padel") &&
        Array.isArray(session.teams),
    );
  } catch {
    await AsyncStorage.removeItem(SESSIONS_KEY);
    return [];
  }
}

export async function saveSession(session: GeneratedSession): Promise<void> {
  const sessions = await loadSessions();
  const updated = [session, ...sessions.filter((item) => item.id !== session.id)];
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
}

export async function getSessionById(id: string): Promise<GeneratedSession | null> {
  const sessions = await loadSessions();
  return sessions.find((session) => session.id === id) ?? null;
}

export async function deleteSession(id: string): Promise<void> {
  const sessions = await loadSessions();
  await AsyncStorage.setItem(
    SESSIONS_KEY,
    JSON.stringify(sessions.filter((session) => session.id !== id)),
  );
}

export async function clearAllSessions(): Promise<void> {
  await AsyncStorage.removeItem(SESSIONS_KEY);
}

async function migrateLegacyPlayers(draft: DraftState): Promise<DraftState> {
  if (draft.soccer.players.length > 0) {
    return draft;
  }

  try {
    const legacyRaw = await AsyncStorage.getItem(LEGACY_PLAYERS_KEY);
    if (!legacyRaw) {
      return draft;
    }

    const parsed = JSON.parse(legacyRaw) as { name: string }[];
    if (!Array.isArray(parsed)) {
      return draft;
    }

    const names = parsed
      .map((player) => player?.name)
      .filter((name): name is string => typeof name === "string" && name.trim().length > 0);

    if (names.length === 0) {
      return draft;
    }

    return {
      ...draft,
      soccer: {
        ...draft.soccer,
        players: names,
      },
    };
  } catch {
    return draft;
  }
}

export async function loadDraftState(): Promise<DraftState> {
  let draft = createDefaultDraftState();

  try {
    const raw = await AsyncStorage.getItem(DRAFT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DraftState>;
      if (parsed.soccer && isValidSportDraft(parsed.soccer, "soccer")) {
        draft.soccer = parsed.soccer;
      }
      if (parsed.padel && isValidSportDraft(parsed.padel, "padel")) {
        draft.padel = parsed.padel;
      }
    }
  } catch {
    draft = createDefaultDraftState();
  }

  draft = await migrateLegacyPlayers(draft);
  return draft;
}

export async function saveDraftState(draft: DraftState): Promise<void> {
  await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}
