(function() {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const translations = {
    he: {
      'nav.about': 'על הסטודיו',
      'nav.classes': 'שיעורים',
      'nav.pricing': 'מחירים',
      'nav.faq': 'שאלות',
      'nav.faqLong': 'שאלות נפוצות',
      'nav.cta': 'הזמנת שיעור',
      'nav.trial': 'שיעור ניסיון',
      'location.short': 'חורפיש + יאנוח',
      'hero.kicker': 'נפתח ב-20.6.2026 · המקומות הראשונים מוגבלים',
      'hero.title': 'Cloud & Core Studio<br><em class="text-outline">השיעור הראשון שלך</em><br>יכול להתחיל רגוע.',
      'hero.desc': 'רוצה לנסות יוגה אווירית בלי פחד ובלי ניסיון קודם? בואי לשיעור ניסיון לנשים או לילדות בקבוצה קטנה, עם ירין שמסבירה כל תנועה צעד אחר צעד.',
      'hero.primaryCta': 'שרייני שיעור ניסיון',
      'hero.secondaryCta': 'איזה שיעור מתאים לי?',
      'stats.opening': 'תאריך פתיחה',
      'stats.groups': 'קבוצות קטנות',
      'stats.audienceValue': 'נשים וילדות',
      'stats.audience': 'נשים וילדות',
      'marquee.one': 'נסי לפני שאת מתחייבת<span class="marquee-dot"></span>',
      'marquee.two': 'לא צריך ניסיון קודם<span class="marquee-dot"></span>',
      'marquee.three': 'רק 8-10 משתתפות בקבוצה<span class="marquee-dot"></span>',
      'marquee.four': 'חורפיש + יאנוח<span class="marquee-dot"></span>',
      'about.title': 'מקום שבו אפשר<br>להתחיל בלי להרגיש לבד.',
      'about.kicker': 'לא עוד אימון שמרגיש גדול עלייך',
      'about.body': 'Cloud & Core Studio נבנה בשביל נשים וילדות שרוצות לזוז, להתחזק ולהרגיש קלילות יותר, אבל צריכות התחלה רגועה, צנועה וברורה. השיעור קטן, ההדרכה קרובה, והקצב מותאם למי שמגיעה בפעם הראשונה.',
      'about.feature1Title': 'פעם ראשונה? זה בדיוק בשבילך',
      'about.feature1Body': 'מתחילים מהבסיס: איך נכנסים לערסל, איך נושמים, ומה עושים כשמשהו מרגיש חדש.',
      'about.feature2Title': 'ירין רואה כל אחת',
      'about.feature2Body': 'הקבוצות מוגבלות ל-8-10 כדי שתהיה הדרכה אישית, תיקון עדין ותחושת ביטחון.',
      'about.feature3Title': 'מרחב לנשים וילדות בלבד',
      'about.feature3Body': 'שיעורי נשים, ילדות, אמא ובת וימי הולדת מתקיימים באווירה נפרדת, נעימה ומתאימה לקהילה.',
      'founder.body': 'ירין מובילה כל שיעור בגישה שקטה וברורה: קודם מבינים, אחר כך מנסים. המטרה היא שתצאי מהשיעור הראשון עם ביטחון בגוף, לא עם לחץ להצליח.',
      'founder.kicker': 'מי תלווה אותך בשיעור הראשון?',
      'founder.name': 'ירין',
      'founder.badge2': 'מקום לשאלות',
      'founder.badge3': 'קצב רגוע',
      'founder.badge4': 'הסבר לפני כל תנועה',
      'founder.cta': 'שאלי את ירין אם זה מתאים לך',
      'classes.kicker': 'מה מתאים לך עכשיו?',
      'classes.title': 'בחרי שיעור לפי<br><span class="text-outline">מי שמגיעה.</span>',
      'classes.metaSmall': '8-10 משתתפות',
      'classes.metaBeginner': 'גם בלי ניסיון',
      'classes.womenBadge': 'נשים',
      'classes.womenTitle': 'לנשים שרוצות להתחזק בעדינות',
      'classes.womenBody': 'שיעור רגוע ומדויק לנשים: תנועה, מתיחות, נשימה ועבודה עם הערסל בלי תחרות ובלי לחץ.',
      'classes.womenCta': 'בדקי מקום לשיעור נשים',
      'classes.kidsBadge': 'ילדות',
      'classes.kidsMeta1': 'תנועה ומשחק',
      'classes.kidsMeta2': 'קבוצה קטנה',
      'classes.kidsTitle': 'לילדות שרוצות לזוז בביטחון',
      'classes.kidsBody': 'שיעור חווייתי לילדות ונערות: תנועה, משחק, יציבה וביטחון בגוף בתוך קבוצה קטנה ונפרדת.',
      'classes.kidsCta': 'שאלי אם יש מקום לילדה',
      'classes.momBadge': 'אמא ובת',
      'classes.momMeta1': 'זמן איכות',
      'classes.momMeta2': 'חוויה משותפת',
      'classes.momTitle': 'זמן איכות לאמא ובת',
      'classes.momBody': 'חוויה משותפת שמוציאה מהשגרה: תנועה, צחוק, תמונות יפות ורגע רגוע רק שלכן.',
      'classes.momCta': 'בדקי מועד לאמא ובת',
      'classes.birthdaysBadge': 'ימי הולדת',
      'classes.birthdaysMeta1': 'חוויה פרטית',
      'classes.birthdaysMeta2': 'בתיאום מראש',
      'classes.birthdaysTitle': 'יום הולדת שלא נראה כמו כולם',
      'classes.birthdaysBody': 'חגיגה פרטית לילדות עם יוגה אווירית, אווירה יפה, תנועה וזמן לצילומים באישור ההורים.',
      'classes.birthdaysCta': 'בקשי רעיון ליום הולדת',
      'firstFlight.title': 'נסי פעם אחת<br>ותביני אם זה שלך.',
      'firstFlight.card1Title': 'שיעור ניסיון לנשים',
      'firstFlight.card1Body': 'היכרות רגועה עם הערסל, תנועות בסיסיות ונשימה. בלי צורך להיות גמישה ובלי ניסיון קודם.',
      'firstFlight.card1Cta': 'שרייני ניסיון לנשים',
      'firstFlight.card2Title': 'לא בטוחה אם תצליחי? מושלם.',
      'firstFlight.card2Body': 'השיעור הראשון בנוי בדיוק למי שמגיעה עם חשש. ירין מסבירה, מדגימה ומתאימה את הקצב.',
      'firstFlight.card3Title': 'שיעור ניסיון לילדות',
      'firstFlight.card3Body': 'חוויה בטוחה ונעימה לילדות ונערות שרוצות לנסות משהו חדש, כיפי ומחזק.',
      'firstFlight.card3Cta': 'בדקי ניסיון לילדות',
      'trial.kicker': 'הכי קל להתחיל מכאן',
      'trial.title': 'נסי פעם אחת<br>ותביני אם זה שלך.',
      'trial.intro': 'שיעור ניסיון בקבוצה קטנה, עם הסבר צעד אחר צעד. מתאים גם למי שמעולם לא ניסתה יוגה, יוגה אווירית או אימון דומה.',
      'trial.womenTitle': 'ניסיון לנשים',
      'trial.womenBody': 'מפגש ראשון רגוע: היכרות עם הערסל, תנועות בסיסיות, מתיחות ונשימה בקצב שמתאים למתחילות.',
      'trial.womenCta': 'שרייני ניסיון לנשים',
      'trial.badge': 'הבחירה הראשונה',
      'trial.mainTitle': 'לא צריך להיות גמישה. צריך רק להגיע.',
      'trial.mainBody': 'המטרה של שיעור הניסיון היא להוריד פחד, לא להרשים. ירין מלווה מקרוב, מסבירה לפני כל תנועה ושומרת על קבוצה קטנה של 8-10.',
      'trial.point1': 'נשים וילדות בקבוצות נפרדות',
      'trial.point2': 'מתאים למי שמתחילה מאפס',
      'trial.point3': 'תיאום מהיר ב-WhatsApp',
      'trial.mainCta': 'בדקי מקום לשיעור הקרוב',
      'trial.kidsTitle': 'ניסיון לילדות',
      'trial.kidsBody': 'שיעור ראשון לילדות ונערות עם תנועה, משחק, ביטחון בגוף והיכרות עדינה עם הערסל.',
      'trial.kidsCta': 'שאלי על מקום לילדה',
      'tagline.local': 'פחות פחד להתחיל. יותר ביטחון לזוז.',
      'trust.kicker': 'לפני שמגיעים',
      'trust.title': 'ככה מגיעים מוכנות.',
      'trust.card1Title': 'מה ללבוש?',
      'trust.card1Body': 'בגדים נוחים וצמודים יחסית, בלי תכשיטים, רוכסנים חדים או כפתורים שעלולים להיתפס בבד.',
      'trust.card2Title': 'יש מצב רפואי?',
      'trust.card2Body': 'אם יש פציעה, הריון או מצב רפואי, מתייעצים עם גורם רפואי ומעדכנים את ירין לפני השיעור.',
      'trust.card3Title': 'צילום רק באישור',
      'trust.card3Body': 'תמונות וסרטונים רק בהסכמה. בצילום ילדות נדרש אישור הורים.',
      'gallery.kicker': 'תראי איפה תתחילי',
      'gallery.title': 'סטודיו שקט,<br>תחושה נקייה.',
      'pricing.kicker': 'מחיר ברור לפני שמדברות',
      'pricing.title': 'בחרי מסלול<br>בלי להתבלבל.',
      'pricing.intro': 'המחירון מחולק לנשים ולילדות כדי שתראי מיד מה רלוונטי לך. אפשר להתחיל בשיעור ניסיון, להמשיך בכרטיסייה או לשמור מקום קבוע במנוי.',
      'pricing.tabWomen': 'נשים',
      'pricing.tabKids': 'ילדות ונערות',
      'pricing.kidsLabel': 'ילדות ונערות',
      'pricing.womenLabel': 'נשים',
      'pricing.perClass': 'לשיעור',
      'pricing.cardSingleTitle': 'רק לנסות',
      'pricing.cardSingleBody': 'הדרך הכי פשוטה להבין אם יוגה אווירית מתאימה לך. שיעור אחד, בלי מנוי ובלי התחייבות.',
      'pricing.cardSingleKidsBody': 'שיעור ראשון לילדה או נערה שרוצה לנסות בבטחה לפני שמחליטים על המשך.',
      'pricing.singleCta': 'אני רוצה לנסות',
      'pricing.singleKidsCta': 'בדקי ניסיון לילדה',
      'pricing.flexBadge': 'הכי קל להתחיל',
      'pricing.cardPassTitle': 'להמשיך בקצב שלך',
      'pricing.cardPassBody': 'כרטיסייה ל-10 שיעורים למי שרוצה להתקדם בלי להתחייב ליום קבוע. תקפה ל-3 חודשים וחוסכת כ-12%.',
      'pricing.cardPassKidsBody': 'מתאימה לילדות שרוצות להמשיך אחרי הניסיון, עם גמישות להורים וחיסכון יפה.',
      'pricing.womenPassSub': '₪88 לשיעור',
      'pricing.kidsPassSub': '₪70 לשיעור',
      'pricing.passCta': 'שאלי על כרטיסייה',
      'pricing.cardMonthlyTitle': 'מקום קבוע בקבוצה',
      'pricing.cardMonthlyBody': '4 שיעורים בחודש למי שרוצה שגרה ברורה, התקדמות הדרגתית ומקום שמור מראש.',
      'pricing.cardMonthlyKidsBody': '4 שיעורים בחודש לילדות ונערות. קצב קבוע, ביטחון בתנועה ומקום שמור בקבוצה.',
      'pricing.womenMonthlySub': '₪87.5 לשיעור',
      'pricing.kidsMonthlySub': '₪70 לשיעור',
      'pricing.monthlyCta': 'שמרי מקום קבוע',
      'pricing.monthlyKidsCta': 'שמרי מקום לילדה',
      'pricing.annualKicker': 'הכי משתלם למי שמתמידה',
      'pricing.annualWomenTitle': 'שנה של תנועה במחיר נמוך לשיעור',
      'pricing.annualWomenBody': '48 שיעורים בשנה ב-₪3,280. כ-₪68 לשיעור, עם אפשרות ל-3 תשלומים ללא ריבית.',
      'pricing.annualKidsTitle': 'שנה לילדה שאוהבת להתמיד',
      'pricing.annualKidsBody': '48 שיעורים בשנה ב-₪2,650. כ-₪55 לשיעור, עם אפשרות ל-3 תשלומים ללא ריבית.',
      'pricing.annualCta': 'שאלי אם שנתי מתאים לך',
      'pricing.annualKidsCta': 'בדקי מקום לילדה',
      'faq.title': 'לפני שאת שואלת ב-WhatsApp.',
      'faq.q1': 'האם צריך ניסיון קודם?',
      'faq.a1': 'לא. שיעור הניסיון בנוי במיוחד למי שמגיעה בפעם הראשונה ורוצה להבין את הקצב בלי לחץ.',
      'faq.q2': 'האם הסטודיו מעורב?',
      'faq.a2': 'לא. הסטודיו מיועד לנשים וילדות בלבד, עם קבוצות נפרדות לפי סוג השיעור.',
      'faq.q3': 'כמה משתתפות יש בשיעור?',
      'faq.a3': '8-10 משתתפות בלבד, כדי שכל אחת תקבל תשומת לב ולא תרגיש אבודה בתוך קבוצה גדולה.',
      'faq.q4': 'מה ללבוש לשיעור הראשון?',
      'faq.a4': 'בגדים נוחים וצמודים יחסית, ללא רוכסנים חדים, כפתורים בולטים או תכשיטים שעלולים להיתפס בבד.',
      'faq.q5': 'איך מזמינים מקום?',
      'faq.a5': 'משאירות פרטים באתר, שולחות Instagram DM או מתקשרות. בהמשך תהיה גם אפליקציית הזמנות.',
      'contact.kicker': 'רוצה לבדוק אם יש מקום?',
      'contact.title': 'השאירי פרטים<br>ונחזור עם אפשרויות.',
      'contact.body': 'כתבי לנו למי השיעור, מה מעניין אותך ומה הזמנים הנוחים. נחזור עם אפשרות לשיעור ניסיון או לקבוצה מתאימה.',
      'contact.benefit1': 'מתחילות מאפס',
      'contact.benefit2': '8-10 בקבוצה',
      'contact.benefit3': 'נשים וילדות בלבד',
      'contact.benefit4': 'חורפיש + יאנוח',
      'form.name': 'שם מלא',
      'form.namePlaceholder': 'לדוגמה: יארה',
      'form.phone': 'מספר טלפון',
      'form.phonePlaceholder': 'לדוגמה: 052-3318478',
      'form.interest': 'איזה שיעור לבדוק לך?',
      'form.optionDefault': 'בחרי מה הכי מתאים…',
      'form.optionFirstFlight': 'שיעור ניסיון למתחילות',
      'form.optionWomen': 'שיעור נשים',
      'form.optionKids': 'שיעור ילדות',
      'form.optionMom': 'אמא ובת',
      'form.optionBirthday': 'יום הולדת',
      'form.optionQuestion': 'שאלה כללית',
      'form.submit': 'בדקי זמינות',
      'form.sending': 'שולח פרטים…',
      'form.sent': 'הפרטים נשלחו בהצלחה!',
      'form.status': 'הפרטים התקבלו. נחזור אלייך עם אפשרויות זמינות.',
      'form.note': 'השארת פרטים לא מחייבת תשלום. נחזור אלייך עם אפשרויות לשיעור ניסיון או לקבוצה מתאימה.',
      'footer.brand': 'שיעורי יוגה ויוגה אווירית לנשים וילדות שרוצות להתחיל רגוע ובטוח.',
      'footer.navTitle': 'ניווט באתר',
      'footer.contactTitle': 'צרו קשר',
      'footer.ctaBody': 'התחילי משיעור ניסיון',
      'footer.trialTitle': 'רוצה לנסות בלי להתחייב?',
      'footer.ctaButton': 'בדקי זמינות',
      'footer.copyright': '© 2026 Cloud & Core Studio. כל הזכויות שמורות.',
      'footer.updated': 'עודכן לאחרונה: יוני 2026'
    },
    ar: {
      'nav.about': 'عن الاستوديو',
      'nav.classes': 'الحصص',
      'nav.pricing': 'الأسعار',
      'nav.faq': 'أسئلة',
      'nav.faqLong': 'أسئلة شائعة',
      'nav.cta': 'حجز تجربة',
      'nav.trial': 'حصة تجربة',
      'location.short': 'حرفيش + يانوح',
      'hero.kicker': 'الافتتاح في 20.6.2026 · الأماكن الأولى محدودة',
      'hero.title': 'Cloud & Core Studio<br><em class="text-outline">حصتك الأولى</em><br>تقدر تبدأ بهدوء.',
      'hero.desc': 'بدك تجربي اليوغا الهوائية بدون خوف وبدون خبرة سابقة؟ احجزي حصة تجربة للنساء أو البنات في مجموعة صغيرة، مع يارين التي تشرح كل حركة خطوة بخطوة.',
      'hero.primaryCta': 'احجزي حصة تجربة',
      'hero.secondaryCta': 'أي حصة تناسبني؟',
      'stats.opening': 'موعد الافتتاح',
      'stats.groups': 'مجموعات صغيرة',
      'stats.audienceValue': 'نساء وبنات',
      'stats.audience': 'نساء وبنات',
      'marquee.one': 'جرّبي قبل الالتزام<span class="marquee-dot"></span>',
      'marquee.two': 'لا تحتاجين خبرة سابقة<span class="marquee-dot"></span>',
      'marquee.three': 'فقط 8-10 مشاركات في المجموعة<span class="marquee-dot"></span>',
      'marquee.four': 'حرفيش + يانوح<span class="marquee-dot"></span>',
      'about.title': 'مكان تبدئين فيه<br>بدون أن تشعري أنك وحدك.',
      'about.kicker': 'ليس تمرينًا أكبر من طاقتك',
      'about.body': 'Cloud & Core Studio صُمم للنساء والبنات اللواتي يرغبن بالحركة، القوة والخفة، لكن يحتجن إلى بداية هادئة، محتشمة وواضحة. الحصة صغيرة، الإرشاد قريب، والوتيرة مناسبة لمن تأتي للمرة الأولى.',
      'about.feature1Title': 'أول مرة؟ هذا بالضبط لك',
      'about.feature1Body': 'نبدأ من الأساس: كيف تدخلين القماش، كيف تتنفسين، وماذا تفعلين عندما تشعر الحركة بأنها جديدة.',
      'about.feature2Title': 'يارين ترى كل مشاركة',
      'about.feature2Body': 'المجموعات محدودة إلى 8-10 حتى يكون هناك شرح شخصي، تصحيح لطيف وشعور بالأمان.',
      'about.feature3Title': 'مساحة للنساء والبنات فقط',
      'about.feature3Body': 'حصص نساء، بنات، أم وبنت وأعياد ميلاد بأجواء منفصلة، لطيفة ومناسبة للمجتمع.',
      'founder.body': 'يارين تقود كل حصة بأسلوب هادئ وواضح: نفهم أولًا، ثم نجرب. الهدف أن تخرجي من الحصة الأولى بثقة في جسمك، وليس بضغط للنجاح.',
      'founder.kicker': 'من سترافقك في الحصة الأولى؟',
      'founder.name': 'يارين',
      'founder.badge2': 'مساحة للأسئلة',
      'founder.badge3': 'وتيرة هادئة',
      'founder.badge4': 'شرح قبل كل حركة',
      'founder.cta': 'اسألي يارين إذا كان مناسبًا لك',
      'classes.kicker': 'ما الذي يناسبك الآن؟',
      'classes.title': 'اختاري الحصة حسب<br><span class="text-outline">من ستشارك.</span>',
      'classes.metaSmall': '8-10 مشاركات',
      'classes.metaBeginner': 'حتى بدون خبرة',
      'classes.womenBadge': 'نساء',
      'classes.womenTitle': 'للنساء اللواتي يردن قوة بلطف',
      'classes.womenBody': 'حصة هادئة ودقيقة للنساء: حركة، تمدد، تنفس وعمل مع القماش بدون منافسة وبدون ضغط.',
      'classes.womenCta': 'افحصي مكانًا في حصة النساء',
      'classes.kidsBadge': 'بنات',
      'classes.kidsMeta1': 'حركة ولعب',
      'classes.kidsMeta2': 'مجموعة صغيرة',
      'classes.kidsTitle': 'للبنات اللواتي يردن الحركة بثقة',
      'classes.kidsBody': 'حصة ممتعة للبنات والصبايا: حركة، لعب، ثبات وثقة بالجسم داخل مجموعة صغيرة ومنفصلة.',
      'classes.kidsCta': 'اسألي إذا يوجد مكان للبنت',
      'classes.momBadge': 'أم وبنت',
      'classes.momMeta1': 'وقت نوعي',
      'classes.momMeta2': 'تجربة مشتركة',
      'classes.momTitle': 'وقت نوعي لأم وبنت',
      'classes.momBody': 'تجربة مشتركة تكسر الروتين: حركة، ضحك، صور جميلة ولحظة هادئة لكما فقط.',
      'classes.momCta': 'افحصي موعدًا لأم وبنت',
      'classes.birthdaysBadge': 'أعياد ميلاد',
      'classes.birthdaysMeta1': 'تجربة خاصة',
      'classes.birthdaysMeta2': 'بتنسيق مسبق',
      'classes.birthdaysTitle': 'عيد ميلاد ليس مثل الجميع',
      'classes.birthdaysBody': 'احتفال خاص للبنات مع يوغا هوائية، أجواء جميلة، حركة ووقت للصور بموافقة الأهل.',
      'classes.birthdaysCta': 'اطلبي فكرة لعيد ميلاد',
      'firstFlight.title': 'جرّبي مرة واحدة<br>واعرفي إذا هذا لك.',
      'firstFlight.card1Title': 'حصة تجربة للنساء',
      'firstFlight.card1Body': 'تعارف هادئ مع القماش، حركات أساسية وتنفس. لا تحتاجين مرونة ولا خبرة سابقة.',
      'firstFlight.card1Cta': 'احجزي تجربة للنساء',
      'firstFlight.card2Title': 'غير متأكدة أنك ستنجحين؟ ممتاز.',
      'firstFlight.card2Body': 'الحصة الأولى مبنية لمن تأتي مع تخوف. يارين تشرح، تعرض وتلائم الوتيرة.',
      'firstFlight.card3Title': 'حصة تجربة للبنات',
      'firstFlight.card3Body': 'تجربة آمنة ولطيفة للبنات والصبايا اللواتي يردن تجربة شيء جديد، ممتع ومقوّي.',
      'firstFlight.card3Cta': 'افحصي تجربة للبنات',
      'trial.kicker': 'أسهل مكان للبداية',
      'trial.title': 'جرّبي مرة واحدة<br>واعرفي إذا هذا لك.',
      'trial.intro': 'حصة تجربة في مجموعة صغيرة، مع شرح خطوة بخطوة. مناسبة أيضًا لمن لم تجرب اليوغا، اليوغا الهوائية أو أي تمرين مشابه.',
      'trial.womenTitle': 'تجربة للنساء',
      'trial.womenBody': 'لقاء أول هادئ: تعارف مع القماش، حركات أساسية، تمدد وتنفس بوتيرة تناسب المبتدئات.',
      'trial.womenCta': 'احجزي تجربة للنساء',
      'trial.badge': 'الخيار الأول',
      'trial.mainTitle': 'لا تحتاجين أن تكوني مرنة. فقط تعالي.',
      'trial.mainBody': 'هدف حصة التجربة هو تقليل الخوف، وليس الإبهار. يارين ترافق عن قرب، تشرح قبل كل حركة وتحافظ على مجموعة صغيرة من 8-10.',
      'trial.point1': 'نساء وبنات في مجموعات منفصلة',
      'trial.point2': 'مناسب لمن تبدأ من الصفر',
      'trial.point3': 'تنسيق سريع عبر WhatsApp',
      'trial.mainCta': 'افحصي مكانًا للحصة القريبة',
      'trial.kidsTitle': 'تجربة للبنات',
      'trial.kidsBody': 'حصة أولى للبنات والصبايا مع حركة، لعب، ثقة بالجسم وتعارف لطيف مع القماش.',
      'trial.kidsCta': 'اسألي عن مكان للبنت',
      'tagline.local': 'خوف أقل من البداية. ثقة أكثر بالحركة.',
      'trust.kicker': 'قبل الوصول',
      'trust.title': 'هكذا تصلين جاهزة.',
      'trust.card1Title': 'ماذا ألبس؟',
      'trust.card1Body': 'ملابس مريحة وقريبة من الجسم، بدون مجوهرات، سحابات حادة أو أزرار قد تعلق بالقماش.',
      'trust.card2Title': 'يوجد وضع طبي؟',
      'trust.card2Body': 'في حال وجود إصابة، حمل أو حالة طبية، استشيري مختصًا صحيًا وأخبري يارين قبل الحصة.',
      'trust.card3Title': 'تصوير فقط بالموافقة',
      'trust.card3Body': 'الصور والفيديوهات فقط بالموافقة. تصوير البنات يتطلب موافقة الأهل.',
      'gallery.kicker': 'شاهدي أين ستبدئين',
      'gallery.title': 'استوديو هادئ،<br>وشعور نظيف.',
      'pricing.kicker': 'سعر واضح قبل التواصل',
      'pricing.title': 'اختاري مسارًا<br>بدون حيرة.',
      'pricing.intro': 'الأسعار مقسمة للنساء وللبنات حتى تري فورًا ما يناسبك. يمكن البدء بحصة تجربة، المتابعة ببطاقة حصص، أو حجز مكان ثابت باشتراك.',
      'pricing.tabWomen': 'نساء',
      'pricing.tabKids': 'بنات وصبايا',
      'pricing.kidsLabel': 'بنات وصبايا',
      'pricing.womenLabel': 'نساء',
      'pricing.perClass': 'للحصة',
      'pricing.cardSingleTitle': 'فقط للتجربة',
      'pricing.cardSingleBody': 'أبسط طريقة لتعرفي إذا اليوغا الهوائية تناسبك. حصة واحدة، بدون اشتراك وبدون التزام.',
      'pricing.cardSingleKidsBody': 'حصة أولى للبنت أو الصبية التي تريد التجربة بأمان قبل قرار الاستمرار.',
      'pricing.singleCta': 'أريد أن أجرب',
      'pricing.singleKidsCta': 'افحصي تجربة للبنت',
      'pricing.flexBadge': 'الأسهل للبداية',
      'pricing.cardPassTitle': 'استمري بوتيرتك',
      'pricing.cardPassBody': 'بطاقة 10 حصص لمن تريد التقدم بدون الالتزام بيوم ثابت. صالحة 3 أشهر وتوفر حوالي 12%.',
      'pricing.cardPassKidsBody': 'مناسبة للبنات اللواتي يردن الاستمرار بعد التجربة، مع مرونة للأهل وتوفير واضح.',
      'pricing.womenPassSub': '₪88 للحصة',
      'pricing.kidsPassSub': '₪70 للحصة',
      'pricing.passCta': 'اسألي عن بطاقة حصص',
      'pricing.cardMonthlyTitle': 'مكان ثابت في المجموعة',
      'pricing.cardMonthlyBody': '4 حصص في الشهر لمن تريد روتينًا واضحًا، تقدمًا تدريجيًا ومكانًا محفوظًا مسبقًا.',
      'pricing.cardMonthlyKidsBody': '4 حصص في الشهر للبنات والصبايا. وتيرة ثابتة، ثقة بالحركة ومكان محفوظ في المجموعة.',
      'pricing.womenMonthlySub': '₪87.5 للحصة',
      'pricing.kidsMonthlySub': '₪70 للحصة',
      'pricing.monthlyCta': 'احجزي مكانًا ثابتًا',
      'pricing.monthlyKidsCta': 'احجزي مكانًا للبنت',
      'pricing.annualKicker': 'الأوفر لمن تستمر',
      'pricing.annualWomenTitle': 'سنة حركة بسعر أقل للحصة',
      'pricing.annualWomenBody': '48 حصة في السنة بسعر ₪3,280. حوالي ₪68 للحصة، مع إمكانية الدفع على 3 دفعات بدون فائدة.',
      'pricing.annualKidsTitle': 'سنة للبنت التي تحب الاستمرار',
      'pricing.annualKidsBody': '48 حصة في السنة بسعر ₪2,650. حوالي ₪55 للحصة، مع إمكانية الدفع على 3 دفعات بدون فائدة.',
      'pricing.annualCta': 'اسألي إذا السنوي مناسب لك',
      'pricing.annualKidsCta': 'افحصي مكانًا للبنت',
      'faq.title': 'قبل أن تسألي عبر WhatsApp.',
      'faq.q1': 'هل أحتاج إلى تجربة سابقة؟',
      'faq.a1': 'لا. حصة التجربة مبنية خصيصًا لمن تأتي لأول مرة وتريد فهم الوتيرة بدون ضغط.',
      'faq.q2': 'هل الاستوديو مختلط؟',
      'faq.a2': 'لا. الاستوديو مخصص للنساء والبنات فقط، مع مجموعات منفصلة حسب نوع الحصة.',
      'faq.q3': 'كم مشاركة في كل حصة؟',
      'faq.a3': '8-10 مشاركات فقط، حتى تحصل كل واحدة على انتباه ولا تشعر بأنها ضائعة في مجموعة كبيرة.',
      'faq.q4': 'ماذا ألبس للحصة الأولى؟',
      'faq.a4': 'ملابس مريحة وقريبة من الجسم، بدون سحابات حادة، أزرار بارزة أو مجوهرات قد تعلق بالقماش.',
      'faq.q5': 'كيف أحجز مكانًا؟',
      'faq.a5': 'اتركي التفاصيل في الموقع، أرسلي Instagram DM أو اتصلي. لاحقًا سيكون هناك تطبيق للحجوزات.',
      'contact.kicker': 'تريدين فحص إذا يوجد مكان؟',
      'contact.title': 'اتركي بياناتك<br>ونعود بخيارات.',
      'contact.body': 'اكتبي لنا لمن الحصة، ما الذي يهمك، وما الأوقات المناسبة. سنعود إليك بخيار لحصة تجربة أو مجموعة مناسبة.',
      'contact.benefit1': 'بداية من الصفر',
      'contact.benefit2': '8-10 في المجموعة',
      'contact.benefit3': 'نساء وبنات فقط',
      'contact.benefit4': 'حرفيش + يانوح',
      'form.name': 'الاسم الكامل',
      'form.namePlaceholder': 'مثال: يارا',
      'form.phone': 'رقم الهاتف',
      'form.phonePlaceholder': 'مثال: 052-3318478',
      'form.interest': 'أي حصة نفحص لك؟',
      'form.optionDefault': 'اختاري ما يناسبك أكثر…',
      'form.optionFirstFlight': 'حصة تجربة للمبتدئات',
      'form.optionWomen': 'حصة نساء',
      'form.optionKids': 'حصة بنات',
      'form.optionMom': 'أم وبنت',
      'form.optionBirthday': 'عيد ميلاد',
      'form.optionQuestion': 'سؤال عام',
      'form.submit': 'فحص التوفر',
      'form.sending': 'يتم إرسال التفاصيل…',
      'form.sent': 'تم إرسال التفاصيل بنجاح!',
      'form.status': 'وصلتنا التفاصيل. سنعود إليك بخيارات متاحة.',
      'form.note': 'ترك التفاصيل لا يلزمك بالدفع. سنعود إليك بخيارات لحصة تجربة أو مجموعة مناسبة.',
      'footer.brand': 'حصص يوغا ويوغا هوائية للنساء والبنات اللواتي يردن بداية هادئة وآمنة.',
      'footer.navTitle': 'تصفح الموقع',
      'footer.contactTitle': 'تواصلوا معنا',
      'footer.ctaBody': 'ابدئي بحصة تجربة',
      'footer.trialTitle': 'تريدين التجربة بدون التزام؟',
      'footer.ctaButton': 'افحصي التوفر',
      'footer.copyright': '© 2026 Cloud & Core Studio. جميع الحقوق محفوظة.',
      'footer.updated': 'آخر تحديث: يونيو 2026'
    }
  };

  const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
  let currentLanguage = ['he', 'ar'].includes(requestedLanguage)
    ? requestedLanguage
    : (localStorage.getItem('cloudCoreLanguage') || 'he');

  function translatePage(language) {
    const dictionary = translations[language] || translations.he;
    currentLanguage = language;
    document.documentElement.lang = language;
    document.documentElement.dir = 'rtl';
    document.body.dataset.language = language;
    localStorage.setItem('cloudCoreLanguage', language);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dictionary[key]) el.innerHTML = dictionary[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (dictionary[key]) el.setAttribute('placeholder', dictionary[key]);
    });

    document.querySelectorAll('[data-set-language]').forEach(btn => {
      const active = btn.dataset.setLanguage === language;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  document.querySelectorAll('[data-set-language]').forEach(btn => {
    btn.addEventListener('click', () => translatePage(btn.dataset.setLanguage));
  });

  translatePage(currentLanguage);

  // ── Scroll Reveal ──
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ── Navbar Scroll ──
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', scrollY > 50);
  }, { passive: true });

  // ── Parallax Elements ──
  const parallaxElements = document.querySelectorAll('.parallax');
  let ticking = false;

  if (!reduceMotion) {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          parallaxElements.forEach(el => {
            const rect = el.parentElement.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              const speed = parseFloat(el.getAttribute('data-speed')) || 0.05;
              const yOffset = (window.innerHeight - rect.top) * speed;
              el.style.transform = `translateY(${yOffset}px)`;
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── Mobile Menu ──
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileOverlay');

  function toggleMenu() {
    const isOpen = drawer.classList.contains('open');
    const nextOpen = !isOpen;
    hamburger.classList.toggle('active', nextOpen);
    hamburger.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
    drawer.classList.toggle('open', nextOpen);
    drawer.toggleAttribute('inert', !nextOpen);
    drawer.setAttribute('aria-hidden', nextOpen ? 'false' : 'true');
    overlay.classList.toggle('open', nextOpen);
    overlay.setAttribute('aria-hidden', nextOpen ? 'false' : 'true');
    document.body.style.overflow = nextOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (drawer.classList.contains('open')) toggleMenu();
    });
  });

  // ── FAQ Accordion ──
  document.querySelectorAll('.faq-item').forEach(item => {
    const button = item.querySelector('.faq-q');
    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-ans').style.maxHeight = null;
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
        item.querySelector('.faq-ans').style.maxHeight =
          item.querySelector('.faq-ans').scrollHeight + 'px';
      }
    });
  });

  // ── Pricing Tabs ──
  const pricingTabs = document.querySelectorAll('[data-pricing-tab]');
  const pricingPanels = document.querySelectorAll('[data-pricing-panel]');

  function setPricingTab(target) {
    pricingTabs.forEach(tab => {
      const active = tab.dataset.pricingTab === target;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    pricingPanels.forEach(panel => {
      const active = panel.dataset.pricingPanel === target;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
  }

  pricingTabs.forEach(tab => {
    tab.addEventListener('click', () => setPricingTab(tab.dataset.pricingTab));
  });

  // ── Testimonials Carousel (mobile swipe-snapped) ──
  const track = document.getElementById('tTrack');
  const dots = document.querySelectorAll('.t-dot');
  let currentSlide = 0;
  let autoSlideTimer;
  let isScrolling = false;

  function updateDots(idx) {
    dots.forEach((d, i) => {
      const active = i === idx;
      d.classList.toggle('active', active);
      d.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  function goToSlide(idx) {
    currentSlide = idx;
    if (window.innerWidth < 769) {
      const cards = track.querySelectorAll('.t-card');
      if (cards[idx]) {
        isScrolling = true;
        cards[idx].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
        // Clear flag after smooth scroll completes
        setTimeout(() => { isScrolling = false; }, 600);
      }
    }
    updateDots(idx);
  }

  function startAutoSlide() {
    clearInterval(autoSlideTimer);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(autoSlideTimer);
      goToSlide(parseInt(dot.dataset.slide));
    });
  });

  // Native swipe scroll sync
  if (track) {
    track.addEventListener('scroll', () => {
      if (window.innerWidth < 769 && !isScrolling) {
        const slideWidth = track.getBoundingClientRect().width;
        const scrollOffset = Math.abs(track.scrollLeft);
        const activeIdx = Math.round(scrollOffset / slideWidth);
        if (activeIdx >= 0 && activeIdx < dots.length) {
          currentSlide = activeIdx;
          dots.forEach((d, i) => {
            const active = i === activeIdx;
            d.classList.toggle('active', active);
            d.setAttribute('aria-current', active ? 'true' : 'false');
          });
        }
      }
    }, { passive: true });
  }

  // Setup mobile carousel
  function setupCarousel() {
    if (!track) return;
    if (window.innerWidth < 769) {
      track.style.display = 'flex';
      track.querySelectorAll('.t-card').forEach(card => {
        card.style.flex = '0 0 100%';
        card.style.minWidth = '0';
      });
      updateDots(currentSlide);
    } else {
      clearInterval(autoSlideTimer);
      track.style.display = '';
      track.querySelectorAll('.t-card').forEach(card => {
        card.style.flex = '1';
      });
    }
  }

  setupCarousel();
  window.addEventListener('resize', () => {
    clearInterval(autoSlideTimer);
    setupCarousel();
  });

  // ── Smooth Scroll ──
  const sectionAnchorSelector = [
    '.pricing-header',
    '.gallery-header',
    '.faq-header',
    '.contact-grid',
    '.about-grid',
    '.founder-grid',
    '.testimonials-header',
    '.kicker',
    '.heading-lg'
  ].join(', ');

  function getAnchorTarget(target) {
    if (!target || target.id === 'hero') return target;
    return target.querySelector(sectionAnchorSelector) || target;
  }

  function getNavOffset() {
    const navHeight = navbar ? navbar.getBoundingClientRect().height : 0;
    return Math.ceil(navHeight + 16);
  }

  function scrollToHash(href, shouldUpdateHistory = true) {
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;

    if (href === '#hero') {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    } else {
      const anchorTarget = getAnchorTarget(target);
      const top = Math.max(
        0,
        anchorTarget.getBoundingClientRect().top + window.scrollY - getNavOffset()
      );
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    if (shouldUpdateHistory) history.pushState(null, '', href);
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const href = a.getAttribute('href');
      window.requestAnimationFrame(() => scrollToHash(href));
    });
  });

  if (window.location.hash) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => scrollToHash(window.location.hash, false));
    });
  }

  // ── Form Submit Handler ──
  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-form');
    const status = e.target.querySelector('.form-status');
    status.textContent = '';
    
    const dictionary = translations[currentLanguage] || translations.he;
    btn.disabled = true;
    btn.textContent = dictionary['form.sending'];
    
    setTimeout(() => {
      btn.textContent = dictionary['form.sent'];
      status.textContent = dictionary['form.status'];
      btn.style.background = '#8A9E8C';
      setTimeout(() => {
        btn.textContent = dictionary['form.submit'];
        btn.style.background = '';
        btn.disabled = false;
        e.target.reset();
      }, 2500);
    }, 1000);
  });

  // ── Cursor Light Effect ──
  const cursorLight = document.getElementById('cursorLight');
  if (cursorLight && window.innerWidth > 768 && !reduceMotion) {
    let raf;
    document.addEventListener('mousemove', (e) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        cursorLight.style.left = e.clientX + 'px';
        cursorLight.style.top = e.clientY + 'px';
        if (!cursorLight.classList.contains('active')) {
          cursorLight.classList.add('active');
        }
      });
    });
  }

  // ── 2. Animated Number Counters ──
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const isFloat = el.getAttribute('data-count').includes('.');
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  // ── 3. Text Split Word Animation ──
  document.querySelectorAll('.word-split').forEach(el => {
    // Split text nodes into word spans
    const html = el.innerHTML;
    const words = html.split(/(\s+)/);
    el.innerHTML = words.map(w => {
      if (w.trim() === '' || w.match(/^<br/i)) return w;
      // If it's an HTML tag, return as-is
      if (w.startsWith('<')) return w;
      return `<span class="word"><span class="word-inner">${w}</span></span>`;
    }).join('');
  });

  const splitObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        splitObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.word-split').forEach(el => splitObserver.observe(el));

  // ── 4. 3D Card Tilt ──
  if (window.innerWidth > 768) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      const light = card.querySelector('.tilt-inner-light');
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
        if (light) {
          light.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.1) 0%, transparent 60%)`;
        }
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
      });
    });
  }

  // ── 5. Gallery Drag-to-Scroll ──
  const galleryTrack = document.getElementById('galleryTrack');
  if (galleryTrack) {
    let isDown = false, startX, scrollLeft;
    galleryTrack.addEventListener('mousedown', e => {
      isDown = true;
      startX = e.pageX - galleryTrack.offsetLeft;
      scrollLeft = galleryTrack.scrollLeft;
    });
    galleryTrack.addEventListener('mouseleave', () => { isDown = false; });
    galleryTrack.addEventListener('mouseup', () => { isDown = false; });
    galleryTrack.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - galleryTrack.offsetLeft;
      const walk = (x - startX) * 1.5;
      galleryTrack.scrollLeft = scrollLeft - walk;
    });

    // Auto-scroll the gallery slowly
    let galleryAutoScroll = setInterval(() => {
      if (!isDown) {
        galleryTrack.scrollLeft += 1;
        // Reset to start when near end
        if (galleryTrack.scrollLeft >= galleryTrack.scrollWidth - galleryTrack.clientWidth - 10) {
          galleryTrack.scrollLeft = 0;
        }
      }
    }, 20);

    galleryTrack.addEventListener('mouseenter', () => clearInterval(galleryAutoScroll));
    galleryTrack.addEventListener('mouseleave', () => {
      galleryAutoScroll = setInterval(() => {
        galleryTrack.scrollLeft += 1;
        if (galleryTrack.scrollLeft >= galleryTrack.scrollWidth - galleryTrack.clientWidth - 10) {
          galleryTrack.scrollLeft = 0;
        }
      }, 20);
    });
  }

  // ── 6. Sticky CTA Bar ──
  const stickyCta = document.getElementById('sticky-cta');
  const heroSection = document.getElementById('hero');
  const contactSection = document.getElementById('contact');
  const whatsappBtn = document.querySelector('.whatsapp-btn');
  if (stickyCta) {
    stickyCta.inert = true;
    window.addEventListener('scroll', () => {
      if (!heroSection || !contactSection) return;
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      const contactTop = contactSection.getBoundingClientRect().top;
      if (heroBottom < 0 && contactTop > window.innerHeight) {
        stickyCta.classList.add('visible');
        stickyCta.setAttribute('aria-hidden', 'false');
        stickyCta.inert = false;
        if (whatsappBtn) whatsappBtn.classList.add('lifted');
      } else {
        stickyCta.classList.remove('visible');
        stickyCta.setAttribute('aria-hidden', 'true');
        stickyCta.inert = true;
        if (whatsappBtn) whatsappBtn.classList.remove('lifted');
      }
    }, { passive: true });
  }

  // ── 7. Scroll-Spy Nav ──
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = Array.from(navAnchors).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => spyObserver.observe(s));

  // ── 8. Progressive Image Loading ──
  document.querySelectorAll('.img-progressive').forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
    }
  });

})();


/* ═══════════════════════════════════════════
   DESIGN SPELLS — Logic
   ═══════════════════════════════════════════ */

// 1. Cursor Aura
document.addEventListener('mousemove', (e) => {
  document.body.style.setProperty('--mouse-x', e.clientX);
  document.body.style.setProperty('--mouse-y', e.clientY);
});

// 2. Magnetic Buttons
const magnetics = document.querySelectorAll('.magnetic');
magnetics.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = `translate(0px, 0px)`;
  });
});
