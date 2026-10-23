export type LightLevel = 'red' | 'amber' | 'info'

export type WarningLight = {
  id: string
  name: string
  level: LightLevel
  colorName: string
  meaning: string
  action: string
}

export const LIGHTS_REVIEWED = '2026-10-23'

export const levels: { value: LightLevel; label: string; summary: string }[] = [
  { value: 'red', label: 'אדום', summary: 'סכנה או תקלה חמורה. עוצרים בבטחה' },
  { value: 'amber', label: 'כתום', summary: 'תקלה או תשומת לב. בודקים בקרוב' },
  { value: 'info', label: 'ירוק וכחול', summary: 'מידע: מערכת פעילה' },
]

export const warningLights: WarningLight[] = [
  {
    id: 'oil',
    name: 'לחץ שמן',
    level: 'red',
    colorName: 'אדום',
    meaning: 'לחץ השמן במנוע נמוך מדי, או שיש תקלה בחיישן.',
    action: 'עצרו בבטחה וכבו את המנוע. אל תמשיכו לנסוע, בדקו את מפלס השמן ופנו למוסך או לגרר.',
  },
  {
    id: 'temperature',
    name: 'חום מנוע גבוה',
    level: 'red',
    colorName: 'אדום',
    meaning: 'המנוע מתחמם יתר על המידה.',
    action:
      'עצרו בבטחה וכבו את המנוע. המתינו שיתקרר ואל תפתחו מכסה של מערכת הקירור כשהמנוע חם. פנו למוסך.',
  },
  {
    id: 'battery',
    name: 'מערכת הטעינה',
    level: 'red',
    colorName: 'אדום',
    meaning: 'המצבר לא נטען כראוי. הסיבה יכולה להיות במצבר, באלטרנטור או בחגורה.',
    action: 'צמצמו צריכת חשמל, סעו למוסך הקרוב ואל תכבו את המנוע בדרך. הרכב עלול להיעצר כשהמצבר יתרוקן.',
  },
  {
    id: 'brake',
    name: 'מערכת בלימה או בלם חניה',
    level: 'red',
    colorName: 'אדום',
    meaning: 'בלם החניה משוך, או שיש תקלה במערכת הבלימה, למשל מפלס נמוך של נוזל בלמים.',
    action: 'בדקו שבלם החניה משוחרר. אם הנורה נשארת דלוקה, אל תמשיכו לנסוע ופנו לגרר או למוסך.',
  },
  {
    id: 'airbag',
    name: 'כריות אוויר',
    level: 'red',
    colorName: 'אדום',
    meaning: 'יש תקלה במערכת כריות האוויר או במערכת החגורות.',
    action: 'ייתכן שהכריות לא יפעלו בתאונה. פנו למוסך בהקדם, ולפני כן אל תתעלמו מהנורה.',
  },
  {
    id: 'seatbelt',
    name: 'חגורת בטיחות',
    level: 'red',
    colorName: 'אדום',
    meaning: 'נוסע לא חגר חגורה.',
    action: 'חגרו חגורה לכל הנוסעים, ובדקו שאין חפץ כבד על מושב הנוסע.',
  },
  {
    id: 'engine',
    name: 'בדיקת מנוע',
    level: 'amber',
    colorName: 'כתום',
    meaning: 'תקלה במנוע, במערכת הדלק או בבקרת הפליטות.',
    action:
      'אם הנורה דולקת קבוע, פנו למוסך בהקדם. אם היא מהבהבת, הפחיתו מהירות ועצרו בבטחה, כי זו תקלה חמורה יותר.',
  },
  {
    id: 'abs',
    name: 'מערכת ABS',
    level: 'amber',
    colorName: 'כתום',
    meaning: 'מערכת מניעת הנעילה של הבלמים לא פעילה. הבלימה הרגילה בדרך כלל עדיין פועלת.',
    action: 'נהגו בזהירות, שמרו מרחק גדול יותר ופנו למוסך.',
  },
  {
    id: 'tires',
    name: 'לחץ אוויר בצמיגים',
    level: 'amber',
    colorName: 'כתום',
    meaning: 'לחץ האוויר באחד הצמיגים או יותר נמוך מהנדרש.',
    action: 'בדקו את הצמיגים ונפחו לפי הלחץ שבספר הרכב או על מדבקה בפתח הדלת. אם הנורה מהבהבת, ייתכן שהחיישן תקול.',
  },
  {
    id: 'stability',
    name: 'בקרת יציבות ואחיזה',
    level: 'amber',
    colorName: 'כתום',
    meaning: 'כשהנורה מהבהבת, המערכת פועלת כי הכביש חלק. כשהיא דולקת קבוע, יש תקלה או שהמערכת כבויה.',
    action: 'האטו כשהיא מהבהבת. אם היא דולקת קבוע, בדקו שלא כיביתם את המערכת ופנו למוסך.',
  },
  {
    id: 'fuel',
    name: 'מעט דלק',
    level: 'amber',
    colorName: 'כתום',
    meaning: 'מפלס הדלק במיכל נמוך.',
    action: 'תדלקו בהקדם. נהיגה עם מיכל כמעט ריק עלולה לגרום לתקלות.',
  },
  {
    id: 'glow',
    name: 'חימום מקדים בדיזל',
    level: 'amber',
    colorName: 'כתום',
    meaning: 'ברכבי דיזל הנורה דולקת לזמן קצר לפני התנעה. אם היא נשארת דולקת או מהבהבת, יש תקלה.',
    action: 'המתינו לכיבוי הנורה לפני התנעה. אם היא נשארת דלוקה בזמן נסיעה, פנו למוסך.',
  },
  {
    id: 'high-beam',
    name: 'אורות גבוהים',
    level: 'info',
    colorName: 'כחול',
    meaning: 'האורות הגבוהים דולקים.',
    action: 'כבו אותם כשרכב מתקרב מולכם או כשאתם נוסעים מאחורי רכב אחר.',
  },
  {
    id: 'low-beam',
    name: 'אורות נמוכים או חנייה',
    level: 'info',
    colorName: 'ירוק',
    meaning: 'האורות הנמוכים או אורות החנייה דולקים.',
    action: 'אין צורך בפעולה. בדקו שהאורות מכוונים לפי הצורך.',
  },
  {
    id: 'fog',
    name: 'פנסי ערפל',
    level: 'info',
    colorName: 'ירוק',
    meaning: 'פנסי הערפל דולקים.',
    action: 'כבו אותם כשהראות חזרה לנורמלית, כדי לא להסנוור.',
  },
  {
    id: 'turn',
    name: 'איתות',
    level: 'info',
    colorName: 'ירוק',
    meaning: 'איתות ימינה או שמאלה פעיל. הבהוב מהיר מהרגיל מעיד לפעמים על נורה שרופה באחד הצדדים.',
    action: 'כבו את האיתות אחרי הפנייה, ובדקו נורות אם ההבהוב מהיר.',
  },
  {
    id: 'cruise',
    name: 'בקרת שיוט',
    level: 'info',
    colorName: 'ירוק',
    meaning: 'מערכת בקרת השיוט פעילה.',
    action: 'אין צורך בפעולה. לחיצה על הבלם מבטלת את בקרת השיוט ברוב הרכבים.',
  },
]

export const filterLights = (query: string, level: LightLevel | 'all'): WarningLight[] => {
  const clean = query.trim()
  return warningLights.filter(
    (light) =>
      (level === 'all' || light.level === level) &&
      (!clean || `${light.name} ${light.meaning} ${light.action}`.includes(clean)),
  )
}
