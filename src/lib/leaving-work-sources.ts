const kolzchut = (title: string) => `https://www.kolzchut.org.il/he/${encodeURIComponent(title.replace(/ /g, '_'))}`

export const leavingWorkSources = {
  severanceLaw: {
    href: 'https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%A4%D7%99%D7%A6%D7%95%D7%99%D7%99_%D7%A4%D7%99%D7%98%D7%95%D7%A8%D7%99%D7%9D',
    label: 'חוק פיצויי פיטורים, התשכ״ג-1963 (ויקיטקסט)',
  },
  severanceGuide: {
    href: kolzchut('פיצויי פיטורים'),
    label: 'כל זכות: פיצויי פיטורים',
  },
  severanceAfterResigning: {
    href: kolzchut('פיצויי פיטורים לעובד שהתפטר'),
    label: 'כל זכות: פיצויי פיטורים לעובד שהתפטר',
  },
  noticeLaw: {
    href: 'https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%94%D7%95%D7%93%D7%A2%D7%94_%D7%9E%D7%95%D7%A7%D7%93%D7%9E%D7%AA_%D7%9C%D7%A4%D7%99%D7%98%D7%95%D7%A8%D7%99%D7%9D_%D7%95%D7%9C%D7%94%D7%AA%D7%A4%D7%98%D7%A8%D7%95%D7%AA',
    label: 'חוק הודעה מוקדמת לפיטורים ולהתפטרות, התשס״א-2001 (ויקיטקסט)',
  },
  noticeGuide: {
    href: 'https://www.gov.il/he/pages/notice-of-dismissal-and-resignation',
    label: 'משרד העבודה: הודעה מוקדמת לפיטורים ולהתפטרות',
  },
  vacationPayout: {
    href: 'https://www.gov.il/he/pages/annual-vacations?chapterIndex=5',
    label: 'משרד העבודה: דמי חופשה, תמורת חופשה ופדיון חופשה',
  },
  recuperationRate: {
    href: 'https://www.gov.il/he/pages/extension-order',
    label: 'משרד העבודה: נחתם צו הרחבה לעדכון דמי ההבראה לשנת 2026',
  },
  recuperationOrder: {
    href: 'https://www.gov.il/BlobFolder/dynamiccollectorresultitem/order14863/he/workers-rights_order14863.pdf',
    label: 'צו הרחבה בדבר השתתפות המעסיק בהוצאות הבראה ונופש, ילקוט הפרסומים 14863, 18.8.2026 (PDF)',
  },
  recuperationGuide: {
    href: kolzchut('דמי הבראה'),
    label: 'כל זכות: דמי הבראה',
  },
  unemploymentAfterLeaving: {
    href: 'https://www.btl.gov.il/benefits/Unemployment/Pages/nesibothafsakatavoda.aspx',
    label: 'הביטוח הלאומי: סיבות להפסקת עבודה והשפעתן על דמי האבטלה',
  },
}
