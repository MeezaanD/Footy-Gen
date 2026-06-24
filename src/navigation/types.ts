import { NavigatorScreenParams } from "@react-navigation/native";

export type GeneratorStackParamList = {
  Generator: undefined;
  Result: { sessionId: string };
};

export type HistoryStackParamList = {
  HistoryList: undefined;
  Result: { sessionId: string };
};

export type RootTabParamList = {
  GeneratorTab: NavigatorScreenParams<GeneratorStackParamList>;
  HistoryTab: NavigatorScreenParams<HistoryStackParamList>;
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
