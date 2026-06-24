import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import { FormatPicker } from "../components/generator/FormatPicker";
import { PlayerChips } from "../components/generator/PlayerChips";
import { PlayerInput } from "../components/generator/PlayerInput";
import { SportToggle } from "../components/generator/SportToggle";
import { FlashMessage } from "../components/ui/FlashMessage";
import { GlassCard } from "../components/ui/GlassCard";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { GeneratorStackParamList } from "../navigation/types";
import { loadDraftState, saveDraftState, saveSession } from "../storage/sessions";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { DraftState, Sport } from "../types/session";
import { getFormatsForSport } from "../utils/formatOptions";
import { generateTeams } from "../utils/generateTeams";
import { validatePlayerName } from "../utils/validatePlayer";

type Props = NativeStackScreenProps<GeneratorStackParamList, "Generator">;

export function GeneratorScreen({ navigation }: Props) {
  const [draft, setDraft] = useState<DraftState | null>(null);
  const [sport, setSport] = useState<Sport>("soccer");
  const [nameInput, setNameInput] = useState("");
  const [flashMessage, setFlashMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void loadDraftState().then((state) => {
      setDraft(state);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded && draft) {
      void saveDraftState(draft);
    }
  }, [draft, loaded]);

  const currentDraft = draft?.[sport];

  const updateCurrentDraft = useCallback(
    (updater: (current: DraftState[Sport]) => DraftState[Sport]) => {
      setDraft((current) => {
        if (!current) {
          return current;
        }
        return {
          ...current,
          [sport]: updater(current[sport]),
        };
      });
    },
    [sport],
  );

  const addPlayer = () => {
    if (!currentDraft) {
      return;
    }

    const validation = validatePlayerName(nameInput, currentDraft.players);
    if (!validation.valid) {
      setFlashMessage(validation.message);
      return;
    }

    updateCurrentDraft((current) => ({
      ...current,
      players: [...current.players, validation.value],
    }));
    setNameInput("");
    setFlashMessage("Player added.");
  };

  const removePlayer = (index: number) => {
    updateCurrentDraft((current) => ({
      ...current,
      players: current.players.filter((_, i) => i !== index),
    }));
    setFlashMessage("Player removed.");
  };

  const clearPlayers = () => {
    updateCurrentDraft((current) => ({
      ...current,
      players: [],
    }));
    setFlashMessage("All players cleared.");
  };

  const handleGenerate = async () => {
    if (!currentDraft) {
      return;
    }

    const result = generateTeams({
      sport,
      players: currentDraft.players,
      formatPlayerCount: currentDraft.formatPlayerCount,
      sessionName: currentDraft.sessionName,
    });

    if (!result.success) {
      setFlashMessage(result.message);
      return;
    }

    await saveSession(result.session);
    setFlashMessage("Teams generated!");
    navigation.navigate("Result", { sessionId: result.session.id });
  };

  if (!draft || !currentDraft) {
    return (
      <ScreenContainer scroll={false}>
        <Text style={typography.body}>Loading...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={typography.title}>NextUp</Text>
        <Text style={styles.subtitle}>Balanced random teams, ready to play.</Text>
      </View>

      <GlassCard>
        <SportToggle
          sport={sport}
          onChange={(nextSport) => {
            setSport(nextSport);
            setFlashMessage("");
          }}
        />
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionLabel}>Session name (optional)</Text>
        <TextInput
          value={currentDraft.sessionName ?? ""}
          onChangeText={(value) =>
            updateCurrentDraft((current) => ({
              ...current,
              sessionName: value,
            }))
          }
          placeholder="Friday kickabout..."
          placeholderTextColor={colors.muted}
          maxLength={50}
          style={styles.sessionInput}
        />
      </GlassCard>

      <GlassCard>
        <PlayerInput value={nameInput} onChange={setNameInput} onAdd={addPlayer} />
        <View style={styles.playerSection}>
          <PlayerChips
            players={currentDraft.players}
            onRemove={removePlayer}
            onClearAll={() => {
              if (currentDraft.players.length === 0) {
                return;
              }
              Alert.alert("Clear all players?", "This will remove every player from the list.", [
                { text: "Cancel", style: "cancel" },
                { text: "Clear", style: "destructive", onPress: clearPlayers },
              ]);
            }}
          />
        </View>
      </GlassCard>

      <GlassCard>
        <FormatPicker
          formats={getFormatsForSport(sport)}
          selectedPlayerCount={currentDraft.formatPlayerCount}
          onSelect={(playerCount) =>
            updateCurrentDraft((current) => ({
              ...current,
              formatPlayerCount: playerCount,
            }))
          }
        />
      </GlassCard>

      <PrimaryButton label="Generate Teams" onPress={() => void handleGenerate()} />

      <FlashMessage message={flashMessage} onClear={() => setFlashMessage("")} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.muted,
  },
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  sessionInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.cardSoft,
    color: colors.white,
    fontSize: 15,
    paddingHorizontal: spacing.md,
  },
  playerSection: {
    marginTop: spacing.lg,
  },
});
