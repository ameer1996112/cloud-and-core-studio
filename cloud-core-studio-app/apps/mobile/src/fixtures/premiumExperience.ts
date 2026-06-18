import type { ClassSession, Locale, MemberEntitlement } from "@cloud-core/shared";
import { entitlement } from "@/fixtures/classes";

export interface LocalizedText {
  he: string;
  en: string;
}

export interface SessionInsight {
  sessionId: string;
  fitScore: number;
  waitlistOdds: number | null;
  urgency: "low" | "medium" | "high";
  bookingCta: LocalizedText;
  reasons: LocalizedText[];
  preparation: LocalizedText[];
}

export interface ConciergeRequest {
  id: string;
  title: LocalizedText;
  status: LocalizedText;
  tone: "approved" | "waiting" | "reply";
}

export interface MembershipHealth {
  label: LocalizedText;
  status: LocalizedText;
  rhythm: LocalizedText;
  renewalAdvice: LocalizedText;
  score: number;
  entitlement: MemberEntitlement;
}

export interface PremiumExperience {
  member: {
    firstName: LocalizedText;
    greeting: LocalizedText;
  };
  today: {
    recommendedSessionId: string;
    headline: LocalizedText;
    summary: LocalizedText;
    primaryCta: LocalizedText;
  };
  membership: MembershipHealth;
  sessionInsights: SessionInsight[];
  concierge: ConciergeRequest[];
}

export const premiumExperience: PremiumExperience = {
  member: {
    firstName: { he: "נועה", en: "Noa" },
    greeting: {
      he: "היי נועה, השיעור הבא שלך מוכן",
      en: "Hi Noa, your next class is ready",
    },
  },
  today: {
    recommendedSessionId: "class-2",
    headline: {
      he: "הבחירה המדויקת להיום",
      en: "Your best-fit class today",
    },
    summary: {
      he: "מתיחות וזרימה מתאים לרמת העומס שלך, למנוי הפעיל ולחלון הביטול.",
      en: "Stretch & Flow fits your current load, active membership, and cancellation window.",
    },
    primaryCta: {
      he: "להזמין את השיעור המתאים",
      en: "Book my best class",
    },
  },
  membership: {
    label: { he: "בריאות מנוי", en: "Membership health" },
    status: { he: "בריא", en: "Healthy" },
    rhythm: {
      he: "את בקצב של 2 שיעורים בשבוע",
      en: "You are on pace for 2 classes a week",
    },
    renewalAdvice: {
      he: "חידוש מומלץ עד 24 באוגוסט כדי לשמור על הרצף.",
      en: "Renew by Aug 24 to keep your rhythm.",
    },
    score: 72,
    entitlement,
  },
  sessionInsights: [
    {
      sessionId: "class-1",
      fitScore: 88,
      waitlistOdds: null,
      urgency: "medium",
      bookingCta: { he: "לשמור מקום", en: "Reserve my place" },
      reasons: [
        { he: "מתאים לרמת מתחילות", en: "Fits beginner level" },
        { he: "נותרו מקומות פנויים", en: "Spots are still available" },
        { he: "חלון הביטול עדיין פתוח", en: "Cancellation window is still open" },
      ],
      preparation: [
        { he: "להגיע 10 דקות לפני תחילת השיעור", en: "Arrive 10 minutes before class" },
        { he: "בגדים נוחים וללא תכשיטים", en: "Comfortable clothes and no jewelry" },
      ],
    },
    {
      sessionId: "class-2",
      fitScore: 92,
      waitlistOdds: 86,
      urgency: "high",
      bookingCta: { he: "להצטרף להמתנה חכמה", en: "Join priority waitlist" },
      reasons: [
        { he: "התאמה גבוהה להיסטוריית השיעורים שלך", en: "High match with your class history" },
        { he: "סיכוי קידום גבוה מרשימת המתנה", en: "High waitlist promotion odds" },
        { he: "עומס שיעור מאוזן אחרי יום עבודה", en: "Balanced load after work" },
      ],
      preparation: [
        {
          he: "אם יתפנה מקום, יהיה חלון אישור של 30 דקות",
          en: "If a spot opens, you will have 30 minutes to confirm",
        },
        { he: "מומלץ להפעיל התראת המתנה דחופה", en: "Urgent waitlist alerts are recommended" },
      ],
    },
    {
      sessionId: "class-3",
      fitScore: 74,
      waitlistOdds: null,
      urgency: "low",
      bookingCta: { he: "לראות פרטים", en: "View details" },
      reasons: [
        { he: "שיעור מתאים למשפחה ולחברות", en: "Good for family and friend invites" },
        { he: "זמינות גבוהה", en: "High availability" },
      ],
      preparation: [
        {
          he: "מתאים לילדות ונערות עם ליווי הורה לפי צורך",
          en: "Suitable for girls and teens with parent support if needed",
        },
      ],
    },
  ],
  concierge: [
    {
      id: "friend-trial",
      title: { he: "להביא חברה לשיעור ניסיון", en: "Bring a friend to trial" },
      status: { he: "מאושר על ידי הסטודיו", en: "Approved by studio" },
      tone: "approved",
    },
    {
      id: "freeze-request",
      title: { he: "בקשה להקפאת מנוי", en: "Membership freeze request" },
      status: { he: "ממתין לאישור", en: "Waiting for approval" },
      tone: "waiting",
    },
  ],
};

export function getLocalizedText(text: LocalizedText, locale: Locale) {
  return text[locale];
}

export function getSessionInsight(sessionId: string, experience: PremiumExperience) {
  return experience.sessionInsights.find((insight) => insight.sessionId === sessionId);
}

export function getRecommendedSessions(sessions: ClassSession[], experience: PremiumExperience) {
  return [...sessions].sort((left, right) => {
    if (left.id === experience.today.recommendedSessionId) return -1;
    if (right.id === experience.today.recommendedSessionId) return 1;
    return new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime();
  });
}
