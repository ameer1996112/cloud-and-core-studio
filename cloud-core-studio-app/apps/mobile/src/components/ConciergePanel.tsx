import { StyleSheet, Text, View } from "react-native";
import { getEditorialLine, getLocalizedText, premiumExperience, type ConciergeRequest } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, editorial } from "@/theme/colors";

export function ConciergePanel({ requests }: { requests: ConciergeRequest[] }) {
  const { locale, direction } = useCopy();
  const align = direction === "rtl" ? "right" : "left";

  return (
    <View style={styles.band}>
      <Text style={[styles.kicker, { textAlign: align }]}>
        {locale === "he" ? "קונסיירז׳ הסטודיו" : "Studio concierge"}
      </Text>
      <Text style={[styles.body, { textAlign: align }]}>{getEditorialLine(premiumExperience.editorial.conciergeLine, locale)}</Text>
      {requests.map((request) => (
        <View key={request.id} style={[styles.row, direction === "rtl" && styles.rowReverse]}>
          <Text style={[styles.requestTitle, { textAlign: align }]}>
            {getLocalizedText(request.title, locale)}
          </Text>
          <Text style={[styles.status, { color: colors.slate }]}>
            {getLocalizedText(request.status, locale)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    borderBottomWidth: 1,
    borderColor: editorial.hairline,
    paddingBottom: 18,
    gap: 12,
  },
  kicker: {
    color: colors.navy,
    fontSize: 20,
    fontWeight: "900",
  },
  body: {
    color: colors.slate,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(11,29,58,0.08)",
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  requestTitle: {
    flex: 1,
    color: colors.ink,
    fontWeight: "900",
    fontSize: 15,
  },
  status: {
    fontSize: 12,
    fontWeight: "900",
  },
});
