import { useCopy } from "@/i18n/LocaleProvider";
import { fitness } from "@/theme/colors";
import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function Screen({ children }: PropsWithChildren) {
  const { direction } = useCopy();
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={[styles.content, { direction }]} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: fitness.appBg,
  },
  content: {
    padding: 18,
    paddingBottom: 124,
    backgroundColor: fitness.appBg,
  },
  inner: {
    gap: 18,
  },
});
