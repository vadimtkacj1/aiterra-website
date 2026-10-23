export type PromptCategoryId =
  | 'social'
  | 'product'
  | 'email'
  | 'review'
  | 'video'
  | 'quote'
  | 'ad'
  | 'meeting'
  | 'data'
  | 'image'
  | 'code'
  | 'support'

export type PromptKind = 'text' | 'analysis' | 'image' | 'code'

export type ToneId = 'friendly' | 'professional' | 'formal' | 'light' | 'persuasive' | 'calm'

export type LengthId = 'short' | 'medium' | 'long'

export type LanguageId = 'he' | 'en'

export type AddressId = 'plural' | 'male' | 'female' | 'neutral'

export type ImageTextId = 'none' | 'he' | 'en'

export type VariantId = 'short' | 'detailed' | 'stepByStep'

export type PromptInput = {
  category: PromptCategoryId
  role: string
  business: string
  audience: string
  detail: string
  constraints: string
  tone: ToneId | null
  length: LengthId
  format: string
  language: LanguageId
  address: AddressId
  imageText: ImageTextId
  example: string
}

export type LengthOption = { label: string; text: string }

export type PromptCategory = {
  id: PromptCategoryId
  label: string
  kind: PromptKind
  readerFacing: boolean
  role: string
  task: string
  detailLabel: string
  detailPrefix: string
  detailPlaceholder: string
  detailFallback: string
  quoteDetail: boolean
  audience: string
  constraints: string[]
  format: string
  lengthLegend: string
  lengths: Record<LengthId, LengthOption>
  tone: ToneId
  steps: string[]
  finish: string
}

export type ToneOption = { id: ToneId; label: string; moodLabel: string; text: string; mood: string }

export type LibraryPrompt = {
  id: string
  category: PromptCategoryId
  title: string
  when: string
  text: string
}

export const tones: ToneOption[] = [
  {
    id: 'friendly',
    label: 'ידידותי',
    moodLabel: 'חמה',
    text: 'חם וידידותי, כמו בעל עסק שמדבר עם לקוח קבוע',
    mood: 'חמה ומזמינה',
  },
  {
    id: 'professional',
    label: 'מקצועי',
    moodLabel: 'נקייה',
    text: 'מקצועי וענייני, בלי מילים שיווקיות מוגזמות',
    mood: 'נקייה ומקצועית',
  },
  { id: 'formal', label: 'רשמי', moodLabel: 'יוקרתית', text: 'רשמי ומנומס', mood: 'יוקרתית ומאופקת' },
  { id: 'light', label: 'קליל', moodLabel: 'שמחה', text: 'קליל, עם הומור עדין', mood: 'צבעונית ושמחה' },
  {
    id: 'persuasive',
    label: 'משכנע',
    moodLabel: 'דרמטית',
    text: 'משכנע, עם יתרונות ברורים ובלי הבטחות מוגזמות',
    mood: 'דרמטית, עם הנושא במרכז',
  },
  {
    id: 'calm',
    label: 'אמפתי',
    moodLabel: 'רגועה',
    text: 'רגוע ואמפתי, שמכיר בתחושות של הקורא',
    mood: 'רגועה ושקטה',
  },
]

export const variants: { id: VariantId; label: string; hint: string }[] = [
  { id: 'short', label: 'קצר', hint: 'פסקה אחת' },
  { id: 'detailed', label: 'מפורט', hint: 'לפי המבנה המלא' },
  { id: 'stepByStep', label: 'שלב אחר שלב', hint: 'עם תוכנית לפני התשובה' },
]

export const languages: { id: LanguageId; label: string }[] = [
  { id: 'he', label: 'עברית' },
  { id: 'en', label: 'אנגלית' },
]

export const addresses: { id: AddressId; label: string }[] = [
  { id: 'plural', label: 'ברבים (אתם)' },
  { id: 'male', label: 'ביחיד (אתה)' },
  { id: 'female', label: 'ביחידה (את)' },
  { id: 'neutral', label: 'בלי לשון זכר או נקבה' },
]

export const imageTexts: { id: ImageTextId; label: string }[] = [
  { id: 'none', label: 'בלי טקסט' },
  { id: 'he', label: 'טקסט קצר בעברית' },
  { id: 'en', label: 'טקסט קצר באנגלית' },
]

export const DEFAULT_CATEGORY: PromptCategoryId = 'social'
export const DEFAULT_VARIANT: VariantId = 'detailed'

export const promptCategories: PromptCategory[] = [
  {
    id: 'social',
    label: 'פוסט לרשתות',
    kind: 'text',
    readerFacing: true,
    role: 'קופירייטר שכותב פוסטים לפייסבוק ולאינסטגרם עבור עסקים קטנים בישראל',
    task: 'כתוב פוסט לפייסבוק ולאינסטגרם של העסק.',
    detailLabel: 'על מה הפוסט',
    detailPrefix: 'הנושא',
    detailPlaceholder: 'למשל: מבצע של 20% הנחה על תספורת לילדים עד סוף החודש',
    detailFallback: 'הנושא: היכרות עם העסק והזמנה לפנות אלינו.',
    quoteDetail: false,
    audience: 'לקוחות פוטנציאליים שגוללים את הפיד בטלפון',
    constraints: [
      'פתח במשפט שעוצר את הגלילה, בלי "שלום לכולם" ובלי שאלה רטורית.',
      'סיים בקריאה לפעולה אחת וברורה.',
      'עד 3 אימוג׳ים, ורק אם הם מוסיפים משהו.',
    ],
    format: 'טקסט הפוסט, ואחריו שורה עם 3 עד 5 האשטגים בעברית',
    lengthLegend: 'אורך',
    lengths: {
      short: { label: 'קצר', text: 'עד 40 מילים' },
      medium: { label: 'בינוני', text: 'בין 60 ל-100 מילים' },
      long: { label: 'ארוך', text: 'בין 150 ל-200 מילים' },
    },
    tone: 'friendly',
    steps: [
      'מצא את הדבר האחד שהקהל הזה הכי רוצה לשמוע מהעסק.',
      'כתוב שלוש פתיחות שונות ובחר את החזקה ביותר.',
      'בנה את הפוסט סביב הפתיחה שבחרת, עם קריאה לפעולה אחת.',
    ],
    finish: 'כתוב את הפוסט',
  },
  {
    id: 'product',
    label: 'תיאור מוצר לחנות',
    kind: 'text',
    readerFacing: true,
    role: 'קופירייטר לחנויות אונליין, שכותב תיאורי מוצר שמוכרים ומתאימים גם לחיפוש בגוגל',
    task: 'כתוב תיאור מוצר לדף מוצר בחנות האונליין שלנו.',
    detailLabel: 'פרטי המוצר',
    detailPrefix: 'פרטי המוצר',
    detailPlaceholder: 'למשל: כיסא משרדי ארגונומי, משענת רשת, כוונון גובה, אחריות לשנתיים, 890 ₪',
    detailFallback: 'את פרטי המוצר אמסור מיד אחרי ההנחיות.',
    quoteDetail: false,
    audience: 'קונים שמשווים בין כמה חנויות לפני שהם מחליטים',
    constraints: [
      'התחל במה שהמוצר נותן לקונה, ורק אחר כך במפרט.',
      'שלב את שם המוצר כפי שאנשים מחפשים אותו בגוגל, בצורה טבעית.',
      'ענה בטקסט על ההתלבטות הנפוצה לפני קנייה של מוצר כזה.',
    ],
    format: 'פסקת פתיחה, רשימה של 4 עד 6 יתרונות, ושורת מפרט עם מידות, חומרים ואחריות',
    lengthLegend: 'אורך',
    lengths: {
      short: { label: 'קצר', text: 'עד 60 מילים' },
      medium: { label: 'בינוני', text: 'בין 100 ל-150 מילים' },
      long: { label: 'ארוך', text: 'בין 200 ל-300 מילים' },
    },
    tone: 'persuasive',
    steps: [
      'רשום את התכונות של המוצר, ולכל תכונה כתוב מה הקונה מרוויח ממנה.',
      'חשוב מה מתלבט הקונה לפני קנייה של מוצר כזה, ואיך הטקסט יענה על זה.',
      'כתוב את התיאור לפי הפורמט.',
    ],
    finish: 'כתוב את תיאור המוצר',
  },
  {
    id: 'email',
    label: 'מייל ללקוח',
    kind: 'text',
    readerFacing: true,
    role: 'מנהל קשרי לקוחות מנוסה, שכותב מיילים ברורים ומנומסים',
    task: 'כתוב מייל ללקוח של העסק.',
    detailLabel: 'על מה המייל',
    detailPrefix: 'מה צריך להגיד במייל',
    detailPlaceholder: 'למשל: ההזמנה תתעכב ב-5 ימי עסקים בגלל עיכוב אצל הספק, ואנחנו מציעים משלוח חינם',
    detailFallback: 'את מה שצריך להגיד במייל אמסור מיד אחרי ההנחיות.',
    quoteDetail: false,
    audience: 'לקוח קיים של העסק',
    constraints: [
      'שורת נושא שאומרת בדיוק על מה המייל.',
      'המשפט הראשון אומר את העיקר, בלי הקדמות.',
      'בקשה אחת או צעד הבא אחד, עם תאריך אם יש.',
    ],
    format: 'שורת נושא, פנייה, גוף המייל בפסקאות קצרות וחתימה',
    lengthLegend: 'אורך',
    lengths: {
      short: { label: 'קצר', text: 'עד 80 מילים' },
      medium: { label: 'בינוני', text: 'בין 100 ל-150 מילים' },
      long: { label: 'ארוך', text: 'עד 250 מילים' },
    },
    tone: 'professional',
    steps: [
      'קבע מה הדבר האחד שהלקוח צריך לדעת או לעשות אחרי שיקרא.',
      'חשוב מה הלקוח עלול לשאול בתגובה, וענה על זה מראש במייל.',
      'כתוב את המייל לפי הפורמט.',
    ],
    finish: 'כתוב את המייל',
  },
  {
    id: 'review',
    label: 'תשובה לביקורת בגוגל',
    kind: 'text',
    readerFacing: true,
    role: 'בעל העסק, שעונה בעצמו לביקורות בגוגל בצורה אישית ומקצועית',
    task: 'כתוב תשובה פומבית לביקורת שלקוח השאיר על העסק בגוגל.',
    detailLabel: 'הביקורת',
    detailPrefix: 'הביקורת',
    detailPlaceholder: 'הדביקו כאן את הביקורת, למשל: "חיכיתי 40 דקות אף שקבעתי תור"',
    detailFallback: 'את הביקורת אדביק מיד אחרי ההנחיות.',
    quoteDetail: true,
    audience: 'הלקוח שכתב את הביקורת, וגם אנשים שיקראו את התשובה לפני שיבחרו בעסק',
    constraints: [
      'פנה ללקוח בשמו אם הוא מופיע בביקורת, והתייחס למשהו מסוים שכתב.',
      'בביקורת שלילית: אל תתווכח ואל תאשים, הכר במה שקרה והצע להמשיך בשיחה פרטית.',
      'אל תחשוף פרטים אישיים או פרטי הזמנה של הלקוח.',
    ],
    format: 'פסקה אחת או שתיים, וחתימה עם שם ותפקיד',
    lengthLegend: 'אורך',
    lengths: {
      short: { label: 'קצר', text: 'עד 40 מילים' },
      medium: { label: 'בינוני', text: 'בין 50 ל-80 מילים' },
      long: { label: 'ארוך', text: 'עד 120 מילים' },
    },
    tone: 'calm',
    steps: [
      'זהה מה בדיוק הלקוח אהב, או מה הפריע לו.',
      'החלט מה אנשים אחרים שיקראו את התשובה צריכים להבין ממנה על העסק.',
      'כתוב את התשובה.',
    ],
    finish: 'כתוב את התשובה לביקורת',
  },
  {
    id: 'video',
    label: 'תסריט לסרטון קצר',
    kind: 'text',
    readerFacing: true,
    role: 'תסריטאי של סרטונים קצרים לרילס, לטיקטוק ולשורטס',
    task: 'כתוב תסריט לסרטון קצר לרשתות החברתיות של העסק.',
    detailLabel: 'על מה הסרטון',
    detailPrefix: 'הנושא',
    detailPlaceholder: 'למשל: איך מכינים את הקרואסון שלנו, משעה 5 בבוקר ועד שהוא יוצא מהתנור',
    detailFallback: 'הנושא: מה העסק עושה ולמה כדאי לבחור בו.',
    quoteDetail: false,
    audience: 'אנשים שגוללים סרטונים בטלפון ומחליטים בשנייה הראשונה אם להמשיך לצפות',
    constraints: [
      'ב-3 השניות הראשונות: משפט או תמונה שגורמים להמשיך לצפות.',
      'משפטים קצרים שנוח להגיד בקול.',
      'כתובית על המסך לכל משפט חשוב, למי שצופה בלי קול.',
    ],
    format: 'טבלה עם העמודות: זמן, מה רואים, מה אומרים, כתובית על המסך',
    lengthLegend: 'אורך הסרטון',
    lengths: {
      short: { label: '15 שניות', text: 'סרטון של 15 שניות' },
      medium: { label: '30 שניות', text: 'סרטון של 30 שניות' },
      long: { label: '60 שניות', text: 'סרטון של 60 שניות' },
    },
    tone: 'light',
    steps: [
      'כתוב שלוש פתיחות אפשריות ובחר את החזקה ביותר.',
      'חלק את הסרטון לסצנות לפי הזמן.',
      'כתוב את התסריט המלא בטבלה.',
    ],
    finish: 'כתוב את התסריט',
  },
  {
    id: 'quote',
    label: 'הצעת מחיר',
    kind: 'text',
    readerFacing: true,
    role: 'יועץ מכירות שכותב הצעות מחיר ברורות לעסקים קטנים',
    task: 'כתוב את הטקסט של הצעת מחיר ללקוח: מכתב פתיחה קצר, מה כלול, מה לא כלול ומה הצעד הבא.',
    detailLabel: 'מה כוללת ההצעה',
    detailPrefix: 'פרטי ההצעה',
    detailPlaceholder: 'למשל: עיצוב ובניית אתר של 5 עמודים, 3 סבבי תיקונים, 9,800 ₪ לפני מע״מ, בתוקף 30 יום',
    detailFallback: 'את פרטי ההצעה, כולל המחירים, אמסור מיד אחרי ההנחיות.',
    quoteDetail: false,
    audience: 'לקוח שביקש הצעת מחיר ומשווה בין כמה ספקים',
    constraints: [
      'השתמש רק במחירים ובפרטים שמסרתי, ואל תמציא סכומים.',
      'כתוב במפורש מה לא כלול בהצעה.',
      'סיים בצעד הבא ובתוקף ההצעה.',
    ],
    format: 'מכתב פתיחה, רשימה של מה כלול, רשימה של מה לא כלול, תנאי תשלום ותוקף',
    lengthLegend: 'אורך',
    lengths: {
      short: { label: 'קצר', text: 'עד 120 מילים' },
      medium: { label: 'בינוני', text: 'בין 150 ל-250 מילים' },
      long: { label: 'ארוך', text: 'עד 400 מילים' },
    },
    tone: 'professional',
    steps: [
      'רשום מה הלקוח ביקש ומה חשוב לו, לפי מה שמסרתי.',
      'סדר את מה שכלול כך שהלקוח יבין מה הוא מקבל בכל שלב.',
      'כתוב את ההצעה לפי הפורמט.',
    ],
    finish: 'כתוב את הצעת המחיר',
  },
  {
    id: 'ad',
    label: 'מודעה ממומנת',
    kind: 'text',
    readerFacing: true,
    role: 'מנהל קמפיינים שכותב מודעות לגוגל, לפייסבוק ולאינסטגרם',
    task: 'כתוב נוסחים למודעה ממומנת של העסק.',
    detailLabel: 'מה מפרסמים',
    detailPrefix: 'מה מפרסמים',
    detailPlaceholder: 'למשל: התקנת מזגנים באזור השרון, הגעה תוך 48 שעות, אחריות לשלוש שנים',
    detailFallback: 'מה מפרסמים: השירות המרכזי של העסק.',
    quoteDetail: false,
    audience: 'אנשים שמחפשים את השירות עכשיו, או שרואים את המודעה בפיד',
    constraints: [
      'במודעת חיפוש בגוגל: כותרות של עד 30 תווים ותיאורים של עד 90 תווים, ומספר התווים ליד כל שורה.',
      'במודעה בפייסבוק ובאינסטגרם: טקסט ראשי שהעיקר בו מופיע בשורה הראשונה, כותרת קצרה וטקסט לכפתור.',
      'בלי הבטחות שאי אפשר לעמוד בהן ובלי סופרלטיבים כמו "הכי טוב בארץ".',
    ],
    format: 'מודעת חיפוש לגוגל ומודעה לפייסבוק ולאינסטגרם, כל אחת ברשימה נפרדת',
    lengthLegend: 'כמות',
    lengths: {
      short: { label: 'מעט', text: '3 כותרות, תיאור אחד וגרסה אחת לרשתות' },
      medium: { label: 'בינונית', text: '5 כותרות, 2 תיאורים ו-2 גרסאות לרשתות' },
      long: { label: 'הרבה', text: '10 כותרות, 4 תיאורים ו-3 גרסאות לרשתות' },
    },
    tone: 'persuasive',
    steps: [
      'רשום שלוש סיבות שבגללן מישהו יבחר דווקא בעסק הזה.',
      'לכל סיבה כתוב כמה ניסוחים קצרים, ובדוק את מספר התווים.',
      'סדר את הנוסחים לפי הפורמט.',
    ],
    finish: 'כתוב את נוסחי המודעה',
  },
  {
    id: 'meeting',
    label: 'סיכום פגישה',
    kind: 'analysis',
    readerFacing: true,
    role: 'מנהל פרויקטים שמסכם פגישות בצורה מדויקת וקצרה',
    task: 'סכם את הפגישה מתוך התמליל או מתוך הנקודות שרשמתי.',
    detailLabel: 'התמליל או הנקודות מהפגישה',
    detailPrefix: 'התמליל',
    detailPlaceholder: 'הדביקו כאן את התמליל או את הנקודות שרשמתם',
    detailFallback: 'את התמליל אדביק מיד אחרי ההנחיות.',
    quoteDetail: true,
    audience: 'המשתתפים בפגישה, וגם מי שלא היה בה',
    constraints: [
      'הפרד בין מה שהוחלט לבין מה שרק עלה כרעיון.',
      'לכל משימה: מי אחראי ועד מתי, רק אם זה נאמר בפגישה. אם לא נאמר, כתוב "לא נקבע".',
    ],
    format: 'שלושה חלקים: החלטות, משימות (מי, מה ועד מתי), שאלות פתוחות',
    lengthLegend: 'אורך',
    lengths: {
      short: { label: 'קצר', text: 'עד 5 נקודות' },
      medium: { label: 'בינוני', text: 'עד 10 נקודות' },
      long: { label: 'מלא', text: 'סיכום מלא לכל נושא שעלה' },
    },
    tone: 'professional',
    steps: [
      'קרא את כל התמליל וזהה את הנושאים שעלו.',
      'לכל נושא: מה הוחלט, מה נשאר פתוח ומי לוקח משימה.',
      'כתוב את הסיכום לפי הפורמט.',
    ],
    finish: 'כתוב את הסיכום',
  },
  {
    id: 'data',
    label: 'ניתוח טבלה או אקסל',
    kind: 'analysis',
    readerFacing: false,
    role: 'אנליסט נתונים שמסביר ממצאים בשפה פשוטה לבעלי עסקים',
    task: 'נתח את הטבלה שאצרף לשיחה, בקובץ אקסל או CSV, וענה על השאלה שלי.',
    detailLabel: 'מה רוצים לדעת מהנתונים',
    detailPrefix: 'השאלה',
    detailPlaceholder: 'למשל: אילו מוצרים נמכרו פחות מעשר פעמים ברבעון האחרון, ומה כדאי לעשות איתם?',
    detailFallback: 'השאלה: מה שלוש המסקנות החשובות ביותר לעסק מהנתונים האלה?',
    quoteDetail: false,
    audience: 'בעל העסק, שאינו איש נתונים',
    constraints: [
      'לפני הניתוח, כתוב בשורה אחת מה יש בכל עמודה, כדי שאוכל לוודא שהבנת נכון.',
      'כל מספר בתשובה צריך לבוא מהטבלה. אם יש חישוב, כתוב איך חישבת.',
      'אם יש בנתונים שורות חסרות או כפולות, ציין אותן.',
    ],
    format: 'מסקנות בנקודות, טבלה קצרה עם המספרים שעליהם הן מבוססות, והמלצה אחת לפעולה',
    lengthLegend: 'היקף',
    lengths: {
      short: { label: 'קצר', text: 'עד 3 מסקנות' },
      medium: { label: 'בינוני', text: 'עד 5 מסקנות' },
      long: { label: 'מלא', text: 'ניתוח מלא לפי נושאים' },
    },
    tone: 'professional',
    steps: [
      'תאר את מבנה הטבלה ובדוק אם יש בה שורות חסרות או כפולות.',
      'חשב את המספרים שצריך כדי לענות על השאלה.',
      'כתוב את המסקנות ואת ההמלצה.',
    ],
    finish: 'כתוב את המסקנות ואת ההמלצה',
  },
  {
    id: 'image',
    label: 'תמונה',
    kind: 'image',
    readerFacing: false,
    role: 'מעצב גרפי וצלם מוצר, שיוצר תמונות לשיווק של עסקים קטנים',
    task: 'צור תמונה לשימוש שיווקי של העסק.',
    detailLabel: 'מה רואים בתמונה',
    detailPrefix: 'מה רואים בתמונה',
    detailPlaceholder: 'למשל: כוס קפה הפוך על שולחן עץ ליד חלון, בבוקר, עם מאפה בצד',
    detailFallback: 'מה רואים בתמונה: המוצר או השירות המרכזי של העסק, בסביבה שבה הלקוחות משתמשים בו.',
    quoteDetail: false,
    audience: 'הלקוחות שיראו את התמונה ברשתות או באתר',
    constraints: [
      'תאר במדויק סגנון, תאורה, צבעים וזווית צילום.',
      'בלי לוגואים של מותגים אחרים ובלי דמויות של אנשים מוכרים.',
    ],
    format: 'צילום ריאליסטי באיכות גבוהה, באור טבעי ועל רקע נקי',
    lengthLegend: 'יחס גובה-רוחב',
    lengths: {
      short: { label: 'ריבוע', text: '1:1, לפוסט בפיד' },
      medium: { label: 'סטורי', text: '9:16, לסטורי ולרילס' },
      long: { label: 'רוחבי', text: '16:9, לבאנר באתר' },
    },
    tone: 'friendly',
    steps: [
      'תכנן את הקומפוזיציה: מה במרכז, מה ברקע ומאיזו זווית.',
      'בחר תאורה, צבעים וסגנון שמתאימים לעסק ולקהל.',
      'כתוב את התיאור המלא שלפיו תיצור את התמונה.',
    ],
    finish: 'צור את התמונה',
  },
  {
    id: 'code',
    label: 'קוד ואוטומציה',
    kind: 'code',
    readerFacing: false,
    role: 'מפתח מנוסה שבונה אוטומציות קטנות לעסקים ומסביר אותן למי שאינו מתכנת',
    task: 'עזור לי לבנות אוטומציה או קוד קצר לעסק.',
    detailLabel: 'מה צריך לבנות',
    detailPrefix: 'מה צריך לבנות',
    detailPlaceholder: 'למשל: לשלוח מייל ללקוח בכל פעם שנוספת שורה חדשה בגיליון Google Sheets',
    detailFallback: 'את מה שצריך לבנות אתאר מיד אחרי ההנחיות.',
    quoteDetail: false,
    audience: 'בעל העסק, בלי ידע בתכנות',
    constraints: [
      'העדף כלים שכבר יש לי לפני שאתה מציע כלי חדש בתשלום.',
      'כתוב את הקוד המלא, לא רק חלקים ממנו.',
      'אל תכתוב בקוד סיסמאות או מפתחות. כתוב לי איפה להכניס אותם.',
      'הסבר איפה מדביקים את הקוד ואיך בודקים שהוא עובד.',
    ],
    format: 'רשימת שלבים ממוספרת, הקוד המלא בבלוק קוד, ובסוף מה לבדוק אם משהו לא עובד',
    lengthLegend: 'היקף',
    lengths: {
      short: { label: 'קצר', text: 'פתרון אחד, קצר ככל האפשר' },
      medium: { label: 'בינוני', text: 'פתרון אחד עם הסבר לכל שלב' },
      long: { label: 'השוואה', text: 'שתי דרכים לפתרון והשוואה ביניהן' },
    },
    tone: 'professional',
    steps: [
      'פרק את המשימה: מה מפעיל את האוטומציה, מה היא עושה ומה התוצאה.',
      'בחר את הדרך הפשוטה ביותר לבנות אותה בכלים שלי.',
      'כתוב את הקוד המלא ואת ההוראות.',
    ],
    finish: 'כתוב את הקוד ואת ההוראות',
  },
  {
    id: 'support',
    label: 'שירות לקוחות',
    kind: 'text',
    readerFacing: true,
    role: 'נציג שירות לקוחות בכיר בעסק',
    task: 'כתוב תשובה ללקוח שפנה לעסק בוואטסאפ, בצ׳אט או במייל.',
    detailLabel: 'ההודעה של הלקוח',
    detailPrefix: 'ההודעה של הלקוח',
    detailPlaceholder: 'הדביקו כאן את ההודעה, למשל: "הזמנתי לפני שבוע ועוד לא קיבלתי כלום"',
    detailFallback: 'את ההודעה של הלקוח אדביק מיד אחרי ההנחיות.',
    quoteDetail: true,
    audience: 'לקוח שמחכה לתשובה ורוצה לדעת מה יקרה עכשיו',
    constraints: [
      'ענה קודם על מה שהלקוח שאל, ורק אחר כך הוסף מידע.',
      'אם אין לך מידע מדויק, כמו מחיר או זמן אספקה, אל תנחש: כתוב שנבדוק ונחזור אליו.',
      'כתוב מה הצעד הבא ומי עושה אותו.',
    ],
    format: 'הודעה שאפשר לשלוח כמו שהיא, בפסקאות קצרות',
    lengthLegend: 'אורך',
    lengths: {
      short: { label: 'קצר', text: 'עד 40 מילים, להודעה בוואטסאפ' },
      medium: { label: 'בינוני', text: 'בין 50 ל-100 מילים' },
      long: { label: 'ארוך', text: 'עד 150 מילים, למייל' },
    },
    tone: 'calm',
    steps: [
      'זהה מה הלקוח צריך ומה הוא מרגיש.',
      'בדוק מה מתוך המידע שמסרתי עונה לו, ומה חסר.',
      'כתוב את התשובה.',
    ],
    finish: 'כתוב את התשובה ללקוח',
  },
]

const NO_INVENT: Record<PromptKind, string> = {
  text: 'אל תמציא מחירים, נתונים, שמות או פרטים שלא מסרתי.',
  analysis: 'השתמש רק במה שמופיע בחומר שמסרתי, ואל תוסיף מספרים או פרטים משלך.',
  code: 'אם אינך בטוח שפונקציה או הגדרה קיימת בכלי שאני משתמש בו, אמור זאת במקום לנחש.',
  image: 'אל תוסיף לתמונה פרטים שלא ביקשתי, כמו שם מותג או מחיר.',
}

const NO_BUSINESS = 'לא מסרתי פרטים על העסק. אם צריך פרט כמו שם, כתובת או מחיר, שאל אותי.'

const HEBREW_STYLE = [
  'הימנע מתרגומית: כתוב כמו שדוברי עברית כותבים, ולא כמו תרגום מאנגלית.',
  'כתוב מספרים בספרות, מחירים עם ₪ ותאריכים בפורמט יום.חודש.שנה.',
]

const ADDRESS_LINES: Record<AddressId, string> = {
  plural: 'כתוב בעברית תקנית ופשוטה, בפנייה לקוראים ברבים (אתם).',
  male: 'כתוב בעברית תקנית ופשוטה, בפנייה לקורא ביחיד (אתה).',
  female: 'כתוב בעברית תקנית ופשוטה, בפנייה לקוראת ביחידה (את).',
  neutral:
    'כתוב בעברית תקנית ופשוטה, בניסוח שמתאים לכל מגדר: בלי "אתה" ו"את", למשל בשם פועל ("אפשר להזמין") או בגוף ראשון רבים ("נשמח לעזור").',
}

const IMAGE_TEXT_LINES: Record<ImageTextId, string> = {
  none: 'בלי שום טקסט בתמונה.',
  he: 'אם יש בתמונה טקסט, שיהיה קצר ובעברית, בכיוון כתיבה מימין לשמאל ועם כל האותיות שלמות.',
  en: 'אם יש בתמונה טקסט, שיהיה קצר ובאנגלית בלבד.',
}

export const findCategory = (id: PromptCategoryId) =>
  promptCategories.find((category) => category.id === id) ?? promptCategories[0]

export const toneOf = (id: ToneId) => tones.find((tone) => tone.id === id) ?? tones[0]

const tidy = (value: string) =>
  value
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

const ENDS_SENTENCE = /[.!?][)"'״׳]*$/

const inline = (value: string) =>
  tidy(value)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index, all) => (index < all.length - 1 && !/[.!?,;:]$/.test(line) ? `${line};` : line))
    .join(' ')

const sentence = (value: string) => {
  const text = inline(value)
  return ENDS_SENTENCE.test(text) ? text : `${text}.`
}

const userLines = (value: string) =>
  tidy(value)
    .split('\n')
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim())
    .filter(Boolean)
    .map(sentence)

const quoted = (value: string) => `"""\n${tidy(value)}\n"""`

const bullets = (items: string[]) => items.map((item) => `- ${item}`).join('\n')

const section = (title: string, body: string) => `${title}:\n${body}`

type Parts = {
  category: PromptCategory
  role: string
  business: string
  audience: string
  detail: string
  format: string
  toneLine: string
  lengthLine: string
  languageLines: string[]
  userConstraints: string[]
  example: string
}

function languageLines(input: PromptInput, category: PromptCategory) {
  if (category.kind === 'image') return [IMAGE_TEXT_LINES[input.imageText]]
  if (category.kind === 'code') {
    return input.language === 'he'
      ? ['כתוב את ההסברים בעברית פשוטה. את הקוד עצמו, כולל שמות משתנים, כתוב באנגלית.']
      : ['כתוב את ההסברים באנגלית פשוטה.']
  }
  if (input.language === 'en') return ['כתוב את הטקסט הסופי באנגלית פשוטה וטבעית, גם אם ההנחיות כתובות בעברית.']
  const opening = category.readerFacing ? ADDRESS_LINES[input.address] : 'כתוב בעברית תקנית ופשוטה.'
  return [opening, ...HEBREW_STYLE]
}

function partsOf(input: PromptInput): Parts {
  const category = findCategory(input.category)
  const tone = toneOf(input.tone ?? category.tone)
  const length = category.lengths[input.length]
  return {
    category,
    role: inline(input.role) || category.role,
    business: inline(input.business),
    audience: inline(input.audience) || category.audience,
    detail: tidy(input.detail),
    format: inline(input.format) || category.format,
    toneLine: category.kind === 'image' ? `האווירה: ${tone.mood}.` : `הטון: ${tone.text}.`,
    lengthLine: `${category.lengthLegend}: ${length.text}.`,
    languageLines: languageLines(input, category),
    userConstraints: userLines(input.constraints),
    example: tidy(input.example),
  }
}

function detailInline(parts: Parts, multiline: boolean) {
  const { category, detail } = parts
  if (!detail) return category.detailFallback
  if (category.quoteDetail) return ''
  if (multiline && detail.includes('\n')) return `${category.detailPrefix}:\n${detail}`
  return sentence(`${category.detailPrefix}: ${detail}`)
}

function detailBlock(parts: Parts) {
  const { category, detail } = parts
  if (!detail || !category.quoteDetail) return ''
  return section(category.detailPrefix, quoted(detail))
}

function exampleBlock(parts: Parts) {
  if (!parts.example) return ''
  return section('דוגמה', `כתוב בסגנון של הדוגמה הבאה, בלי להעתיק ממנה משפטים:\n${quoted(parts.example)}`)
}

function buildShort(parts: Parts) {
  const { category } = parts
  const paragraph = [
    sentence(`התפקיד שלך: ${parts.role}`),
    category.task,
    detailInline(parts, false),
    parts.business ? sentence(`על העסק: ${parts.business}`) : '',
    sentence(`קהל היעד: ${parts.audience}`),
    parts.toneLine,
    sentence(`${category.kind === 'image' ? 'הסגנון' : 'הפורמט'}: ${parts.format}`),
    parts.lengthLine,
    parts.languageLines[0],
    ...parts.userConstraints,
    NO_INVENT[category.kind],
  ]
    .filter(Boolean)
    .join(' ')
  return [paragraph, detailBlock(parts), exampleBlock(parts)].filter(Boolean).join('\n\n')
}

function buildDetailed(parts: Parts) {
  const { category } = parts
  const context = [
    parts.business ? sentence(`על העסק: ${parts.business}`) : NO_BUSINESS,
    sentence(`קהל היעד: ${parts.audience}`),
  ].join('\n')
  const task = [category.task, detailInline(parts, true)].filter(Boolean).join('\n')
  const rules = [
    ...parts.userConstraints,
    ...category.constraints,
    parts.toneLine,
    ...parts.languageLines,
    NO_INVENT[category.kind],
  ]
  const format = [sentence(category.kind === 'image' ? `הסגנון: ${parts.format}` : parts.format), parts.lengthLine]
  return [
    section('תפקיד', sentence(parts.role)),
    section('הקשר', context),
    section('משימה', task),
    detailBlock(parts),
    section('דגשים ומגבלות', bullets(rules)),
    section('פורמט', format.join('\n')),
    exampleBlock(parts),
  ]
    .filter(Boolean)
    .join('\n\n')
}

function buildStepByStep(parts: Parts) {
  const { category } = parts
  const steps = category.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')
  const plan = [
    'עבוד שלב אחר שלב, וכתוב בקצרה מה עשית בכל שלב לפני התוצאה:',
    steps,
    'אם חסר לך מידע שחשוב לתוצאה, שאל אותי עד שלוש שאלות לפני שאתה מתחיל.',
    `אחרי השלבים, ${category.finish}.`,
  ].join('\n')
  return [buildDetailed(parts), section('איך לעבוד', plan)].join('\n\n')
}

export function buildPrompt(input: PromptInput, variant: VariantId) {
  const parts = partsOf(input)
  if (variant === 'short') return buildShort(parts)
  if (variant === 'detailed') return buildDetailed(parts)
  return buildStepByStep(parts)
}

export const emptyInput = (category: PromptCategoryId = DEFAULT_CATEGORY): PromptInput => ({
  category,
  role: '',
  business: '',
  audience: '',
  detail: '',
  constraints: '',
  tone: null,
  length: 'medium',
  format: '',
  language: 'he',
  address: 'plural',
  imageText: 'none',
  example: '',
})

export const promptLibrary: LibraryPrompt[] = [
  {
    id: 'social-holiday-sale',
    category: 'social',
    title: 'פוסט על מבצע לחג',
    when: 'כשיש מבצע עם תאריך סיום, ורוצים פוסט שמביא פניות ולא רק לייקים.',
    text: 'אתה קופירייטר של עסקים קטנים בישראל. כתוב פוסט לפייסבוק ולאינסטגרם על מבצע של [שם העסק] לקראת [החג]: [מה המבצע], בתוקף עד [תאריך].\nפתח במשפט שאומר מה הלקוח מרוויח, בלי "שלום לכולם". עד 80 מילים, טון חם, עד 3 אימוג׳ים. סיים בקריאה לפעולה אחת: [לשלוח הודעה בוואטסאפ / להזמין באתר]. אל תמציא תנאים שלא כתבתי.',
  },
  {
    id: 'social-behind-scenes',
    category: 'social',
    title: 'פוסט מאחורי הקלעים',
    when: 'כשאין מה למכור השבוע, אבל רוצים להישאר בפיד ולבנות אמון.',
    text: 'כתוב פוסט קצר לאינסטגרם שמראה יום עבודה רגיל ב[שם העסק]. אלה שלושה דברים שקרו היום: [1], [2], [3].\nבחר את המעניין מביניהם ובנה סביבו סיפור של 4 עד 6 משפטים, בגוף ראשון ובלי שפה שיווקית. סיים בשאלה אחת לקוראים שקל לענות עליה בתגובה.',
  },
  {
    id: 'social-linkedin-project',
    category: 'social',
    title: 'פוסט בלינקדאין על פרויקט שהסתיים',
    when: 'אחרי פרויקט ללקוח עסקי, כשרוצים להראות תוצאה בלי להתרברב.',
    text: 'כתוב פוסט לינקדאין בעברית על פרויקט שסיימנו עבור [סוג הלקוח]. הבעיה הייתה [הבעיה]. מה שעשינו: [מה עשינו]. התוצאה: [תוצאה, עם מספר אם יש].\nמבנה: משפט פתיחה עם התוצאה, שלוש פסקאות קצרות, ולקח אחד שאחרים יכולים ללמוד ממנו. בלי "גאים להודיע" ובלי האשטגים באמצע הטקסט. עד 150 מילים.',
  },
  {
    id: 'social-content-calendar',
    category: 'social',
    title: 'לוח תוכן לחודש',
    when: 'בתחילת החודש, כשרוצים לתכנן מראש במקום לחפש רעיון כל יום.',
    text: 'אתה מנהל סושיאל של עסקים קטנים. בנה לוח תוכן ל[חודש] עבור [שם העסק], שמוכר [מה מוכרים] ל[קהל]. 12 פוסטים, 3 בשבוע.\nלכל פוסט: תאריך, נושא, פורמט (תמונה, קרוסלה או סרטון קצר), משפט פתיחה ומטרה (מכירה, אמון או מעורבות). שלב את החגים והאירועים של החודש בישראל, ואם אינך בטוח בתאריך של חג, כתוב זאת. תן את הכול בטבלה.',
  },
  {
    id: 'product-description',
    category: 'product',
    title: 'תיאור מוצר לחנות אונליין',
    when: 'כשמעלים מוצר חדש לחנות ויש רק מפרט טכני מהספק.',
    text: 'כתוב תיאור מוצר בעברית לחנות אונליין. המוצר: [שם המוצר]. הפרטים מהספק: [מפרט]. המחיר: [מחיר]. מי קונה אותו: [קהל].\nמבנה: פסקת פתיחה של 2 משפטים על מה הקונה מרוויח, רשימה של 5 יתרונות (כל תכונה מתורגמת לתועלת), ושורת מפרט. השתמש רק בנתונים שמסרתי. עד 150 מילים.',
  },
  {
    id: 'product-seo-snippet',
    category: 'product',
    title: 'כותרת ותיאור לגוגל לדף מוצר',
    when: 'כשהמוצר כבר באתר, וצריך כותרת ותיאור שיופיעו בתוצאות החיפוש.',
    text: 'כתוב 3 הצעות לכותרת (title) ו-3 הצעות לתיאור (meta description) לדף מוצר: [שם המוצר], [יתרון מרכזי], [מחיר או משלוח].\nהכותרת עד 60 תווים ומתחילה בשם המוצר כפי שאנשים מחפשים אותו. התיאור בין 120 ל-155 תווים, עם סיבה ללחוץ. כתוב ליד כל הצעה את מספר התווים.',
  },
  {
    id: 'product-faq',
    category: 'product',
    title: 'שאלות ותשובות לדף מוצר',
    when: 'כשלקוחות שואלים שוב ושוב את אותן שאלות לפני שהם קונים.',
    text: 'אני מוכר [המוצר]. אלה השאלות שלקוחות שאלו אותנו בחודש האחרון: [הדביקו את השאלות].\nקבץ אותן ל-5 עד 7 שאלות נפוצות, וכתוב לכל אחת תשובה של 2 עד 3 משפטים לפי המידע הזה: [מידע על המוצר, המשלוחים והאחריות]. אם אין במידע תשובה לשאלה, כתוב "חסר מידע" ואל תמציא.',
  },
  {
    id: 'email-quote-follow-up',
    category: 'email',
    title: 'מעקב אחרי הצעת מחיר שלא נענתה',
    when: 'שבוע אחרי ששלחתם הצעת מחיר ולא קיבלתם תשובה.',
    text: 'כתוב מייל קצר ל[שם הלקוח], ששלחנו לו לפני [מספר] ימים הצעת מחיר ל[שירות] ועוד לא ענה. המטרה: להזכיר בלי ללחוץ, ולהקל עליו לענות.\nעד 70 מילים, טון מקצועי וחם. הצע שתי דרכים קלות לענות, למשל שיחה של 10 דקות או שאלה במייל. שורת הנושא לא תכלול את המילה "תזכורת".',
  },
  {
    id: 'email-delay',
    category: 'email',
    title: 'עדכון ללקוח על עיכוב',
    when: 'כשמשהו התעכב, ורוצים לעדכן את הלקוח לפני שהוא שואל.',
    text: 'כתוב מייל ללקוח על עיכוב בהזמנה [מספר הזמנה]. הסיבה: [סיבה]. מועד האספקה החדש: [תאריך]. מה אנחנו מציעים בגלל העיכוב: [פיצוי, אם יש].\nהתחל בעדכון עצמו, התנצל פעם אחת בלי הגזמה, ואמור מה הצעד הבא. בלי "לצערנו הרב". עד 120 מילים.',
  },
  {
    id: 'email-payment-reminder',
    category: 'email',
    title: 'תזכורת תשלום עדינה',
    when: 'כשחשבונית עברה את מועד התשלום, ורוצים לשמור על היחסים עם הלקוח.',
    text: 'כתוב מייל תזכורת לתשלום חשבונית [מספר] על סך [סכום] ₪, שמועד התשלום שלה היה [תאריך]. הלקוח עובד איתנו [כמה זמן].\nטון אדיב וענייני, בלי האשמה. כלול את פרטי התשלום: [פרטי העברה או קישור לתשלום]. סיים בבקשה לעדכן אותנו אם כבר שולם. עד 90 מילים.',
  },
  {
    id: 'review-negative',
    category: 'review',
    title: 'תשובה לביקורת שלילית',
    when: 'כשלקוח כתב ביקורת קשה, ורוצים לענות בלי להתגונן.',
    text: 'אני [התפקיד שלכם] ב[שם העסק]. לקוח כתב עלינו בגוגל את הביקורת הזאת:\n"""\n[הדביקו את הביקורת]\n"""\nכתוב תשובה פומבית של עד 80 מילים: פנה אליו בשמו, הכר במה שקרה בלי להתווכח, אמור במשפט אחד מה שינינו כדי שזה לא יחזור (רק אם זה נכון: [מה שיניתם]), והצע להמשיך בשיחה בטלפון [מספר]. אל תכתוב פרטים על ההזמנה שלו.',
  },
  {
    id: 'review-positive',
    category: 'review',
    title: 'תשובה לביקורת חיובית',
    when: 'כדי שכל ביקורת טובה תקבל תשובה אישית, ולא "תודה רבה!" קבוע.',
    text: 'כתוב תשובה קצרה, עד 40 מילים, לביקורת החיובית הזאת בגוגל:\n"""\n[הדביקו את הביקורת]\n"""\nהתייחס לפרט אחד מסוים שהלקוח כתב, הודה לו בשמו, ואל תוסיף פרסומת. כתוב 3 גרסאות שונות כדי שאוכל לבחור.',
  },
  {
    id: 'review-request',
    category: 'review',
    title: 'בקשה מלקוח מרוצה לכתוב ביקורת',
    when: 'מיד אחרי עבודה שהסתיימה טוב, כשהלקוח עוד זוכר אותה.',
    text: 'כתוב הודעת וואטסאפ קצרה ל[שם הלקוח], שסיימנו לו [העבודה] אתמול, ובה בקשה לכתוב עלינו ביקורת בגוגל.\nעד 45 מילים, אישית וחמה, בלי לחץ ובלי להציע הטבה תמורת הביקורת. בסוף הוסף את הקישור: [הקישור לכתיבת ביקורת].',
  },
  {
    id: 'video-reel-script',
    category: 'video',
    title: 'תסריט לרילס של 30 שניות',
    when: 'כשיש מוצר או שירות להציג, וצריך תסריט שאפשר לצלם בטלפון.',
    text: 'אתה תסריטאי של סרטונים קצרים. כתוב תסריט לרילס של 30 שניות עבור [שם העסק] על [הנושא].\nבטבלה: זמן, מה רואים, מה אומרים, כתובית על המסך. ב-3 השניות הראשונות משפט שגורם להמשיך לצפות. משפטים קצרים שנוח להגיד בקול. סיים בקריאה לפעולה אחת, וכתוב גם 3 פתיחות חלופיות.',
  },
  {
    id: 'video-ideas',
    category: 'video',
    title: '10 רעיונות לסרטונים קצרים',
    when: 'כשנגמרו הרעיונות, ורוצים רשימה לחודש הקרוב.',
    text: 'תן 10 רעיונות לסרטונים קצרים לעסק מסוג [סוג העסק] ב[עיר].\nלכל רעיון: כותרת, משפט פתיחה לשלוש השניות הראשונות, ומה צריך כדי לצלם אותו (מקום, אביזרים ומשך). שלב טיפים מקצועיים, שאלות שלקוחות שואלים ומאחורי הקלעים. בלי ריקודים וטרנדים שדורשים כישרון מיוחד.',
  },
  {
    id: 'video-captions',
    category: 'video',
    title: 'כתוביות לסרטון מצולם',
    when: 'כשיש סרטון מוכן, וצריך לחלק את הדיבור לכתוביות קצרות.',
    text: 'הנה תמלול של סרטון שצילמתי:\n"""\n[הדביקו את התמלול]\n"""\nחלק אותו לכתוביות של עד 7 מילים כל אחת, בלי לשנות את המשמעות. תקן שגיאות כתיב ושגיאות תמלול ברורות, וסמן בסימן שאלה מילים שאינך בטוח בהן.',
  },
  {
    id: 'quote-cover-letter',
    category: 'quote',
    title: 'מכתב פתיחה להצעת מחיר',
    when: 'כשהמספרים מוכנים, וצריך את הטקסט שמסביר ללקוח מה הוא מקבל.',
    text: 'כתוב מכתב פתיחה קצר להצעת מחיר ל[שם הלקוח] על [השירות]. מה שהלקוח אמר שחשוב לו: [1], [2]. מה כלול: [רשימה]. מה לא כלול: [רשימה]. המחיר: [מחיר] ₪ לפני מע״מ. תוקף ההצעה: [תאריך].\nמבנה: פסקה שמראה שהבנו את הצורך, מה כלול ומה לא כלול ברשימות, והצעד הבא. בלי סופרלטיבים, ורק עם המספרים שמסרתי.',
  },
  {
    id: 'quote-three-packages',
    category: 'quote',
    title: 'שלוש חבילות במקום הצעה אחת',
    when: 'כשרוצים לתת ללקוח בחירה, ולא רק "כן או לא" על הצעה אחת.',
    text: 'אני מציע [השירות]. עזור לי לבנות שלוש חבילות: בסיסית, מומלצת ומורחבת. אלה כל הרכיבים שאני יכול לכלול: [רשימת רכיבים], וזו העלות שלי לכל רכיב: [עלויות].\nהצע מה לשים בכל חבילה ואיך לקרוא לה, והסבר במשפט למה החבילה האמצעית מתאימה לרוב הלקוחות. את המחירים הסופיים אקבע בעצמי.',
  },
  {
    id: 'quote-too-expensive',
    category: 'quote',
    title: 'תשובה ללקוח שאומר "יקר לי"',
    when: 'כשלקוח מתלבט בגלל המחיר, ורוצים לענות בלי להוריד מחיר מיד.',
    text: 'לקוח כתב לי על הצעת המחיר: "[מה הלקוח כתב]". ההצעה כוללת [מה כלול].\nכתוב תשובה קצרה ועניינית, עד 80 מילים, שמסבירה מה עומד מאחורי המחיר, שואלת מה התקציב שלו, ומציעה להקטין את ההיקף במקום לתת הנחה. בלי לחץ ובלי "מחיר מיוחד רק היום".',
  },
  {
    id: 'ad-google-search',
    category: 'ad',
    title: 'מודעת חיפוש בגוגל',
    when: 'כשפותחים קמפיין חיפוש, וצריך הרבה כותרות ותיאורים לבחירה.',
    text: 'כתוב חומר למודעת חיפוש רספונסיבית בגוגל עבור [שם העסק], שמציע [השירות] ב[אזור]. היתרונות: [1], [2], [3].\nצריך 15 כותרות של עד 30 תווים ו-4 תיאורים של עד 90 תווים. לפחות 3 כותרות עם שם השירות כפי שמחפשים אותו, ולפחות 2 עם קריאה לפעולה. בלי סימני קריאה בכותרות. כתוב את מספר התווים ליד כל שורה.',
  },
  {
    id: 'ad-meta',
    category: 'ad',
    title: 'מודעה לפייסבוק ולאינסטגרם',
    when: 'כשמקדמים הצעה מסוימת לקהל שעוד לא מכיר את העסק.',
    text: 'כתוב 3 גרסאות למודעה בפייסבוק ובאינסטגרם עבור [ההצעה]. הקהל: [למי].\nלכל גרסה: טקסט ראשי שהעיקר בו מופיע בשורה הראשונה, כותרת קצרה וטקסט לכפתור. כל גרסה מזווית אחרת: בעיה שהלקוח מכיר, התוצאה, והוכחה (המלצה או נתון אמיתי: [נתון]). בלי הבטחות שאי אפשר לעמוד בהן.',
  },
  {
    id: 'ad-review',
    category: 'ad',
    title: 'בדיקה של מודעה לפני שהיא עולה',
    when: 'כשהמודעה כתובה, ורוצים עין שנייה לפני שמשלמים על חשיפה.',
    text: 'הנה מודעה שכתבתי:\n"""\n[הדביקו את המודעה]\n"""\nהקהל: [למי]. בדוק אותה כמו מנהל קמפיינים: האם ברור תוך שנייה מה מציעים ולמי, האם יש קריאה לפעולה אחת, והאם יש הבטחה שעלולה להיפסל או לאכזב. תן 3 תיקונים מדויקים וגרסה משופרת אחת.',
  },
  {
    id: 'meeting-transcript',
    category: 'meeting',
    title: 'סיכום פגישה מתמלול',
    when: 'אחרי פגישה מוקלטת, כשרוצים סיכום לשלוח לכל המשתתפים.',
    text: 'הנה תמלול של פגישה:\n"""\n[הדביקו את התמלול]\n"""\nסכם אותו בשלושה חלקים: החלטות, משימות (מי, מה ועד מתי) ושאלות פתוחות. הפרד בין מה שהוחלט לבין רעיון שרק עלה. אם לא נאמר מי אחראי או מתי, כתוב "לא נקבע". אל תוסיף מידע שלא נאמר.',
  },
  {
    id: 'meeting-client-recap',
    category: 'meeting',
    title: 'מייל סיכום ללקוח אחרי פגישה',
    when: 'כשרוצים שהלקוח יאשר בכתב את מה שסוכם.',
    text: 'כתוב מייל ל[שם הלקוח] שמסכם את הפגישה מהיום. מה סוכם: [נקודות]. מה אנחנו עושים ועד מתי: [המשימות שלנו]. מה אנחנו צריכים ממנו: [המשימות שלו].\nבסוף בקש שיאשר או יתקן עד [תאריך]. עד 150 מילים, ענייני ומנומס.',
  },
  {
    id: 'meeting-prep',
    category: 'meeting',
    title: 'הכנה לפגישה עם לקוח חדש',
    when: 'יום לפני פגישת היכרות, כשרוצים להגיע עם שאלות טובות.',
    text: 'יש לי מחר פגישת היכרות עם [סוג הלקוח], שמתעניין ב[השירות]. מה שאני יודע עליו: [מידע].\nכתוב 10 שאלות שיעזרו לי להבין את הצורך, את התקציב ואת לוחות הזמנים, מסודרות מהקלה לקשה. ליד כל שאלה כתוב למה כדאי לשאול אותה.',
  },
  {
    id: 'data-sales',
    category: 'data',
    title: 'ניתוח של טבלת מכירות',
    when: 'בסוף חודש או רבעון, כשרוצים לדעת מה עבד ומה לא.',
    text: 'אצרף קובץ אקסל של מכירות עם העמודות [שמות העמודות]. לפני הניתוח, כתוב במשפט מה יש בכל עמודה, כדי שאוודא שהבנת נכון.\nאחר כך ענה: אילו 5 מוצרים הביאו הכי הרבה הכנסה, מה ירד לעומת החודש הקודם, ואיזה מוצר כדאי לקדם. כל מספר צריך לבוא מהטבלה. הצג את החישובים בטבלה קצרה.',
  },
  {
    id: 'data-formula',
    category: 'data',
    title: 'נוסחה לאקסל או ל-Google Sheets',
    when: 'כשיודעים מה רוצים לחשב, אבל לא זוכרים איך כותבים את הנוסחה.',
    text: 'בגיליון [Excel או Google Sheets] יש לי בעמודה A [מה יש בה], בעמודה B [מה יש בה] ובעמודה C [מה יש בה]. אני צריך שבעמודה D יופיע [מה לחשב].\nכתוב את הנוסחה לשורה 2, הסבר במשפט מה כל חלק בה עושה, ומה לבדוק אם היא מחזירה שגיאה.',
  },
  {
    id: 'data-clean-list',
    category: 'data',
    title: 'ניקוי של רשימת לקוחות',
    when: 'לפני שמייבאים רשימה ל-CRM או שולחים דיוור.',
    text: 'אצרף רשימת לקוחות בקובץ CSV. נקה אותה: אחד כפילויות לפי מספר טלפון, העבר טלפונים לפורמט 050-1234567, הפרד שם פרטי ושם משפחה לעמודות נפרדות, וסמן שורות עם כתובת מייל לא תקינה.\nתן לי את הקובץ המתוקן ורשימה של מה ששינית. אל תמחק שורות בלי לסמן אותן.',
  },
  {
    id: 'image-product-photo',
    category: 'image',
    title: 'תמונת מוצר נקייה מצילום בטלפון',
    when: 'כשיש צילום טלפון של המוצר, וצריך תמונה נקייה לחנות.',
    text: 'אצרף צילום של [המוצר] שצילמתי בטלפון. צור ממנו תמונה לחנות: המוצר עצמו בדיוק כמו בצילום, בלי לשנות צבע, צורה או כיתוב, על רקע [לבן או בצבע בהיר], עם תאורה רכה וצל עדין מתחתיו. יחס 1:1.',
  },
  {
    id: 'image-holiday-post',
    category: 'image',
    title: 'תמונה לפוסט ברכה לחג',
    when: 'כשרוצים תמונה לברכה, ולא את התמונה מהמאגר שכולם שולחים.',
    text: 'צור תמונה לפוסט ברכה ל[החג] עבור [סוג העסק]. בתמונה: [מה רואים, למשל שולחן עם מוצרי העסק ופרטים שקשורים לחג]. סגנון: [צילום ריאליסטי או איור שטוח]. צבעים: [צבעי המותג]. בלי טקסט בתמונה, את הברכה אוסיף בעצמי. יחס 4:5.',
  },
  {
    id: 'image-hero-banner',
    category: 'image',
    title: 'באנר לדף הבית',
    when: 'כשמחדשים את האתר, וצריך תמונה רחבה שמתאימה לכותרת.',
    text: 'צור תמונה רחבה ביחס 16:9 לראש דף הבית של [שם העסק], שמציע [השירות]. בתמונה: [הסצנה]. השאר שטח ריק ונקי בצד [ימין או שמאל] של התמונה, כדי שאוכל לשים עליו כותרת. סגנון: [הסגנון]. בלי טקסט ובלי לוגואים.',
  },
  {
    id: 'code-sheets-email',
    category: 'code',
    title: 'מייל אוטומטי משורה חדשה ב-Google Sheets',
    when: 'כשכל שורה חדשה בגיליון צריכה לשלוח מייל, ואין צורך בכלי אוטומציה בתשלום.',
    text: 'אתה מפתח שמסביר למי שאינו מתכנת. כתוב Google Apps Script שבכל פעם שנוספת שורה לגיליון [שם הגיליון] שולח מייל לכתובת שבעמודה [עמודה], עם השם שבעמודה [עמודה].\nתן את הקוד המלא, ואחריו הוראות שלב אחר שלב: איפה מדביקים, איך מגדירים טריגר ואיך בודקים שזה עובד. כתוב את ההסברים בעברית.',
  },
  {
    id: 'code-automation-plan',
    category: 'code',
    title: 'תכנון אוטומציה ב-Make או ב-Zapier',
    when: 'לפני שבונים אוטומציה, כדי להבין אילו שלבים וחיבורים צריך.',
    text: 'אני רוצה שכל ליד מהטופס באתר [המערכת של האתר] ייכנס ל[ה-CRM], יקבל הודעת וואטסאפ אוטומטית ויופיע אצלי בגיליון.\nתכנן את האוטומציה ב[Make או Zapier]: אילו מודולים, באיזה סדר ואילו שדות למפות. ציין אילו שלבים עשויים לדרוש תוכנית בתשלום, כדי שאבדוק לפני שאתחיל.',
  },
  {
    id: 'code-error',
    category: 'code',
    title: 'הסבר של הודעת שגיאה',
    when: 'כשמשהו באתר או באוטומציה נשבר, ומקבלים הודעה לא מובנת.',
    text: 'קיבלתי את הודעת השגיאה הזאת ב[המערכת]:\n"""\n[הדביקו את הודעת השגיאה]\n"""\nלפני השגיאה עשיתי: [מה עשיתם]. הסבר בעברית פשוטה מה היא אומרת, מה שלוש הסיבות הסבירות, ומה לבדוק בכל אחת לפי הסדר. אל תציע למחוק או לאפס משהו בלי להזהיר מה יאבד.',
  },
  {
    id: 'support-angry',
    category: 'support',
    title: 'תשובה ללקוח כועס',
    when: 'כשמגיעה הודעה כועסת, ורוצים לענות עניינית ולא מתוך עלבון.',
    text: 'לקוח שלח לנו בוואטסאפ:\n"""\n[הדביקו את ההודעה]\n"""\nמה שקרה מבחינתנו: [העובדות]. כתוב תשובה של עד 70 מילים: הכר בתחושה שלו במשפט אחד, אמור מה נעשה ומתי, ואל תתווכח על הפרטים בכתב. אם צריך, הצע שיחה בטלפון.',
  },
  {
    id: 'support-quick-replies',
    category: 'support',
    title: 'תשובות מוכנות לשאלות נפוצות',
    when: 'כשאותן 10 שאלות חוזרות בוואטסאפ, וכדאי לשמור להן תשובות מהירות.',
    text: 'אלה השאלות שלקוחות שואלים אותנו הכי הרבה: [רשימת השאלות]. וזה המידע שאפשר לענות ממנו: [מחירים, שעות ומדיניות].\nכתוב לכל שאלה תשובה קצרה לוואטסאפ, עד 50 מילים, ותן לה קיצור של מילה אחת לתשובות מהירות, למשל /משלוח. אם חסר מידע לתשובה, כתוב "חסר".',
  },
  {
    id: 'support-bot-instructions',
    category: 'support',
    title: 'הנחיות קבועות לבוט שירות',
    when: 'כשמגדירים צ׳אט או בוט שעונה ללקוחות, וצריך לכתוב לו הוראות קבועות.',
    text: 'כתוב הנחיות מערכת לבוט שירות של [שם העסק]. הבוט עונה על: [נושאים]. מקורות המידע שלו: [מסמכים]. הוא לא עונה על: [נושאים אסורים], ולא מבטיח מחירים, הנחות או מועדים שלא מופיעים במקורות. כשהוא לא יודע, או כשהלקוח מבקש לדבר עם אדם, הוא מעביר לנציג.\nכתוב את ההנחיות ברשימה ממוספרת, ואחריהן 5 שאלות בדיקה עם התשובה הרצויה לכל אחת.',
  },
]

export const libraryByCategory = promptCategories
  .map((category) => ({ category, prompts: promptLibrary.filter((prompt) => prompt.category === category.id) }))
  .filter((group) => group.prompts.length > 0)
