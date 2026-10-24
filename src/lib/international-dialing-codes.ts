export type CountryCode = {
  iso: string
  digits: string
  name: string
  english: string
  note: string
}

export const DIALING_CODES_REVIEWED = '2026-10-24'
export const DIALING_CODES_REVIEWED_LABEL = '24.10.2026'

const RAW = `AF|93|אפגניסטן|Afghanistan
AL|355|אלבניה|Albania
DZ|213|אלג'יריה|Algeria
AS|1684|סמואה האמריקנית|American Samoa
AD|376|אנדורה|Andorra
AO|244|אנגולה|Angola
AI|1264|אנגווילה|Anguilla
AG|1268|אנטיגואה וברבודה|Antigua and Barbuda
AR|54|ארגנטינה|Argentina
AM|374|ארמניה|Armenia
AW|297|ארובה|Aruba
AU|61|אוסטרליה|Australia
AT|43|אוסטריה|Austria
AZ|994|אזרבייג'ן|Azerbaijan
BS|1242|איי בהאמה|Bahamas
BH|973|בחריין|Bahrain
BD|880|בנגלדש|Bangladesh
BB|1246|ברבדוס|Barbados
BY|375|בלארוס|Belarus
BE|32|בלגיה|Belgium
BZ|501|בליז|Belize
BJ|229|בנין|Benin
BM|1441|ברמודה|Bermuda
BT|975|בהוטן|Bhutan
BO|591|בוליביה|Bolivia
BA|387|בוסניה והרצגובינה|Bosnia and Herzegovina
BW|267|בוטסואנה|Botswana
BR|55|ברזיל|Brazil
VG|1284|איי הבתולה הבריטיים|British Virgin Islands
BN|673|ברוניי|Brunei
BG|359|בולגריה|Bulgaria
BF|226|בורקינה פאסו|Burkina Faso
BI|257|בורונדי|Burundi
KH|855|קמבודיה|Cambodia
CM|237|קמרון|Cameroon
CA|1|קנדה|Canada
CV|238|כף ורדה|Cape Verde
KY|1345|איי קיימן|Cayman Islands
CF|236|הרפובליקה המרכז-אפריקאית|Central African Republic
TD|235|צ'אד|Chad
CL|56|צ'ילה|Chile
CN|86|סין|China
CO|57|קולומביה|Colombia
KM|269|קומורו|Comoros
CG|242|קונגו (הרפובליקה)|Congo
CD|243|הרפובליקה הדמוקרטית של קונגו|DR Congo
CK|682|איי קוק|Cook Islands
CR|506|קוסטה ריקה|Costa Rica
HR|385|קרואטיה|Croatia
CU|53|קובה|Cuba
CW|599|קוראסאו|Curaçao
CY|357|קפריסין|Cyprus
CZ|420|צ'כיה|Czechia
DK|45|דנמרק|Denmark
DJ|253|ג'יבוטי|Djibouti
DM|1767|דומיניקה|Dominica
DO|1809|הרפובליקה הדומיניקנית|Dominican Republic|וגם 1829 ו-1849
EC|593|אקוודור|Ecuador
EG|20|מצרים|Egypt
SV|503|אל סלוודור|El Salvador
GQ|240|גינאה המשוונית|Equatorial Guinea
ER|291|אריתריאה|Eritrea
EE|372|אסטוניה|Estonia
SZ|268|אסוואטיני|Eswatini
ET|251|אתיופיה|Ethiopia
FK|500|איי פוקלנד|Falkland Islands
FO|298|איי פארו|Faroe Islands
FJ|679|פיג'י|Fiji
FI|358|פינלנד|Finland
FR|33|צרפת|France
GF|594|גיאנה הצרפתית|French Guiana
PF|689|פולינזיה הצרפתית|French Polynesia
GA|241|גבון|Gabon
GM|220|גמביה|Gambia
GE|995|גאורגיה|Georgia
DE|49|גרמניה|Germany
GH|233|גאנה|Ghana
GI|350|גיברלטר|Gibraltar
GR|30|יוון|Greece
GL|299|גרינלנד|Greenland
GD|1473|גרנדה|Grenada
GP|590|גוואדלופ|Guadeloupe
GU|1671|גואם|Guam
GT|502|גואטמלה|Guatemala
GN|224|גינאה|Guinea
GW|245|גינאה-ביסאו|Guinea-Bissau
GY|592|גיאנה|Guyana
HT|509|האיטי|Haiti
HN|504|הונדורס|Honduras
HK|852|הונג קונג|Hong Kong
HU|36|הונגריה|Hungary
IS|354|איסלנד|Iceland
IN|91|הודו|India
ID|62|אינדונזיה|Indonesia
IR|98|איראן|Iran
IQ|964|עיראק|Iraq
IE|353|אירלנד|Ireland
IL|972|ישראל|Israel
IT|39|איטליה|Italy
CI|225|חוף השנהב|Ivory Coast
JM|1876|ג'מייקה|Jamaica
JP|81|יפן|Japan
JO|962|ירדן|Jordan
KZ|7|קזחסטן|Kazakhstan
KE|254|קניה|Kenya
KI|686|קיריבטי|Kiribati
XK|383|קוסובו|Kosovo
KW|965|כווית|Kuwait
KG|996|קירגיזסטן|Kyrgyzstan
LA|856|לאוס|Laos
LV|371|לטביה|Latvia
LB|961|לבנון|Lebanon
LS|266|לסוטו|Lesotho
LR|231|ליבריה|Liberia
LY|218|לוב|Libya
LI|423|ליכטנשטיין|Liechtenstein
LT|370|ליטא|Lithuania
LU|352|לוקסמבורג|Luxembourg
MO|853|מקאו|Macau
MG|261|מדגסקר|Madagascar
MW|265|מלאווי|Malawi
MY|60|מלזיה|Malaysia
MV|960|המלדיביים|Maldives
ML|223|מאלי|Mali
MT|356|מלטה|Malta
MH|692|איי מרשל|Marshall Islands
MQ|596|מרטיניק|Martinique
MR|222|מאוריטניה|Mauritania
MU|230|מאוריציוס|Mauritius
MX|52|מקסיקו|Mexico
FM|691|מיקרונזיה|Micronesia
MD|373|מולדובה|Moldova
MC|377|מונקו|Monaco
MN|976|מונגוליה|Mongolia
ME|382|מונטנגרו|Montenegro
MS|1664|מונסראט|Montserrat
MA|212|מרוקו|Morocco
MZ|258|מוזמביק|Mozambique
MM|95|מיאנמר|Myanmar
NA|264|נמיביה|Namibia
NR|674|נאורו|Nauru
NP|977|נפאל|Nepal
NL|31|הולנד|Netherlands
NC|687|קלדוניה החדשה|New Caledonia
NZ|64|ניו זילנד|New Zealand
NI|505|ניקרגואה|Nicaragua
NE|227|ניז'ר|Niger
NG|234|ניגריה|Nigeria
NU|683|ניואה|Niue
KP|850|קוריאה הצפונית|North Korea
MK|389|צפון מקדוניה|North Macedonia
MP|1670|איי מריאנה הצפוניים|Northern Mariana Islands
NO|47|נורווגיה|Norway
OM|968|עומאן|Oman
PK|92|פקיסטן|Pakistan
PW|680|פלאו|Palau
PS|970|הרשות הפלסטינית|Palestinian territories
PA|507|פנמה|Panama
PG|675|פפואה גינאה החדשה|Papua New Guinea
PY|595|פרגוואי|Paraguay
PE|51|פרו|Peru
PH|63|הפיליפינים|Philippines
PL|48|פולין|Poland
PT|351|פורטוגל|Portugal
PR|1787|פוארטו ריקו|Puerto Rico|וגם 1939
QA|974|קטאר|Qatar
RE|262|ראוניון|Réunion
RO|40|רומניה|Romania
RU|7|רוסיה|Russia
RW|250|רואנדה|Rwanda
PM|508|סן פייר ומיקלון|Saint Pierre and Miquelon
KN|1869|סנט קיטס ונוויס|Saint Kitts and Nevis
LC|1758|סנט לוסיה|Saint Lucia
VC|1784|סנט וינסנט והגרנדינים|Saint Vincent and the Grenadines
WS|685|סמואה|Samoa
SM|378|סן מרינו|San Marino
ST|239|סאו טומה ופרינסיפה|São Tomé and Príncipe
SA|966|ערב הסעודית|Saudi Arabia
SN|221|סנגל|Senegal
RS|381|סרביה|Serbia
SC|248|סיישל|Seychelles
SL|232|סיירה לאונה|Sierra Leone
SG|65|סינגפור|Singapore
SX|1721|סנט מארטן|Sint Maarten
SK|421|סלובקיה|Slovakia
SI|386|סלובניה|Slovenia
SB|677|איי שלמה|Solomon Islands
SO|252|סומליה|Somalia
ZA|27|דרום אפריקה|South Africa
KR|82|דרום קוריאה|South Korea
SS|211|דרום סודאן|South Sudan
ES|34|ספרד|Spain
LK|94|סרי לנקה|Sri Lanka
SD|249|סודאן|Sudan
SR|597|סורינאם|Suriname
SE|46|שוודיה|Sweden
CH|41|שווייץ|Switzerland
SY|963|סוריה|Syria
TW|886|טייוואן|Taiwan
TJ|992|טג'יקיסטן|Tajikistan
TZ|255|טנזניה|Tanzania
TH|66|תאילנד|Thailand
TL|670|מזרח טימור|Timor-Leste
TG|228|טוגו|Togo
TO|676|טונגה|Tonga
TT|1868|טרינידד וטובגו|Trinidad and Tobago
TN|216|תוניסיה|Tunisia
TR|90|טורקיה|Turkey
TM|993|טורקמניסטן|Turkmenistan
TC|1649|איי טרקס וקייקוס|Turks and Caicos Islands
TV|688|טובאלו|Tuvalu
UG|256|אוגנדה|Uganda
UA|380|אוקראינה|Ukraine
AE|971|איחוד האמירויות|United Arab Emirates
GB|44|בריטניה|United Kingdom
US|1|ארצות הברית|United States
VI|1340|איי הבתולה האמריקניים|U.S. Virgin Islands
UY|598|אורוגוואי|Uruguay
UZ|998|אוזבקיסטן|Uzbekistan
VU|678|ונואטו|Vanuatu
VA|379|הוותיקן|Vatican City
VE|58|ונצואלה|Venezuela
VN|84|וייטנאם|Vietnam
WF|681|וואליס ופוטונה|Wallis and Futuna
YE|967|תימן|Yemen
ZM|260|זמביה|Zambia
ZW|263|זימבבואה|Zimbabwe`

export const countryCodes: CountryCode[] = RAW.split('\n')
  .map((line) => {
    const [iso, digits, name, english, note = ''] = line.split('|')
    return { iso, digits, name, english, note }
  })
  .sort((first, second) => first.name.localeCompare(second.name, 'he'))

export type DialingSort = 'name' | 'code'

export const flagOf = (iso: string) =>
  String.fromCodePoint(...[...iso].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65))

export const dialFromIsrael = (country: CountryCode) => `00-${country.digits}`

const normalize = (value: string) =>
  value
    .replace(/[֑-ׇ]/g, '')
    .replace(/[׳'`’"״]/g, '')
    .toLowerCase()
    .trim()

const NUMERIC_QUERY = /^[+\d][\d\s+-]*$/

export function filterCountries(query: string, sort: DialingSort): CountryCode[] {
  const text = normalize(query)
  const numeric = NUMERIC_QUERY.test(text)
  const digits = text.replace(/^(\+|00)/, '').replace(/[\s+-]/g, '')
  const matched = countryCodes.filter((country) => {
    if (!text) return true
    if (numeric) return country.digits.startsWith(digits)
    return normalize(country.name).includes(text) || normalize(country.english).includes(text)
  })
  if (sort === 'name') return matched
  return [...matched].sort((first, second) => {
    const byCode = Number(first.digits.padEnd(4, '0')) - Number(second.digits.padEnd(4, '0'))
    return byCode || first.name.localeCompare(second.name, 'he')
  })
}

export type DialPrefix = { prefix: string; carrier: string }

export const ISRAELI_INTERNATIONAL_PREFIXES: DialPrefix[] = [
  { prefix: '00', carrier: 'קוד היציאה הרגיל, מכל חברה' },
  { prefix: '012', carrier: '012 סמייל (פרטנר)' },
  { prefix: '013', carrier: 'נטוויז׳ן (סלקום)' },
  { prefix: '014', carrier: 'בזק בינלאומי' },
  { prefix: '015', carrier: 'Hallo 015' },
  { prefix: '017', carrier: 'הוט מובייל (אלטיס)' },
  { prefix: '018', carrier: 'אקספון' },
  { prefix: '019', carrier: 'טלזר 019' },
]

export type AreaCode = { code: string; area: string }

export const AREA_CODES: AreaCode[] = [
  { code: '02', area: 'ירושלים רבתי, כולל בית שמש, מעלה אדומים וגוש עציון' },
  { code: '03', area: 'גוש דן והמרכז: תל אביב, רמת גן, בני ברק, פתח תקווה, ראשון לציון' },
  { code: '04', area: 'חיפה והצפון: כל מחוז הצפון ומחוז חיפה' },
  { code: '08', area: 'השפלה והדרום: רחובות, רמלה, באר שבע ועוד' },
  { code: '09', area: 'השרון: נתניה, הרצליה, כפר סבא, רעננה, הוד השרון' },
]

export type MobilePrefix = { prefix: string; history: string }

export const MOBILE_PREFIX_HISTORY: MobilePrefix[] = [
  { prefix: '050', history: 'פלאפון' },
  { prefix: '051', history: 'וויקום (wecom)' },
  { prefix: '052', history: 'סלקום' },
  { prefix: '053', history: 'הוט מובייל. החליפה את 057 ב-2015' },
  { prefix: '054', history: 'פרטנר' },
  { prefix: '055', history: 'רשתות וירטואליות ומפעילים שנסגרו, בטווחים משתנים' },
  { prefix: '056, 059', history: 'מפעילים ברשות הפלסטינית' },
  { prefix: '058', history: 'גולן טלקום' },
]
