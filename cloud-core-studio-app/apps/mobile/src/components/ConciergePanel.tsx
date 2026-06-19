import { StyleSheet, Text, View } from "react-native";
import { getEditorialLine, getLocalizedText, premiumExperience, type ConciergeRequest } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, fitness, radii } from "@/theme/colors";

export function ConciergePanel({ requests }: { requests: ConciergeRequest[] }) {
  const { locale, direction } = useCopy();
  const align = direction === "rtl" ? "right" : "left";

  return (
    <View style={styles.panel}>
      <Text style={[styles.title, { textAlign: align }]}>
        {locale === "he" ? "טיפול הסטודיו" : "Studio care"}
      </Text>
      <Text style={[styles.body, { textAlign: align }]}>{getEditorialLine(premiumExperience.editorial.conciergeLine, locale)}</Text>
      {requests.map((request) => (
        <View key={request.id} style={[styles.requestRow, direction === "rtl" && styles.rowReverse]}>
          <View style={[styles.requestDot, request.tone === "approved" && styles.requestDotApproved]} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.requestTitle, { textAlign: align }]}>{getLocalizedText(request.title, locale)}</Text>
            <Text style={[styles.requestBody, { textAlign: align }]}>{getLocalizedText(request.status, locale)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: fitness.surfaceRaised,
    borderColor: fitness.border,
    borderWidth: 1,
    borderRadius: radii.large,
    padding: 18,
    gap: 13,
  },
  title: {
    color: fitness.textPrimary,
    fontSize: 18,
    fontWeight: "900",
  },
  body: {
    color: fitness.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  requestRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: fitness.border,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  requestDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    backgroundColor: colors.blue,
    marginTop: 5,
    shadowColor: colors.blue,
    shadowOpacity: 0.45,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  requestDotApproved: {
    backgroundColor: colors.gold,
    shadowColor: colors.gold,
  },
  requestTitle: {
    color: fitness.textPrimary,
    fontWeight: "900",
    fontSize: 15,
    lineHeight: 20,
  },
  requestBody: {
    color: fitness.textMuted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    marginTop: 2,
  },
});
