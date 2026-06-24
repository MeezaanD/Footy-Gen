import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { History, Settings, Shuffle } from "lucide-react-native";

import { GeneratorScreen } from "../screens/GeneratorScreen";
import { HistoryScreen } from "../screens/HistoryScreen";
import { ResultScreen } from "../screens/ResultScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { colors } from "../theme/colors";
import {
  GeneratorStackParamList,
  HistoryStackParamList,
  RootTabParamList,
} from "./types";

const Tab = createBottomTabNavigator<RootTabParamList>();
const GeneratorStack = createNativeStackNavigator<GeneratorStackParamList>();
const HistoryStack = createNativeStackNavigator<HistoryStackParamList>();

const navTheme: Theme = {
  dark: true,
  colors: {
    primary: colors.primary,
    background: colors.background,
    card: colors.card,
    text: colors.white,
    border: colors.border,
    notification: colors.primary,
  },
  fonts: {
    regular: { fontFamily: "System", fontWeight: "400" },
    medium: { fontFamily: "System", fontWeight: "500" },
    bold: { fontFamily: "System", fontWeight: "700" },
    heavy: { fontFamily: "System", fontWeight: "900" },
  },
};

const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.primary,
  headerTitleStyle: { color: colors.white, fontWeight: "800" as const },
  contentStyle: { backgroundColor: colors.background },
};

function GeneratorStackNavigator() {
  return (
    <GeneratorStack.Navigator screenOptions={stackScreenOptions}>
      <GeneratorStack.Screen
        name="Generator"
        component={GeneratorScreen}
        options={{ headerShown: false }}
      />
      <GeneratorStack.Screen name="Result" component={ResultScreen} />
    </GeneratorStack.Navigator>
  );
}

function HistoryStackNavigator() {
  return (
    <HistoryStack.Navigator screenOptions={stackScreenOptions}>
      <HistoryStack.Screen
        name="HistoryList"
        component={HistoryScreen}
        options={{ headerShown: false }}
      />
      <HistoryStack.Screen name="Result" component={ResultScreen} />
    </HistoryStack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "700",
          },
        }}
      >
        <Tab.Screen
          name="GeneratorTab"
          component={GeneratorStackNavigator}
          options={{
            title: "Generator",
            tabBarIcon: ({ color, size }) => <Shuffle color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="HistoryTab"
          component={HistoryStackNavigator}
          options={{
            title: "History",
            tabBarIcon: ({ color, size }) => <History color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
