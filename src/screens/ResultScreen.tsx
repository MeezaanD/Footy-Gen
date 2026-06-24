import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { TeamResultCard } from "../components/results/TeamResultCard";
import { GlassCard } from "../components/ui/GlassCard";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { GeneratorStackParamList } from "../navigation/types";
import { getSessionById } from "../storage/sessions";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { GeneratedSession } from "../types/session";
import { getSessionDisplayName } from "../utils/generateTeams";

type Props = NativeStackScreenProps<GeneratorStackParamList, "Result">;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function groupTeamsByCourt(teams: GeneratedSession["teams"], sport: GeneratedSession["sport"]) {
  if (sport !== "padel" || teams.length <= 2) {
    return [{ label: undefined as string | undefined, teams }];
  }

  const groups: { label: string; teams: GeneratedSession["teams"] }[] = [];
  for (let i = 0; i < teams.length; i += 2) {
    const courtMatch = teams[i]?.name.match(/Court (\d+)/);
    const label = courtMatch ? `Court ${courtMatch[1]}` : `Court ${groups.length + 1}`;
    groups.push({
      label,
      teams: teams.slice(i, i + 2),
    });
  }
  return groups;
}

export function ResultScreen({ route, navigation }: Props) {
  const { sessionId } = route.params;
  const [session, setSession] = useState<GeneratedSession | null>(null);

  const loadSession = useCallback(async () => {
    const loaded = await getSessionById(sessionId);
    setSession(loaded);
    if (!loaded) {
      navigation.goBack();
    }
  }, [navigation, sessionId]);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  useEffect(() => {
    navigation.setOptions({
      title: "Results",
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.primary,
      headerTitleStyle: { color: colors.white, fontWeight: "800" },
    });
  }, [navigation]);

  if (!session) {
    return (
      <ScreenContainer scroll={false}>
        <Text style={typography.body}>Loading...</Text>
      </ScreenContainer>
    );
  }

  const groups = groupTeamsByCourt(session.teams, session.sport);
  const sportEmoji = session.sport === "soccer" ? "⚽" : "🎾";

  return (
    <ScreenContainer>
      <GlassCard>
        <View style={styles.badgeRow}>
          <Text style={styles.badge}>{sportEmoji}</Text>
          <Text style={styles.badgeText}>{session.sport === "soccer" ? "Soccer" : "Padel"}</Text>
        </View>
        <Text style={styles.title}>{getSessionDisplayName(session)}</Text>
        <Text style={styles.meta}>{session.formatLabel}</Text>
        <Text style={styles.meta}>
          {session.playerCount} players · {formatDate(session.createdAt)}
        </Text>
      </GlassCard>

      {groups.map((group, groupIndex) => (
        <View key={`group-${groupIndex}`} style={styles.group}>
          {group.label && <Text style={styles.courtLabel}>{group.label}</Text>}
          {group.teams.map((team) => (
            <TeamResultCard key={team.name} name={team.name} players={team.players} />
          ))}
        </View>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  badge: {
    fontSize: 22,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    ...typography.heading,
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  group: {
    gap: spacing.xs,
  },
  courtLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
});
