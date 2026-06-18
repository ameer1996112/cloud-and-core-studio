import { StyleSheet, Text, View } from "react-native";
import { getLocalizedText, type ConciergeRequest } from "@/fixtures/premiumExperience";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, radii } from "@/theme/colors";

const toneColor: Record<ConciergeRequest["tone"], string> = {
  approved: colors.success,
  waiting: colors.warning,
  reply: colors.plum,
};

export function ConciergePanel({ requests }: { requests: ConciergeRequest[] }) {
  const { locale, direction } = useCopy();
  const align = direction === "rtl" ? "right" : "left";

  return (
    <View style={styles.panel}>
      <Text style={[styles.title, { textAlign: align }]}>
        {locale === "he" ? "קונסיירז׳ הסטודיו" : "Studio concierge"}
      </Text>
      {requests.map((request) => (
        <View key={request.id} style={[styles.row, direction === "rtl" && styles.rowReverse]}>
          <Text style={[styles.requestTitle, { textAlign: align }]}>
            {getLocalizedText(request.title, locale)}
          </Text>
          <View style={[styles.badge, { borderColor: toneColor[request.tone] }]}>
            <Text style={[styles.badgeText, { color: toneColor[request.tone] }]}>
              {getLocalizedText(request.status, locale)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.mist,
    borderRadius: radii.large,
    padding: 18,
    gap: 14,
  },
  title: {
    color: colors.navy,
    fontSize: 21,
    fontWeight: "900",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(11,29,58,0.08)",
    paddingTop: 14,
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
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.white,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "900",
  },
});
