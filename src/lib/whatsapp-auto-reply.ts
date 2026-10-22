export type MessageType = 'greeting' | 'away' | 'quick' | 'holiday' | 'email'

export type BusinessId =
  | 'beauty'
  | 'restaurant'
  | 'shop'
  | 'freelancer'
  | 'clinic'
  | 'office'
  | 'garage'
  | 'realestate'

export type ToneId = 'formal' | 'warm' | 'casual'

export type OccasionId = 'vacation' | 'holiday'

export type LanguageId = 'he' | 'en' | 'both'

export type AutoReplyInput = {
  type: MessageType
  business: BusinessId
  tone: ToneId
  occasion: OccasionId
  language: LanguageId
  name: string
  hours: string
  returnDate: string
  link: string
  phone: string
  emoji: boolean
}

export type ReplyBlock = { lang: 'he' | 'en'; text: string }

export type AutoReply = {
  id: string
  text: string
  blocks: ReplyBlock[]
  subject?: string
  shortcut?: string
}

export type FieldSet = { hours: boolean; returnDate: boolean; link: boolean; phone: boolean; emoji: boolean }

type Trio = [string, string, string]
type ByTone<T> = Record<ToneId, T>
type Opener = (name: string) => string

type QuickItem = { shortcut: string; text: ByTone<string>; noLink?: ByTone<string> }

type Business = {
  id: BusinessId
  label: string
  audience: string
  emoji: string
  link: string
  linkEn: string
  phone: string
  greeting: Trio
  away: Trio
  holiday: Trio
  emailHe: Trio
  emailEn: Trio
  quick: QuickItem[]
}

export const messageTypes: { id: MessageType; label: string; hint: string }[] = [
  { id: 'greeting', label: 'הודעת פתיחה', hint: 'למי שכותב בפעם הראשונה' },
  { id: 'away', label: 'הודעת היעדרות', hint: 'כשאתם לא זמינים' },
  { id: 'quick', label: 'תשובות מהירות', hint: 'קיצורים עם /' },
  { id: 'holiday', label: 'חופשה וחג', hint: 'כשהעסק סגור כמה ימים' },
  { id: 'email', label: 'מענה אוטומטי במייל', hint: 'Gmail ו-Outlook' },
]

export const tones: { id: ToneId; label: string }[] = [
  { id: 'formal', label: 'רשמי' },
  { id: 'warm', label: 'חם' },
  { id: 'casual', label: 'קליל' },
]

export const occasions: { id: OccasionId; label: string }[] = [
  { id: 'vacation', label: 'חופשה' },
  { id: 'holiday', label: 'חג' },
]

export const languages: { id: LanguageId; label: string }[] = [
  { id: 'he', label: 'עברית' },
  { id: 'en', label: 'English' },
  { id: 'both', label: 'עברית ואנגלית' },
]

export const DEFAULT_TYPE: MessageType = 'greeting'
export const DEFAULT_BUSINESS: BusinessId = 'beauty'
export const DEFAULT_TONE: ToneId = 'warm'
export const DEFAULT_OCCASION: OccasionId = 'vacation'
export const DEFAULT_LANGUAGE: LanguageId = 'he'

export const QUICK_REPLY_LIMIT = 50
export const SHORTCUT_MAX_LENGTH = 25

const FIELDS: Record<MessageType, FieldSet> = {
  greeting: { hours: true, returnDate: false, link: true, phone: false, emoji: true },
  away: { hours: true, returnDate: false, link: true, phone: true, emoji: true },
  quick: { hours: true, returnDate: false, link: true, phone: true, emoji: false },
  holiday: { hours: false, returnDate: true, link: true, phone: true, emoji: true },
  email: { hours: false, returnDate: true, link: true, phone: true, emoji: false },
}

export const fieldsFor = (type: MessageType) => FIELDS[type]

const businesses: Business[] = [
  {
    id: 'beauty',
    label: 'מספרה וקוסמטיקה',
    audience: 'למספרה ולקוסמטיקה',
    emoji: '✂️',
    link: 'לקביעת תור אונליין: {link}',
    linkEn: 'Book online: {link}',
    phone: 'מאחרים לתור? עדכנו אותנו בטלפון: {phone}',
    greeting: [
      'כדי שנתאם לכם תור, כתבו איזה טיפול אתם צריכים ובאילו ימים ושעות נוח לכם.',
      'ספרו לנו איזה טיפול מעניין אתכם: תספורת, צבע, טיפול פנים או משהו אחר. אם יש לכם תמונה להשראה, צרפו אותה.',
      'רוצים לקבוע תור? כתבו את השם שלכם, את הטיפול ואת היום שמתאים לכם, ונבדוק מה פנוי ביומן.',
    ],
    away: [
      'כרגע אנחנו לא ליד הטלפון. השאירו הודעה עם הטיפול והיום שנוח לכם, ונתאם תור.',
      'הסטודיו סגור כרגע. אם רציתם להזיז או לבטל תור, כתבו את היום והשעה של התור הקיים.',
      'אנחנו באמצע טיפול או אחרי שעות הפעילות, ולכן לא עונים מיד.',
    ],
    holiday: [
      'אפשר כבר עכשיו לבקש תור לימים שאחרי.',
      'אם יש לכם תור שנופל בימים האלה, ניצור איתכם קשר לקבוע מועד חדש.',
      'כתבו לנו איזה טיפול ומתי נוח לכם, ונשבץ אתכם ראשונים ביומן.',
    ],
    emailHe: [
      'לקביעת תור או לשינוי תור, השאירו את הפרטים ונטפל בהם לפי הסדר.',
      'אם קבעתם תור לימים האלה, ניצור איתכם קשר לתאם מועד חדש.',
      'שאלות על טיפולים ומחירים ייענו לפי סדר קבלתן.',
    ],
    emailEn: [
      'If you would like to book or change an appointment, reply with the treatment and a few times that suit you, and we will confirm it.',
      'If you have an appointment booked for these dates, we will contact you to find a new time.',
      'Questions about treatments and prices will be answered in the order they arrived.',
    ],
    quick: [
      {
        shortcut: '/תור',
        text: {
          formal: 'לקביעת תור אונליין: {link}',
          warm: 'הכי נוח לקבוע תור כאן: {link}\nבוחרים טיפול, יום ושעה, וזהו.',
          casual: 'קובעים תור פה: {link}',
        },
        noLink: {
          formal: 'נשמח לתאם לכם תור. כתבו איזה טיפול ובאילו ימים נוח לכם.',
          warm: 'בשמחה. איזה טיפול ובאילו ימים נוח לכם? נבדוק מה פנוי.',
          casual: 'איזה טיפול ומתי נוח לכם? נבדוק ביומן.',
        },
      },
      {
        shortcut: '/מחירים',
        text: {
          formal: 'המחיר תלוי בסוג הטיפול ובאורך השיער. שלחו תמונה ופרטו מה תרצו לעשות, ונשלח הערכת מחיר.',
          warm: 'המחיר תלוי בטיפול ובאורך ובעובי של השיער, אז הכי טוב לשלוח תמונה ולספר מה רוצים. נחזור עם מחיר מדויק.',
          casual: 'תלוי בטיפול ובשיער. שלחו תמונה ונגיד לכם בערך כמה.',
        },
      },
      {
        shortcut: '/הזזה',
        text: {
          formal: 'כדי להזיז או לבטל תור, כתבו את היום והשעה של התור הקיים, ונציע מועד חלופי.',
          warm: 'אין בעיה, זה קורה. כתבו מתי התור הנוכחי ומתי נוח לכם במקום, ונסדר.',
          casual: 'מתי התור עכשיו ומתי נוח במקום? נסדר.',
        },
      },
      {
        shortcut: '/תודה',
        text: {
          formal: 'תודה שביקרתם אצלנו. נשמח לראות אתכם שוב.',
          warm: 'תודה שבאתם, היה כיף. אם אהבתם, נשמח לביקורת קצרה בגוגל.',
          casual: 'תודה שבאתם. נתראה בפעם הבאה.',
        },
      },
    ],
  },
  {
    id: 'restaurant',
    label: 'מסעדה ובית קפה',
    audience: 'למסעדה ולבית קפה',
    emoji: '🍽️',
    link: 'התפריט והזמנת מקום: {link}',
    linkEn: 'Menu and reservations: {link}',
    phone: 'להזמנות בטלפון: {phone}',
    greeting: [
      'להזמנת מקום כתבו תאריך, שעה ומספר סועדים, ונאשר לכם בהודעה.',
      'מתכננים אירוע או מגיעים בקבוצה? כתבו תאריך ומספר אורחים, ונכין לכם הצעה.',
      'להזמנת משלוח או איסוף עצמי, כתבו מה תרצו להזמין ולאיזו שעה.',
    ],
    away: [
      'המטבח סגור כרגע. להזמנת מקום השאירו תאריך, שעה ומספר סועדים, ונאשר כשנפתח.',
      'אנחנו באמצע שירות ולא מספיקים לענות לכל ההודעות בזמן אמת.',
      'בקשות לאירועים ולקבוצות מקבלות הצעה מסודרת ביום העבודה הבא.',
    ],
    holiday: [
      'הזמנות מקום לימים שאחרי אפשר להשאיר כבר עכשיו.',
      'מי שכבר הזמין אצלנו לתאריכים האלה יקבל מאיתנו הודעה אישית.',
      'אפשר כבר לשריין שולחן לפתיחה המחודשת.',
    ],
    emailHe: [
      'בקשות להזמנת מקום ולאירועים יטופלו לפי סדר קבלתן.',
      'לאירוע פרטי או לקבוצה, כתבו תאריך, מספר אורחים ותקציב משוער, ונשלח הצעה.',
      'שאלות על התפריט, על אלרגנים או על כשרות ייענו מיד כשנשוב.',
    ],
    emailEn: [
      'Table bookings and event requests will be handled in the order they arrived.',
      'For a private event or a group booking, send us the date, the number of guests and an approximate budget, and we will send you an offer.',
      'Questions about the menu, allergens or kashrut will be answered as soon as we are back.',
    ],
    quick: [
      {
        shortcut: '/תפריט',
        text: {
          formal: 'התפריט המלא: {link}',
          warm: 'הנה התפריט שלנו: {link}\nיש שאלה על מנה? אנחנו כאן.',
          casual: 'התפריט פה: {link}',
        },
        noLink: {
          formal: 'נשלח לכם את התפריט כאן בצ׳אט. מדובר בישיבה במקום או במשלוח?',
          warm: 'בשמחה נשלח את התפריט. אתם מגיעים אלינו או מזמינים הביתה?',
          casual: 'שולחים תפריט. ישיבה או משלוח?',
        },
      },
      {
        shortcut: '/שולחן',
        text: {
          formal: 'להזמנת מקום, אנא ציינו תאריך, שעה ומספר סועדים.',
          warm: 'בשמחה נשמור לכם שולחן. לאיזה תאריך ושעה, וכמה תהיו?',
          casual: 'לכמה אנשים ומתי?',
        },
      },
      {
        shortcut: '/אלרגיות',
        text: {
          formal: 'אנא ציינו אלרגיות או רגישויות בעת ההזמנה, והמטבח יתאים את המנות ככל האפשר.',
          warm: 'יש אלרגיה או רגישות? כתבו לנו, ונבדוק עם המטבח מה אפשר להתאים.',
          casual: 'אלרגיה? ספרו לנו ונבדוק עם המטבח.',
        },
      },
      {
        shortcut: '/אירוע',
        text: {
          formal: 'לאירוע או לקבוצה, אנא שלחו תאריך, מספר אורחים ותקציב משוער, ונחזור עם הצעה.',
          warm: 'חוגגים משהו? ספרו לנו מתי, כמה אורחים ומה בערך התקציב, ונבנה לכם הצעה.',
          casual: 'אירוע? תאריך, כמה אנשים ותקציב, ונחזור עם הצעה.',
        },
      },
    ],
  },
  {
    id: 'shop',
    label: 'חנות אונליין',
    audience: 'לחנות אונליין',
    emoji: '📦',
    link: 'כל המוצרים באתר: {link}',
    linkEn: 'Shop online: {link}',
    phone: 'שירות לקוחות בטלפון: {phone}',
    greeting: [
      'אם הפנייה היא לגבי הזמנה, כתבו את מספר ההזמנה ונבדוק איפה היא.',
      'מחפשים מוצר מסוים? כתבו את שם המוצר או שלחו צילום מסך, ונבדוק אם יש במלאי.',
      'כדי שנעזור מהר, כתבו במה מדובר: הזמנה קיימת, שאלה על מוצר או החזרה.',
    ],
    away: [
      'שירות הלקוחות לא זמין כרגע. אם זה לגבי הזמנה, השאירו את מספר ההזמנה ונבדוק אותה ראשונה.',
      'ההזמנות באתר ממשיכות להתקבל גם עכשיו, ושאלות ייענו ביום העבודה הבא.',
      'אנחנו עונים לפי סדר הפניות. בינתיים אפשר לראות את פרטי ההזמנה במייל האישור.',
    ],
    holiday: [
      'ההזמנות באתר ממשיכות להתקבל, והן ייארזו ויישלחו כשנחזור לעבודה.',
      'הזמנות שכבר יצאו ממשיכות בדרך כרגיל, ושאלות עליהן ייענו לפי הסדר.',
      'כדאי לקחת בחשבון שזמני המשלוח יתארכו בכמה ימים.',
    ],
    emailHe: [
      'בפנייה לגבי הזמנה, ציינו את מספר ההזמנה כדי שנוכל לטפל בה מהר.',
      'הזמנות שהתקבלו באתר יישלחו לפי הסדר.',
      'בקשות להחזרה ולהחלפה יטופלו לפי סדר קבלתן.',
    ],
    emailEn: [
      'If your message is about an order, please include the order number so we can handle it quickly.',
      'Orders placed on the website will be shipped in the order they were received.',
      'Return and exchange requests will be handled in the order they arrived.',
    ],
    quick: [
      {
        shortcut: '/הזמנה',
        text: {
          formal: 'כדי לבדוק את סטטוס ההזמנה, אנא שלחו את מספר ההזמנה.',
          warm: 'בואו נבדוק. מה מספר ההזמנה?',
          casual: 'מספר הזמנה?',
        },
      },
      {
        shortcut: '/משלוח',
        text: {
          formal: 'כאשר ההזמנה יוצאת, נשלח אליכם מספר מעקב שבו ניתן לראות היכן החבילה.',
          warm: 'ברגע שההזמנה יוצאת נשלח לכם מספר מעקב, ותוכלו לראות בדיוק איפה החבילה.',
          casual: 'כשההזמנה יוצאת מקבלים מספר מעקב.',
        },
      },
      {
        shortcut: '/החזרה',
        text: {
          formal: 'להחזרה או להחלפה, שלחו את מספר ההזמנה ואת סיבת ההחזרה, ונשלח הוראות.',
          warm: 'לא התאים? קורה. שלחו את מספר ההזמנה ומה תרצו לעשות, החזרה או החלפה, ונסביר איך.',
          casual: 'החזרה או החלפה? שלחו מספר הזמנה ונסביר.',
        },
      },
      {
        shortcut: '/מלאי',
        text: {
          formal: 'כל המוצרים הזמינים מופיעים באתר: {link}',
          warm: 'כל מה שיש כרגע במלאי נמצא כאן: {link}\nלא מצאתם? כתבו לנו.',
          casual: 'מה שבמלאי נמצא פה: {link}',
        },
        noLink: {
          formal: 'אנא כתבו את שם המוצר, המידה או הצבע, ונבדוק את המלאי.',
          warm: 'איזה מוצר חיפשתם? כתבו שם, מידה או צבע ונבדוק.',
          casual: 'איזה מוצר? נבדוק במלאי.',
        },
      },
    ],
  },
  {
    id: 'freelancer',
    label: 'נותן שירות או פרילנסר',
    audience: 'לנותני שירות ולפרילנסרים',
    emoji: '💼',
    link: 'עבודות קודמות: {link}',
    linkEn: 'Previous work: {link}',
    phone: 'לשיחה מהירה: {phone}',
    greeting: [
      'ספרו בכמה מילים על הפרויקט: מה צריך, עד מתי ומה התקציב בערך.',
      'כדי שנבין אם זה מתאים, שלחו דוגמה למשהו שאהבתם ומה לוח הזמנים שלכם.',
      'אם נוח לכם יותר לדבר, כתבו מתי מתאימה לכם שיחה קצרה ונתאם.',
    ],
    away: [
      'אנחנו באמצע עבודה ובודקים הודעות כמה פעמים ביום.',
      'אם זה פרויקט חדש, כתבו מה צריך ועד מתי. זה יחסוך סבב שאלות.',
      'אם זו הערה על עבודה שבתהליך, כתבו אותה כאן ונעבור עליה ברגע שנתפנה.',
    ],
    holiday: [
      'פרויקטים פתוחים ממשיכים לפי לוח הזמנים שסיכמנו, אלא אם עדכנו אתכם אחרת.',
      'פניות על פרויקטים חדשים מתקבלות כרגיל, והצעות מחיר יישלחו לפי הסדר.',
      'אם משהו בעבודה שמסרנו לא עובד כמו שצריך, כתבו לנו ונטפל בזה ראשון.',
    ],
    emailHe: [
      'פרויקטים פתוחים ממשיכים לפי לוח הזמנים שסיכמנו.',
      'לפרויקט חדש, כתבו מה צריך, עד מתי ומה התקציב, ונשלח הצעה.',
      'קבצים וחומרים לעבודה אפשר לשלוח כבר עכשיו.',
    ],
    emailEn: [
      'Ongoing projects continue on the schedule we agreed on.',
      'For a new project, tell us what you need, your deadline and your budget, and we will send you a quote.',
      'You can already send files and materials for the work.',
    ],
    quick: [
      {
        shortcut: '/הצעה',
        text: {
          formal: 'כדי להכין הצעת מחיר, אנא פרטו מה נדרש, מהו לוח הזמנים ומהו התקציב המשוער.',
          warm: 'בשמחה נכין הצעה. ספרו מה צריך, עד מתי ובערך איזה תקציב, ונחזור עם מחיר.',
          casual: 'מה צריך, עד מתי ומה התקציב? נחזור עם מחיר.',
        },
      },
      {
        shortcut: '/עבודות',
        text: {
          formal: 'דוגמאות לעבודות קודמות: {link}',
          warm: 'אפשר לראות כמה עבודות שעשינו כאן: {link}',
          casual: 'עבודות קודמות: {link}',
        },
        noLink: {
          formal: 'נשמח לשלוח דוגמאות לעבודות קודמות בתחום שלכם.',
          warm: 'נשלח לכם כמה דוגמאות מעבודות דומות. מה התחום?',
          casual: 'נשלח דוגמאות. מה התחום?',
        },
      },
      {
        shortcut: '/תהליך',
        text: {
          formal: 'העבודה מתחילה בשיחת אפיון, ממשיכה בהצעת מחיר ומקדמה, ואחריה טיוטה ראשונה לאישורכם.',
          warm: 'ככה זה עובד אצלנו: שיחה קצרה כדי להבין מה צריך, הצעת מחיר, ואז טיוטה ראשונה שאתם מאשרים או מתקנים.',
          casual: 'שיחה, הצעת מחיר, טיוטה ראשונה ותיקונים.',
        },
      },
      {
        shortcut: '/חשבונית',
        text: {
          formal: 'החשבונית נשלחת במייל עם כל תשלום. לפרטי העברה בנקאית, כתבו לנו.',
          warm: 'אחרי כל תשלום תקבלו חשבונית למייל. צריכים פרטים להעברה? רק תכתבו.',
          casual: 'חשבונית נשלחת למייל. צריך פרטי העברה? כתבו.',
        },
      },
    ],
  },
  {
    id: 'clinic',
    label: 'קליניקה וטיפולים',
    audience: 'לקליניקה',
    emoji: '🩺',
    link: 'לזימון תור אונליין: {link}',
    linkEn: 'Book an appointment online: {link}',
    phone: 'לביטול תור ביום הטיפול: {phone}',
    greeting: [
      'לקביעת תור, כתבו את שמכם המלא ואת סוג הטיפול, ונציע מועדים פנויים.',
      'אם זו פנייה ראשונה, ספרו בקצרה מה הביא אתכם אלינו, ונתאם שיחה או תור.',
      'כדי לשמור על הפרטיות שלכם, אל תשלחו כאן מסמכים רפואיים. נתאם איתכם דרך נוחה להעביר אותם.',
    ],
    away: [
      'הקליניקה סגורה כרגע. השאירו שם וסוג טיפול, ונתאם תור.',
      'אנחנו בטיפול ולא עונים בזמן אמת. נענה בהפסקה הקרובה.',
      'אם אתם מרגישים לא טוב ומדובר במצב דחוף, אל תחכו לתשובה כאן ופנו לגורם רפואי זמין.',
    ],
    holiday: [
      'בקשות לתורים לימים שאחרי אפשר להשאיר כאן, והן ייענו לפי סדר הפניות.',
      'אם נקבע לכם תור בימים האלה, ניצור איתכם קשר לקבוע מועד חדש.',
      'במצב דחוף אל תחכו לתשובה כאן, ופנו לגורם רפואי זמין.',
    ],
    emailHe: [
      'בקשות לתורים ולשינוי תורים יטופלו לפי סדר קבלתן.',
      'כדי לשמור על הפרטיות שלכם, אל תשלחו מסמכים רפואיים במייל בלי תיאום מראש.',
      'במצב דחוף אל תחכו לתשובה במייל, ופנו לגורם רפואי זמין.',
    ],
    emailEn: [
      'Appointment requests and changes will be handled in the order they arrived.',
      'For your privacy, please do not send medical documents by email before we arrange it with you.',
      'If it is urgent, please do not wait for a reply by email. Contact an available medical service.',
    ],
    quick: [
      {
        shortcut: '/תור',
        text: {
          formal: 'לזימון תור אונליין: {link}',
          warm: 'אפשר לקבוע תור כאן, בכל שעה: {link}',
          casual: 'קובעים תור פה: {link}',
        },
        noLink: {
          formal: 'לקביעת תור, אנא כתבו שם מלא, סוג הטיפול וימים נוחים.',
          warm: 'בשמחה. כתבו את שמכם, איזה טיפול ובאילו ימים נוח לכם, ונציע מועד.',
          casual: 'שם, טיפול וימים שנוחים לכם, ונקבע.',
        },
      },
      {
        shortcut: '/ביטול',
        text: {
          formal: 'לביטול או לשינוי תור, אנא הודיעו לנו מוקדם ככל האפשר, כדי שנוכל לתת את המועד למטופל אחר.',
          warm: 'משהו השתנה? אין בעיה. עדכנו אותנו מוקדם ככל האפשר, וכך מישהו אחר יוכל לקבל את התור.',
          casual: 'צריכים לבטל? עדכנו מוקדם ככל האפשר.',
        },
      },
      {
        shortcut: '/ראשון',
        text: {
          formal: 'לטיפול הראשון, אנא הגיעו כעשר דקות לפני המועד למילוי פרטים.',
          warm: 'לטיפול הראשון כדאי להגיע כמה דקות לפני, כדי שנספיק להכיר ולמלא פרטים.',
          casual: 'בפעם הראשונה הגיעו כמה דקות לפני.',
        },
      },
      {
        shortcut: '/מסמכים',
        text: {
          formal: 'מטעמי פרטיות, אנא אל תשלחו מסמכים רפואיים בצ׳אט. נתאם דרך אחרת להעביר אותם.',
          warm: 'כדי לשמור על הפרטיות שלכם, עדיף לא לשלוח כאן מסמכים רפואיים. נתאם איתכם דרך אחרת.',
          casual: 'מסמכים רפואיים לא שולחים פה. נתאם דרך אחרת.',
        },
      },
    ],
  },
  {
    id: 'office',
    label: 'עורכי דין ורו״ח',
    audience: 'למשרד עורכי דין ורואי חשבון',
    emoji: '📄',
    link: 'לקביעת פגישה: {link}',
    linkEn: 'Schedule a meeting: {link}',
    phone: 'לעניין דחוף: {phone}',
    greeting: [
      'כדי שנעביר את הפנייה לגורם המתאים, כתבו בקצרה במה מדובר ומה המועד הרלוונטי, אם יש.',
      'אם אתם לקוחות של המשרד, ציינו את שמכם המלא או את שם החברה, ונעביר את הפנייה למטפל בתיק.',
      'לפגישת ייעוץ ראשונה, כתבו את התחום ומתי נוח לכם, ונציע מועדים.',
    ],
    away: [
      'המשרד סגור כרגע. אם יש מועד הגשה או דיון קרוב, ציינו אותו בהודעה כדי שנטפל בה ראשונה.',
      'מסמכים אפשר לשלוח כבר עכשיו, ונעבור עליהם בתחילת יום העבודה.',
      'הפנייה התקבלה ותועבר לטיפול ביום העבודה הבא.',
    ],
    holiday: [
      'אם יש מועד הגשה או דיון שחל בימים האלה, ציינו אותו בהודעה ונטפל בה ראשונה.',
      'מסמכים ודוחות אפשר לשלוח כבר עכשיו, והם יטופלו לפי הסדר.',
      'פגישות שנקבעו לימים האלה יתואמו מחדש.',
    ],
    emailHe: [
      'אם יש מועד הגשה או דיון קרוב, ציינו אותו בשורת הנושא כדי שנטפל בפנייה ראשונה.',
      'מסמכים שתשלחו בזמן הזה יחכו לנו, ונעבור עליהם מיד כשנשוב.',
      'פגישות שנקבעו לימים האלה יתואמו מחדש.',
    ],
    emailEn: [
      'If there is a filing deadline or a hearing coming up, please mention it in the subject line so we can handle it first.',
      'Documents you send in the meantime will be waiting for us, and we will review them as soon as we are back.',
      'Meetings scheduled for these dates will be rescheduled.',
    ],
    quick: [
      {
        shortcut: '/פגישה',
        text: {
          formal: 'לקביעת פגישה במשרד או בשיחת וידאו: {link}',
          warm: 'אפשר לבחור מועד לפגישה כאן: {link}',
          casual: 'קובעים פגישה פה: {link}',
        },
        noLink: {
          formal: 'לתיאום פגישה, אנא ציינו את נושא הפגישה ומועדים נוחים.',
          warm: 'נשמח להיפגש. ספרו בקצרה על הנושא ומתי נוח לכם.',
          casual: 'על מה הפגישה ומתי נוח?',
        },
      },
      {
        shortcut: '/מסמכים',
        text: {
          formal: 'את המסמכים ניתן לשלוח במייל או כאן. אנא ציינו את שם הלקוח בכל קובץ.',
          warm: 'אפשר לשלוח את המסמכים כאן או במייל. כדאי לכתוב בשם הקובץ של מי הוא, וכך שום דבר לא ילך לאיבוד.',
          casual: 'שלחו את המסמכים פה או במייל, עם השם שלכם בשם הקובץ.',
        },
      },
      {
        shortcut: '/מחיר',
        text: {
          formal: 'שכר הטרחה נקבע לפי היקף העבודה. לאחר שיחת היכרות נשלח הצעה מסודרת.',
          warm: 'המחיר תלוי בהיקף של מה שצריך. אחרי שיחה קצרה נשלח לכם הצעה מסודרת, בלי הפתעות.',
          casual: 'תלוי בהיקף. אחרי שיחה קצרה נשלח הצעה.',
        },
      },
      {
        shortcut: '/סטטוס',
        text: {
          formal: 'נבדוק את מצב הטיפול בעניין שלכם ונעדכן בהקדם.',
          warm: 'בודקים מה המצב ונחזור אליכם עם עדכון.',
          casual: 'בודקים ומעדכנים.',
        },
      },
    ],
  },
  {
    id: 'garage',
    label: 'מוסך',
    audience: 'למוסך',
    emoji: '🔧',
    link: 'לקביעת תור לטיפול: {link}',
    linkEn: 'Book a service: {link}',
    phone: 'לתקלה בדרך: {phone}',
    greeting: [
      'כדי שנקבע לכם תור, כתבו את מספר הרכב ומה צריך: טיפול תקופתי, תקלה או טסט.',
      'אם יש תקלה, תארו מה קורה ושלחו תמונה של נורית האזהרה אם נדלקה.',
      'להצעת מחיר, כתבו את דגם הרכב, את שנת הייצור ומה צריך לעשות.',
    ],
    away: [
      'המוסך סגור כרגע. השאירו מספר רכב ומה צריך, ונתאם תור.',
      'אנחנו מתחת לרכב ולא ליד הטלפון. כתבו מה קורה עם הרכב.',
      'אם הרכב לא מניע או נתקע בדרך, עדיף להתקשר ולא לחכות לתשובה כאן.',
    ],
    holiday: [
      'רכבים שנמצאים אצלנו מחכים במוסך, ונעדכן אתכם מתי לבוא לאסוף.',
      'אפשר כבר עכשיו לבקש תור לימים שאחרי. כתבו מספר רכב ומה צריך.',
      'אם יש לכם טסט בקרוב, כדאי לקבוע תור כבר עכשיו.',
    ],
    emailHe: [
      'בקשות לתור יטופלו לפי סדר קבלתן. כתבו מספר רכב ומה צריך.',
      'חשבוניות וקבלות על טיפולים קודמים יישלחו לפי הסדר.',
      'לצי רכב או לחברות: כתבו כמה רכבים ומה צריך, ונשלח הצעה.',
    ],
    emailEn: [
      'Service requests will be handled in the order they arrived. Please include the registration number and what the car needs.',
      'Invoices and receipts for previous services will be sent in order.',
      'For company fleets, tell us how many vehicles and what they need, and we will send you an offer.',
    ],
    quick: [
      {
        shortcut: '/תור',
        text: {
          formal: 'לקביעת תור לטיפול: {link}',
          warm: 'אפשר לקבוע תור כאן ולבחור יום ושעה שנוחים לכם: {link}',
          casual: 'תור למוסך פה: {link}',
        },
        noLink: {
          formal: 'לתיאום תור, אנא שלחו מספר רכב, קילומטראז׳ וסוג הטיפול.',
          warm: 'בשמחה. מה מספר הרכב ומה צריך לעשות? נמצא לכם תור.',
          casual: 'מספר רכב ומה צריך? נמצא תור.',
        },
      },
      {
        shortcut: '/מוכן',
        text: {
          formal: 'הרכב מוכן לאיסוף. ניתן לאסוף אותו בשעות הפעילות.',
          warm: 'הרכב מוכן ומחכה לכם. אפשר לבוא לאסוף מתי שנוח לכם בשעות הפעילות.',
          casual: 'הרכב מוכן, אפשר לבוא.',
        },
      },
      {
        shortcut: '/הצעה',
        text: {
          formal: 'להצעת מחיר, אנא ציינו דגם, שנת ייצור ומה נדרש לבצע.',
          warm: 'כדי שנגיד לכם מחיר, צריך דגם, שנה ומה בדיוק צריך לעשות. תמונה תמיד עוזרת.',
          casual: 'דגם, שנה ומה צריך? נחזור עם מחיר.',
        },
      },
      {
        shortcut: '/טסט',
        text: {
          formal: 'לפני טסט אנו מבצעים בדיקה מקדימה. לתיאום, שלחו מספר רכב ואת תאריך הטסט.',
          warm: 'יש טסט בקרוב? נבדוק את הרכב לפני, כדי שלא תצטרכו לחזור פעמיים. שלחו מספר רכב ותאריך.',
          casual: 'טסט בקרוב? שלחו מספר רכב ותאריך, נבדוק לפני.',
        },
      },
    ],
  },
  {
    id: 'realestate',
    label: 'נדל״ן ותיווך',
    audience: 'למשרד תיווך ונדל״ן',
    emoji: '🏠',
    link: 'הנכסים שלנו: {link}',
    linkEn: 'Our listings: {link}',
    phone: 'לתיאום ביקור מהיר: {phone}',
    greeting: [
      'אם הפנייה לגבי נכס מסוים, שלחו קישור למודעה או כתובת, ונחזור עם פרטים ומועד לביקור.',
      'מחפשים נכס? כתבו אזור, מספר חדרים ותקציב, ונשלח לכם את מה שמתאים.',
      'רוצים למכור או להשכיר נכס? כתבו כתובת וגודל, ונתאם פגישה.',
    ],
    away: [
      'אנחנו בסיור בנכס ולא עונים בזמן אמת. כתבו על איזה נכס מדובר.',
      'המשרד סגור כרגע. בקשות לביקור בנכסים יתואמו ביום העבודה הבא.',
      'כדי לחסוך זמן, כתבו כבר עכשיו אזור, מספר חדרים ותקציב.',
    ],
    holiday: [
      'בקשות לביקור בנכסים אפשר להשאיר כבר עכשיו, והן יתואמו לפי הסדר.',
      'בעלי נכסים שרוצים לפרסם אצלנו מוזמנים לשלוח כתובת ופרטים.',
      'עסקאות שבתהליך ממשיכות כמתוכנן.',
    ],
    emailHe: [
      'בקשות לביקור בנכס יתואמו לפי סדר קבלתן.',
      'בפנייה על נכס מסוים, צרפו את הכתובת או את הקישור למודעה.',
      'עסקאות שבתהליך ממשיכות כמתוכנן.',
    ],
    emailEn: [
      'Viewing requests will be scheduled in the order they arrived.',
      'If you are writing about a specific property, please include the address or a link to the listing.',
      'Deals already in progress continue as planned.',
    ],
    quick: [
      {
        shortcut: '/נכסים',
        text: {
          formal: 'הנכסים הזמינים כרגע: {link}',
          warm: 'כל הנכסים שיש לנו כרגע נמצאים כאן: {link}\nמשהו תפס לכם את העין? כתבו לנו.',
          casual: 'כל הנכסים פה: {link}',
        },
        noLink: {
          formal: 'אנא ציינו אזור, מספר חדרים ותקציב, ונשלח נכסים מתאימים.',
          warm: 'ספרו לנו מה אתם מחפשים: אזור, חדרים ותקציב, ונשלח נכסים שמתאימים.',
          casual: 'אזור, חדרים ותקציב? נשלח מה שיש.',
        },
      },
      {
        shortcut: '/ביקור',
        text: {
          formal: 'לתיאום ביקור בנכס, אנא ציינו את הנכס ומועדים נוחים.',
          warm: 'בשמחה נראה לכם את הנכס. מתי נוח לכם להגיע?',
          casual: 'מתי נוח לבוא לראות?',
        },
      },
      {
        shortcut: '/מוכרים',
        text: {
          formal: 'למכירה או להשכרה של נכס, אנא שלחו כתובת, גודל ומצב הנכס, ונתאם פגישה.',
          warm: 'רוצים למכור או להשכיר? שלחו כתובת וכמה מילים על הנכס, ונבוא לראות.',
          casual: 'מוכרים או משכירים? שלחו כתובת ונתאם.',
        },
      },
      {
        shortcut: '/עדכון',
        text: {
          formal: 'נשמח לעדכן אתכם כשייכנס נכס שמתאים לדרישות שלכם.',
          warm: 'עוד לא מצאתם? נשמור את מה שאתם מחפשים ונעדכן ברגע שייכנס משהו מתאים.',
          casual: 'נעדכן כשיגיע משהו מתאים.',
        },
      },
    ],
  },
]

export const businessOptions = businesses.map(({ id, label }) => ({ id, label }))

const businessById = (id: BusinessId) => businesses.find((business) => business.id === id) ?? businesses[0]

const HEBREW_START = /^[א-ת]/

const attach = (prefix: string, name: string) => (HEBREW_START.test(name) ? `${prefix}${name}` : `${prefix}-${name}`)

const named = (name: string, withName: (value: string) => string, without: string) =>
  name ? withName(name) : without

const GREETING_OPENERS: ByTone<[Opener, Opener, Opener]> = {
  formal: [
    (name) => named(name, (n) => `שלום, תודה שפניתם ${attach('ל', n)}.`, 'שלום, תודה שפניתם אלינו.'),
    (name) => named(name, (n) => `שלום רב, הגעתם ${attach('ל', n)}.`, 'שלום רב, ותודה על פנייתכם.'),
    (name) => named(name, (n) => `תודה על פנייתכם ${attach('ל', n)}.`, 'תודה על פנייתכם.'),
  ],
  warm: [
    (name) => named(name, (n) => `היי, כיף שכתבתם ${attach('ל', n)}.`, 'היי, כיף שכתבתם לנו.'),
    (name) => named(name, (n) => `שלום וברוכים הבאים ${attach('ל', n)}.`, 'שלום וברוכים הבאים.'),
    (name) => named(name, (n) => `שלום, כאן ${n}. שמחים שפניתם.`, 'שלום, שמחים שפניתם אלינו.'),
  ],
  casual: [
    (name) => named(name, (n) => `היי, כאן ${n}.`, 'היי, קיבלנו את ההודעה.'),
    (name) => named(name, (n) => `אהלן ${attach('מ', n)}.`, 'אהלן, תודה שכתבתם.'),
    (name) => named(name, (n) => `היי, תודה שכתבתם ${attach('ל', n)}.`, 'היי, תודה על ההודעה.'),
  ],
}

const AWAY_OPENERS: ByTone<[Opener, Opener, Opener]> = {
  formal: [
    (name) => named(name, (n) => `שלום, תודה שפניתם ${attach('ל', n)}.`, 'שלום, תודה על פנייתכם.'),
    (name) => named(name, (n) => `שלום רב ${attach('מ', n)}.`, 'שלום רב,'),
    (name) => named(name, (n) => `תודה על הודעתכם ${attach('ל', n)}.`, 'תודה על הודעתכם.'),
  ],
  warm: [
    (name) => named(name, (n) => `היי, תודה שכתבתם ${attach('ל', n)}.`, 'היי, תודה שכתבתם.'),
    (name) => named(name, (n) => `שלום ${attach('מ', n)}.`, 'שלום,'),
    (name) => named(name, (n) => `תודה על ההודעה, כאן ${n}.`, 'תודה על ההודעה.'),
  ],
  casual: [
    (name) => named(name, (n) => `היי, כאן ${n}.`, 'היי,'),
    (name) => named(name, (n) => `אהלן ${attach('מ', n)}.`, 'אהלן,'),
    (name) => named(name, (n) => `היי ${attach('מ', n)}.`, 'היי, תודה על ההודעה.'),
  ],
}

const GREETING_CLOSINGS: ByTone<Trio> = {
  formal: ['נשיב לכם בהקדם.', 'נציג יחזור אליכם בהקדם האפשרי.', 'נחזור אליכם במהלך שעות הפעילות.'],
  warm: ['נחזור אליכם ממש בקרוב.', 'אנחנו כבר על זה.', 'עוד מעט חוזרים אליכם.'],
  casual: ['תכף עונים.', 'חוזרים אליכם עוד רגע.', 'נענה בקרוב.'],
}

const AWAY_CLOSINGS: ByTone<Trio> = {
  formal: ['נשיב לפנייתכם ביום העבודה הבא.', 'נחזור אליכם בהקדם בשעות הפעילות.', 'תודה על הסבלנות.'],
  warm: ['נחזור אליכם ממש בקרוב.', 'מבטיחים לחזור אליכם.', 'תודה על הסבלנות, נדבר בקרוב.'],
  casual: ['נחזור אליכם.', 'נדבר בקרוב.', 'עונים ברגע שחוזרים.'],
}

const HOLIDAY_CLOSINGS: ByTone<Trio> = {
  formal: ['פניות שיתקבלו בימים אלה ייענו לפי סדר קבלתן.', 'תודה על הסבלנות.', 'נשמח לעמוד לרשותכם כשנשוב.'],
  warm: ['נענה לכל ההודעות כשנחזור.', 'תודה על הסבלנות.', 'מחכים לראות אתכם.'],
  casual: ['נענה כשנחזור.', 'נתראה.', 'נדבר אחרי.'],
}

const CLOSED: Record<OccasionId, ByTone<Trio>> = {
  vacation: {
    formal: ['העסק סגור בימים אלה לרגל חופשה.', 'אנו נמצאים בחופשה.', 'בימים אלה איננו זמינים לרגל חופשה.'],
    warm: ['יצאנו לכמה ימים של חופשה.', 'אנחנו בחופשה קצרה, אוגרים כוחות.', 'לקחנו כמה ימי חופש.'],
    casual: ['אנחנו בחופש.', 'יצאנו לחופשה.', 'סגורים לכמה ימים, חופש.'],
  },
  holiday: {
    formal: ['העסק סגור לרגל החג.', 'לרגל החג, העסק סגור.', 'בימי החג העסק אינו פעיל.'],
    warm: ['אנחנו סגורים בחג וחוגגים עם המשפחה.', 'העסק סגור בחג, וחג שמח לכם.', 'לקחנו כמה ימים לחגוג עם המשפחה.'],
    casual: ['סגורים לחג.', 'חג שמח, אנחנו סגורים.', 'יצאנו לחגוג.'],
  },
}

const OCCASION_EMOJI: Record<OccasionId, string> = { vacation: '🌴', holiday: '✨' }

const HOURS_LINE: Record<'greeting' | 'away', ByTone<string>> = {
  greeting: { formal: 'שעות הפעילות: {hours}', warm: 'אנחנו זמינים {hours}', casual: 'זמינים {hours}' },
  away: { formal: 'שעות הפעילות שלנו: {hours}', warm: 'אנחנו כאן {hours}', casual: 'פתוחים {hours}' },
}

const RETURN_SENTENCE: ByTone<string> = {
  formal: 'נשוב לפעילות {day}.',
  warm: 'חוזרים {day}.',
  casual: 'חוזרים {day}.',
}

const EMAIL_GREETING: ByTone<Trio> = {
  formal: ['שלום רב,', 'שלום,', 'שלום רב,'],
  warm: ['שלום,', 'היי,', 'שלום,'],
  casual: ['היי,', 'היי,', 'שלום,'],
}

const EMAIL_THANKS: ByTone<Trio> = {
  formal: ['תודה על פנייתכם.', 'קיבלנו את הודעתכם.', 'תודה על הודעתכם.'],
  warm: ['תודה על המייל.', 'תודה שכתבתם לנו.', 'קיבלנו את המייל, תודה.'],
  casual: ['תודה על המייל.', 'קיבלנו.', 'תודה שכתבתם.'],
}

const EMAIL_CLOSED: Record<OccasionId, ByTone<Trio>> = {
  vacation: {
    formal: [
      'אנו מחוץ למשרד לרגל חופשה.',
      'אנו בחופשה בימים אלה.',
      'בימים אלה אנו בחופשה ואיננו בודקים דואר באופן שוטף.',
    ],
    warm: ['אנחנו בחופשה קצרה ולא בודקים מיילים כל יום.', 'יצאנו לכמה ימי חופשה.', 'אנחנו מחוץ למשרד לכמה ימים.'],
    casual: ['אנחנו בחופש.', 'יצאנו לחופשה.', 'אנחנו מחוץ למשרד.'],
  },
  holiday: {
    formal: ['אנו מחוץ למשרד לרגל החג.', 'לרגל החג, איננו זמינים בימים אלה.', 'העסק סגור בימי החג.'],
    warm: ['אנחנו סגורים בחג וחוגגים עם המשפחה.', 'אנחנו סגורים בחג, וחג שמח לכם.', 'לקחנו כמה ימים לחג.'],
    casual: ['סגורים לחג.', 'חג שמח, אנחנו סגורים.', 'יצאנו לחג.'],
  },
}

const EMAIL_RETURN: ByTone<string> = {
  formal: 'נשוב לעבודה {day}.',
  warm: 'נחזור לעבודה {day}.',
  casual: 'חוזרים {day}.',
}

const EMAIL_SIGN: ByTone<string> = { formal: 'בברכה,', warm: 'תודה ויום טוב,', casual: 'תודה,' }

type SubjectSet = { plain: [string, string]; dated: (day: string) => string; undated: string }

const EMAIL_SUBJECTS: Record<OccasionId, SubjectSet> = {
  vacation: {
    plain: ['מחוץ למשרד', 'מענה אוטומטי: בחופשה'],
    dated: (day) => `בחופשה, חוזרים ${day}`,
    undated: 'בחופשה',
  },
  holiday: {
    plain: ['מחוץ למשרד לרגל החג', 'מענה אוטומטי: סגורים לרגל החג'],
    dated: (day) => `סגורים לחג, חוזרים ${day}`,
    undated: 'סגורים לרגל החג',
  },
}

const EN_GREETING: ByTone<Trio> = {
  formal: ['Hello,', 'Hello,', 'Good day,'],
  warm: ['Hi,', 'Hi,', 'Hello,'],
  casual: ['Hi there,', 'Hi,', 'Hey,'],
}

const EN_THANKS: ByTone<Trio> = {
  formal: ['Thank you for your email.', 'Thank you for contacting us.', 'We have received your message.'],
  warm: ['Thanks for your email.', 'Thanks for getting in touch.', 'Thanks for reaching out.'],
  casual: ['Thanks for writing.', 'Got your email, thanks.', 'Thanks for the message.'],
}

const EN_CLOSED: Record<OccasionId, ByTone<Trio>> = {
  vacation: {
    formal: [
      'We are out of the office on vacation.',
      'We are currently on vacation.',
      'We are on vacation and are not checking email regularly.',
    ],
    warm: ['We are taking a few days off.', 'We are away on a short vacation.', 'We are out of the office for a few days.'],
    casual: ['We are on vacation.', 'We are off for a few days.', 'We are out of the office.'],
  },
  holiday: {
    formal: [
      'Our office is closed for the holiday.',
      'In observance of the holiday, we are not available.',
      'We are closed for the holiday.',
    ],
    warm: [
      'We are closed for the holiday and spending it with family.',
      'We are closed for the holiday. Chag sameach.',
      'We are taking a few days off for the holiday.',
    ],
    casual: ['Closed for the holiday.', 'Chag sameach, we are closed.', 'We are off for the holiday.'],
  },
}

const EN_RETURN: ByTone<string> = {
  formal: 'We will be back on {day}.',
  warm: 'We will be back on {day}.',
  casual: 'Back on {day}.',
}

const EN_PHONE: ByTone<string> = {
  formal: 'For urgent matters, please call {phone}.',
  warm: 'If it is urgent, call us at {phone}.',
  casual: 'Urgent? Call {phone}.',
}

const EN_SIGN: ByTone<string> = { formal: 'Best regards,', warm: 'Thanks,', casual: 'Talk soon,' }

const EN_SUBJECTS: Record<OccasionId, SubjectSet> = {
  vacation: {
    plain: ['Out of office', 'Automatic reply: on vacation'],
    dated: (day) => `On vacation, back on ${day}`,
    undated: 'On vacation',
  },
  holiday: {
    plain: ['Out of office for the holiday', 'Automatic reply: closed for the holiday'],
    dated: (day) => `Closed for the holiday, back on ${day}`,
    undated: 'Closed for the holiday',
  },
}

const QUICK_HOURS: QuickItem = {
  shortcut: '/שעות',
  text: {
    formal: 'שעות הפעילות שלנו: {hours}',
    warm: 'אנחנו כאן {hours}. מחכים לכם.',
    casual: 'פתוחים {hours}.',
  },
}

const QUICK_PHONE: QuickItem = {
  shortcut: '/טלפון',
  text: {
    formal: 'ניתן להשיג אותנו גם בטלפון: {phone}',
    warm: 'נוח לכם יותר לדבר? אפשר להתקשר: {phone}',
    casual: 'אפשר גם להרים טלפון: {phone}',
  },
}

const HE_WEEKDAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי']
const HE_MONTHS = [
  'ינואר',
  'פברואר',
  'מרץ',
  'אפריל',
  'מאי',
  'יוני',
  'יולי',
  'אוגוסט',
  'ספטמבר',
  'אוקטובר',
  'נובמבר',
  'דצמבר',
]
const EN_WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const EN_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const SATURDAY = 6

type DateParts = { weekday: number; day: number; month: number }

function parseDate(iso: string): DateParts | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  return { weekday: date.getUTCDay(), day, month: month - 1 }
}

export function hebrewDay(iso: string) {
  const parts = parseDate(iso)
  if (!parts) return ''
  const when = parts.weekday === SATURDAY ? 'בשבת' : `ביום ${HE_WEEKDAYS[parts.weekday]}`
  return `${when}, ${parts.day} ב${HE_MONTHS[parts.month]}`
}

const hebrewShortDay = (iso: string) => {
  const parts = parseDate(iso)
  return parts ? `ב-${parts.day} ב${HE_MONTHS[parts.month]}` : ''
}

export function englishDay(iso: string) {
  const parts = parseDate(iso)
  return parts ? `${EN_WEEKDAYS[parts.weekday]}, ${parts.day} ${EN_MONTHS[parts.month]}` : ''
}

const englishShortDay = (iso: string) => {
  const parts = parseDate(iso)
  return parts ? `${parts.day} ${EN_MONTHS[parts.month]}` : ''
}

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)

const sentences = (...parts: string[]) => parts.filter(Boolean).join(' ')

const lines = (...parts: string[]) => parts.filter(Boolean).join('\n')

const paragraphs = (...parts: string[]) => parts.filter(Boolean).join('\n\n')

type Clean = { name: string; hours: string; link: string; phone: string; returnDate: string }

const clean = (input: AutoReplyInput): Clean => ({
  name: input.name.trim(),
  hours: input.hours.trim(),
  link: input.link.trim(),
  phone: input.phone.trim(),
  returnDate: parseDate(input.returnDate) ? input.returnDate : '',
})

const decorate = (text: string, input: AutoReplyInput, emoji: string) =>
  input.emoji && fieldsFor(input.type).emoji ? `${text} ${emoji}` : text

const single = (id: string, text: string): AutoReply => ({ id, text, blocks: [{ lang: 'he', text }] })

function buildGreeting(input: AutoReplyInput, values: Clean): AutoReply[] {
  const business = businessById(input.business)
  return business.greeting.map((core, index) => {
    const body = decorate(sentences(core, GREETING_CLOSINGS[input.tone][index]), input, business.emoji)
    const details = lines(
      values.hours ? fill(HOURS_LINE.greeting[input.tone], values) : '',
      values.link ? fill(business.link, values) : '',
    )
    const text = paragraphs(lines(GREETING_OPENERS[input.tone][index](values.name), body), details)
    return single(`greeting-${index}`, text)
  })
}

function buildAway(input: AutoReplyInput, values: Clean): AutoReply[] {
  const business = businessById(input.business)
  return business.away.map((core, index) => {
    const body = decorate(sentences(core, AWAY_CLOSINGS[input.tone][index]), input, business.emoji)
    const details = lines(
      values.hours ? fill(HOURS_LINE.away[input.tone], values) : '',
      values.link ? fill(business.link, values) : '',
      values.phone ? fill(business.phone, values) : '',
    )
    const text = paragraphs(lines(AWAY_OPENERS[input.tone][index](values.name), body), details)
    return single(`away-${index}`, text)
  })
}

function buildHoliday(input: AutoReplyInput, values: Clean): AutoReply[] {
  const business = businessById(input.business)
  const day = hebrewDay(values.returnDate)
  return business.holiday.map((core, index) => {
    const body = decorate(
      sentences(
        CLOSED[input.occasion][input.tone][index],
        day ? fill(RETURN_SENTENCE[input.tone], { day }) : '',
        core,
        HOLIDAY_CLOSINGS[input.tone][index],
      ),
      input,
      OCCASION_EMOJI[input.occasion],
    )
    const details = lines(
      values.link ? fill(business.link, values) : '',
      values.phone ? fill(business.phone, values) : '',
    )
    const text = paragraphs(lines(AWAY_OPENERS[input.tone][index](values.name), body), details)
    return single(`holiday-${index}`, text)
  })
}

function quickText(item: QuickItem, tone: ToneId, values: Clean) {
  if (item.noLink && !values.link) return item.noLink[tone]
  return fill(item.text[tone], values)
}

function buildQuick(input: AutoReplyInput, values: Clean): AutoReply[] {
  const business = businessById(input.business)
  const items = [
    ...business.quick,
    ...(values.hours ? [QUICK_HOURS] : []),
    ...(values.phone ? [QUICK_PHONE] : []),
  ]
  return items.map((item) => ({
    ...single(`quick-${item.shortcut.slice(1)}`, quickText(item, input.tone, values)),
    shortcut: item.shortcut,
  }))
}

function pickSubject(set: SubjectSet, index: number, shortDay: string) {
  if (index < set.plain.length) return set.plain[index]
  return shortDay ? set.dated(shortDay) : set.undated
}

function hebrewEmail(input: AutoReplyInput, values: Clean, index: number) {
  const business = businessById(input.business)
  const day = hebrewDay(values.returnDate)
  const sign = values.name ? lines(EMAIL_SIGN[input.tone], values.name) : ''
  const body = paragraphs(
    EMAIL_GREETING[input.tone][index],
    lines(
      sentences(
        EMAIL_THANKS[input.tone][index],
        EMAIL_CLOSED[input.occasion][input.tone][index],
        day ? fill(EMAIL_RETURN[input.tone], { day }) : '',
      ),
      business.emailHe[index],
    ),
    lines(values.phone ? fill(business.phone, values) : '', values.link ? fill(business.link, values) : ''),
    sign,
  )
  return { body, subject: pickSubject(EMAIL_SUBJECTS[input.occasion], index, hebrewShortDay(values.returnDate)) }
}

function englishEmail(input: AutoReplyInput, values: Clean, index: number) {
  const business = businessById(input.business)
  const day = englishDay(values.returnDate)
  const sign = values.name ? lines(EN_SIGN[input.tone], values.name) : ''
  const body = paragraphs(
    EN_GREETING[input.tone][index],
    lines(
      sentences(
        EN_THANKS[input.tone][index],
        EN_CLOSED[input.occasion][input.tone][index],
        day ? fill(EN_RETURN[input.tone], { day }) : '',
      ),
      business.emailEn[index],
    ),
    lines(values.phone ? fill(EN_PHONE[input.tone], values) : '', values.link ? fill(business.linkEn, values) : ''),
    sign,
  )
  return { body, subject: pickSubject(EN_SUBJECTS[input.occasion], index, englishShortDay(values.returnDate)) }
}

const EMAIL_DIVIDER = '\n\n———\n\n'

function buildEmail(input: AutoReplyInput, values: Clean): AutoReply[] {
  return [0, 1, 2].map((index) => {
    const he = hebrewEmail(input, values, index)
    const en = englishEmail(input, values, index)
    const id = `email-${index}`
    if (input.language === 'he') return { id, text: he.body, blocks: [{ lang: 'he', text: he.body }], subject: he.subject }
    if (input.language === 'en') return { id, text: en.body, blocks: [{ lang: 'en', text: en.body }], subject: en.subject }
    return {
      id,
      text: `${he.body}${EMAIL_DIVIDER}${en.body}`,
      blocks: [
        { lang: 'he', text: he.body },
        { lang: 'en', text: en.body },
      ],
      subject: `${he.subject} | ${en.subject}`,
    }
  })
}

export function buildReplies(input: AutoReplyInput): AutoReply[] {
  const values = clean(input)
  if (input.type === 'away') return buildAway(input, values)
  if (input.type === 'quick') return buildQuick(input, values)
  if (input.type === 'holiday') return buildHoliday(input, values)
  if (input.type === 'email') return buildEmail(input, values)
  return buildGreeting(input, values)
}

const TYPE_TITLES: Record<MessageType, string> = {
  greeting: 'הודעות פתיחה',
  away: 'הודעות היעדרות',
  quick: 'תשובות מהירות',
  holiday: 'הודעות חופשה',
  email: 'מענה אוטומטי במייל',
}

export function replyHeading(input: Pick<AutoReplyInput, 'type' | 'business' | 'occasion'>) {
  const title =
    input.type === 'holiday' && input.occasion === 'holiday' ? 'הודעות על סגירה בחג' : TYPE_TITLES[input.type]
  return `${title} ${businessById(input.business).audience}`
}

export const WHERE_TO_PASTE: Record<MessageType, string> = {
  greeting:
    'בוואטסאפ ביזנס: לשונית כלים ← הודעת פתיחה. היא נשלחת למי שכותב לכם בפעם הראשונה או אחרי 14 ימים בלי הודעות.',
  away: 'בוואטסאפ ביזנס: לשונית כלים ← הודעת ״העסק סגור כרגע״, ושם בוחרים מתי היא נשלחת: תמיד, בזמנים שתגדירו או מחוץ לשעות הפעילות.',
  quick: `בוואטסאפ ביזנס: לשונית כלים ← תשובות מהירות. בצ׳אט מקלידים / ובוחרים תשובה. אפשר לשמור עד ${QUICK_REPLY_LIMIT} תשובות.`,
  holiday:
    'בוואטסאפ ביזנס: לשונית כלים ← הודעת ״העסק סגור כרגע״, עם זמני שליחה מותאמים אישית לימים שבהם העסק סגור.',
  email: 'ב-Gmail: הגדרות ← הצגת כל ההגדרות ← כללי ← הודעת חופשה. ב-Outlook הקלאסי: קובץ ← תשובות אוטומטיות.',
}

export const combineQuickReplies = (replies: AutoReply[]) =>
  replies.map((reply) => lines(reply.shortcut ?? '', reply.text)).join('\n\n')

const segmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter('he', { granularity: 'grapheme' }) : null

export function countCharacters(text: string) {
  if (segmenter) return [...segmenter.segment(text)].length
  return Array.from(text).length
}
