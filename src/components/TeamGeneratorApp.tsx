import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import {
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    TrashIcon,
    UserPlusIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState, type FormEvent } from "react";

type Player = {
    name: string;
};

type TeamResult = {
    home: Player[];
    away: Player[];
};

type AppSettings = {
    defaultMatchSize: number;
    reducedMotion: boolean;
};

type PlayerValidationResult =
    | { valid: false; message: string }
    | { valid: true; value: string };

const STORAGE_PLAYERS_KEY = "football_players";
const STORAGE_SETTINGS_KEY = "footy_settings_v1";
const MATCH_OPTIONS = [10, 12, 14, 22];

const defaultSettings: AppSettings = {
    defaultMatchSize: 10,
    reducedMotion: false,
};

function shufflePlayers(players: Player[]) {
    const shuffled = [...players];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function validatePlayerName(name: string, players: Player[]): PlayerValidationResult {
    const trimmed = name.trim();
    if (!trimmed) {
        return { valid: false, message: "Enter a player name." };
    }

    if (trimmed.length > 30) {
        return { valid: false, message: "Name is too long (max 30 chars)." };
    }

    if (players.some((player) => player.name.toLowerCase() === trimmed.toLowerCase())) {
        return { valid: false, message: "That player already exists." };
    }

    return { valid: true, value: trimmed };
}

export default function TeamGeneratorApp() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [nameInput, setNameInput] = useState("");
    const [matchSize, setMatchSize] = useState(10);
    const [teams, setTeams] = useState<TeamResult | null>(null);
    const [flashMessage, setFlashMessage] = useState<string>("");
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
    const [showTeamsModal, setShowTeamsModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [settings, setSettings] = useState<AppSettings>(defaultSettings);

    const squadCount = useMemo(() => players.length, [players]);

    useEffect(() => {
        const savedPlayers = localStorage.getItem(STORAGE_PLAYERS_KEY);
        if (savedPlayers) {
            try {
                const parsed = JSON.parse(savedPlayers) as Player[];
                if (Array.isArray(parsed)) {
                    setPlayers(parsed.filter((player) => typeof player?.name === "string"));
                }
            } catch {
                localStorage.removeItem(STORAGE_PLAYERS_KEY);
            }
        }

        const savedSettings = localStorage.getItem(STORAGE_SETTINGS_KEY);
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings) as AppSettings;
                if (MATCH_OPTIONS.includes(parsed.defaultMatchSize)) {
                    setSettings(parsed);
                    setMatchSize(parsed.defaultMatchSize);
                }
            } catch {
                localStorage.removeItem(STORAGE_SETTINGS_KEY);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_PLAYERS_KEY, JSON.stringify(players));
    }, [players]);

    useEffect(() => {
        localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
        document.documentElement.style.setProperty(
            "scroll-behavior",
            settings.reducedMotion ? "auto" : "smooth",
        );
    }, [settings]);

    useEffect(() => {
        if (!flashMessage) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setFlashMessage("");
        }, 2200);

        return () => window.clearTimeout(timeout);
    }, [flashMessage]);

    const addPlayer = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validation = validatePlayerName(nameInput, players);

        if (validation.valid === false) {
            setFlashMessage(validation.message);
            return;
        }

        const validatedName = validation.value;
        setPlayers((current) => [...current, { name: validatedName }]);
        setNameInput("");
        setFlashMessage("Player added.");
    };

    const confirmDeletePlayer = () => {
        if (deleteIndex === null) {
            return;
        }

        setPlayers((current) => current.filter((_, index) => index !== deleteIndex));
        setDeleteIndex(null);
        setTeams(null);
        setFlashMessage("Player removed.");
    };

    const clearSquad = () => {
        setPlayers([]);
        setTeams(null);
        setShowTeamsModal(false);
        setFlashMessage("Squad cleared.");
    };

    const generateTeams = () => {
        if (players.length < matchSize) {
            setFlashMessage(`You need at least ${matchSize} players for this match size.`);
            return;
        }

        const shuffled = shufflePlayers(players).slice(0, matchSize);
        const split = matchSize / 2;

        setTeams({
            home: shuffled.slice(0, split),
            away: shuffled.slice(split),
        });
        setShowTeamsModal(true);
    };

    const saveSettings = (newSettings: AppSettings) => {
        setSettings(newSettings);
        setMatchSize(newSettings.defaultMatchSize);
        setShowSettingsModal(false);
        setFlashMessage("Settings saved.");
    };

    return (
        <main className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-10">
            <section className="panel rounded-3xl p-4 sm:p-6 lg:p-8">
                <header className="mb-5 flex items-center justify-between gap-3">
                    <div>
                        <h1 className="brand-title text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
                            Footy-Gen
                        </h1>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowSettingsModal(true)}
                        className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-fuchsia-100/25 bg-[#2a0049]/70 px-4 text-sm font-semibold text-fuchsia-50 transition hover:bg-[#4a007a]/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ff87]"
                    >
                        <Cog6ToothIcon className="size-5" />
                        <span className="hidden sm:inline">Settings</span>
                        <QuestionMarkCircleIcon className="size-5" />
                    </button>
                </header>

                <form onSubmit={addPlayer} className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row">
                    <label className="sr-only" htmlFor="player-name">
                        Player name
                    </label>
                    <input
                        id="player-name"
                        value={nameInput}
                        onChange={(event) => setNameInput(event.target.value)}
                        maxLength={30}
                        placeholder="Enter player name..."
                        className="min-h-12 w-full rounded-2xl border border-fuchsia-50/30 bg-[#25003f]/60 px-4 text-base text-fuchsia-50 placeholder:text-fuchsia-100/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ff87]"
                    />
                    <button
                        type="submit"
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#00ff87] to-[#04f5ff] px-5 font-bold text-[#37003c] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fdfdfd]"
                    >
                        <UserPlusIcon className="size-5" />
                        Add
                    </button>
                </form>

                <section className="mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-[1fr_auto_auto]">
                    <label className="flex flex-col gap-2 text-sm text-fuchsia-100">
                        Match size
                        <select
                            value={matchSize}
                            onChange={(event) => setMatchSize(Number(event.target.value))}
                            className="min-h-12 rounded-xl border border-fuchsia-100/30 bg-[#25003f]/60 px-3 font-semibold text-fuchsia-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ff87]"
                        >
                            {MATCH_OPTIONS.map((option) => (
                                <option value={option} key={option}>
                                    {option} players ({option / 2}v{option / 2})
                                </option>
                            ))}
                        </select>
                    </label>

                    <button
                        type="button"
                        onClick={generateTeams}
                        className="min-h-12 rounded-xl bg-gradient-to-r from-[#e90052] to-[#ff2882] px-5 font-bold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ff87]"
                    >
                        Kick Off
                    </button>

                    <button
                        type="button"
                        onClick={clearSquad}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-red-300/35 bg-red-950/45 px-5 font-semibold text-red-100 transition hover:bg-red-900/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-200"
                    >
                        <TrashIcon className="size-5" />
                        Clear
                    </button>
                </section>

                <section>
                    <h2 className="mb-3 text-lg font-bold text-fuchsia-50">Squad List ({squadCount})</h2>
                    <ul className="soft-scrollbar max-h-72 space-y-2 overflow-y-auto rounded-2xl border border-fuchsia-100/20 bg-[#25003f]/45 p-3 sm:max-h-80">
                        {players.length === 0 ? (
                            <li className="rounded-xl border border-dashed border-fuchsia-100/25 p-4 text-center text-fuchsia-100/75">
                                No players on the pitch yet.
                            </li>
                        ) : (
                            players.map((player, index) => (
                                <li
                                    key={`${player.name}-${index}`}
                                    className="flex items-center justify-between gap-3 rounded-xl border border-fuchsia-100/20 bg-[#3a0068]/45 px-3 py-2"
                                >
                                    <span className="font-semibold text-fuchsia-50">{player.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => setDeleteIndex(index)}
                                        aria-label={`Remove ${player.name}`}
                                        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-red-300/35 bg-red-900/55 text-red-100 transition hover:bg-red-800/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-200"
                                    >
                                        <XMarkIcon className="size-5" />
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </section>

                <p
                    aria-live="polite"
                    className="mt-4 min-h-6 rounded-lg px-2 text-sm text-fuchsia-100"
                >
                    {flashMessage}
                </p>
            </section>

            <DeletePlayerModal
                open={deleteIndex !== null}
                playerName={deleteIndex === null ? "" : players[deleteIndex]?.name ?? "this player"}
                onClose={() => setDeleteIndex(null)}
                onConfirm={confirmDeletePlayer}
            />

            <TeamsModal
                open={showTeamsModal}
                onClose={() => setShowTeamsModal(false)}
                teams={teams}
                reducedMotion={settings.reducedMotion}
            />

            <SettingsModal
                open={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                settings={settings}
                onSave={saveSettings}
            />
        </main>
    );
}

type DeletePlayerModalProps = {
    open: boolean;
    playerName: string;
    onClose: () => void;
    onConfirm: () => void;
};

function DeletePlayerModal({ open, playerName, onClose, onConfirm }: DeletePlayerModalProps) {
    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-[#160025]/80 backdrop-blur-sm" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="panel w-full max-w-sm rounded-2xl p-5">
                    <DialogTitle className="text-xl font-bold text-fuchsia-50">Remove player?</DialogTitle>
                    <p className="mt-3 text-fuchsia-100">
                        Remove <strong className="text-white">{playerName}</strong> from the squad list?
                    </p>
                    <div className="mt-5 flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="min-h-11 flex-1 rounded-xl border border-fuchsia-100/25 bg-[#2a0049]/70 px-4 font-semibold text-fuchsia-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="min-h-11 flex-1 rounded-xl bg-red-600 px-4 font-semibold text-white"
                        >
                            Remove
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

type TeamsModalProps = {
    open: boolean;
    teams: TeamResult | null;
    onClose: () => void;
    reducedMotion: boolean;
};

function TeamsModal({ open, teams, onClose, reducedMotion }: TeamsModalProps) {
    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-[#160025]/80 backdrop-blur-sm" />
            <div className="fixed inset-0 overflow-y-auto p-3 sm:p-6">
                <div className="flex min-h-full items-center justify-center">
                    <DialogPanel className="panel w-full max-w-3xl rounded-3xl p-4 sm:p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <DialogTitle className="brand-title text-2xl font-extrabold uppercase text-fuchsia-50 sm:text-3xl">
                                Match Ready
                            </DialogTitle>
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-fuchsia-100/25 bg-[#2a0049]/70"
                            >
                                <XMarkIcon className="size-5 text-fuchsia-100" />
                            </button>
                        </div>

                        {!teams ? (
                            <p className="rounded-xl border border-fuchsia-100/25 bg-[#2a0049]/70 p-4 text-fuchsia-100">
                                Generate teams first.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <TeamCard
                                    title="Home Team"
                                    players={teams.home}
                                    reducedMotion={reducedMotion}
                                />
                                <TeamCard
                                    title="Away Team"
                                    players={teams.away}
                                    reducedMotion={reducedMotion}
                                />
                            </div>
                        )}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}

type TeamCardProps = {
    title: string;
    players: Player[];
    reducedMotion: boolean;
};

function TeamCard({ title, players, reducedMotion }: TeamCardProps) {
    return (
        <section className="rounded-2xl border border-fuchsia-100/25 bg-[#2a0049]/70 p-4">
            <h3 className="mb-3 text-center text-lg font-bold uppercase tracking-wide text-[#00ff87]">{title}</h3>
            <ul className="space-y-2">
                {players.map((player, index) => (
                    <li
                        key={`${title}-${player.name}-${index}`}
                        className="rounded-lg border border-fuchsia-100/20 bg-[#3a0068]/50 px-3 py-2 font-semibold text-fuchsia-50"
                        style={
                            reducedMotion
                                ? undefined
                                : {
                                    opacity: 0,
                                    transform: "translateY(10px)",
                                    animation: `fade-up 340ms ease forwards ${index * 70}ms`,
                                }
                        }
                    >
                        {player.name}
                    </li>
                ))}
            </ul>
        </section>
    );
}

type SettingsModalProps = {
    open: boolean;
    settings: AppSettings;
    onClose: () => void;
    onSave: (settings: AppSettings) => void;
};

function SettingsModal({ open, settings, onClose, onSave }: SettingsModalProps) {
    const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

    useEffect(() => {
        if (open) {
            setLocalSettings(settings);
        }
    }, [open, settings]);

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-[#160025]/80 backdrop-blur-sm" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="panel w-full max-w-md rounded-2xl p-5">
                    <DialogTitle className="text-xl font-bold text-fuchsia-50">Settings and Help</DialogTitle>

                    <div className="mt-4 space-y-4">
                        <label className="block text-sm text-fuchsia-100">
                            Default match size
                            <select
                                value={localSettings.defaultMatchSize}
                                onChange={(event) =>
                                    setLocalSettings((current) => ({
                                        ...current,
                                        defaultMatchSize: Number(event.target.value),
                                    }))
                                }
                                className="mt-2 min-h-11 w-full rounded-xl border border-fuchsia-100/30 bg-[#25003f]/60 px-3 text-fuchsia-50"
                            >
                                {MATCH_OPTIONS.map((option) => (
                                    <option key={`setting-${option}`} value={option}>
                                        {option} players
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex items-center gap-3 rounded-xl border border-fuchsia-100/25 bg-[#2a0049]/65 p-3 text-sm text-fuchsia-100">
                            <input
                                type="checkbox"
                                checked={localSettings.reducedMotion}
                                onChange={(event) =>
                                    setLocalSettings((current) => ({
                                        ...current,
                                        reducedMotion: event.target.checked,
                                    }))
                                }
                                className="size-4 accent-[#00ff87]"
                            />
                            Reduce motion animations
                        </label>

                        <p className="text-sm text-fuchsia-100/85">
                            Tips: add at least enough players for your selected match size, then tap Kick Off to open team results in a modal.
                        </p>
                    </div>

                    <div className="mt-5 flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="min-h-11 flex-1 rounded-xl border border-fuchsia-100/25 bg-[#2a0049]/70 px-4 font-semibold text-fuchsia-100"
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            onClick={() => onSave(localSettings)}
                            className="min-h-11 flex-1 rounded-xl bg-[#00ff87] px-4 font-semibold text-[#37003c]"
                        >
                            Save
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
