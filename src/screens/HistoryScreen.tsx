import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { HistoryListItem } from "../components/history/HistoryListItem";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { HistoryStackParamList } from "../navigation/types";
import { clearAllSessions, deleteSession, loadSessions } from "../storage/sessions";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { GeneratedSession } from "../types/session";

type Props = NativeStackScreenProps<HistoryStackParamList, "HistoryList">;

export function HistoryScreen({ navigation }: Props) {
  const [sessions, setSessions] = useState<GeneratedSession[]>([]);

  const refresh = useCallback(async () => {
    const loaded = await loadSessions();
    setSessions(loaded);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const confirmClearAll = () => {
    if (sessions.length === 0) {
      return;
    }

    Alert.alert("Clear all history?", "This will permanently delete all saved sessions.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear all",
        style: "destructive",
        onPress: () => {
          void clearAllSessions().then(refresh);
        },
      },
    ]);
  };

  const confirmDelete = (session: GeneratedSession) => {
    Alert.alert("Delete session?", `Remove "${session.name ?? session.formatLabel}" from history?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          void deleteSession(session.id).then(refresh);
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={typography.title}>History</Text>
        <Text style={styles.subtitle}>Your saved team generations.</Text>
      </View>

      {sessions.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No sessions yet</Text>
          <Text style={styles.emptyText}>
            Generate teams on the Generator tab and they will appear here.
          </Text>
        </View>
      ) : (
        <>
          {sessions.map((session) => (
            <HistoryListItem
              key={session.id}
              session={session}
              onView={() => navigation.navigate("Result", { sessionId: session.id })}
              onDelete={() => confirmDelete(session)}
            />
          ))}
          <PrimaryButton label="Clear All History" variant="danger" onPress={confirmClearAll} />
        </>
      )}
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
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.heading,
  },
  emptyText: {
    ...typography.body,
    textAlign: "center",
    maxWidth: 280,
  },
});
