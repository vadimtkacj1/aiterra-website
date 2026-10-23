export type PlatformId = 'instagram' | 'facebook' | 'whatsapp' | 'tiktok' | 'linkedin' | 'youtube' | 'google' | 'x'

export type SizeBasis = 'official' | 'common'

export type SafeZone = { top: number; bottom: number; side: number; text: string }

export type SourceId =
  | 'igResolution'
  | 'igReels'
  | 'metaIgFeed'
  | 'metaIgStory'
  | 'metaIgReels'
  | 'metaFbFeed'
  | 'metaFbStory'
  | 'fbPageImages'
  | 'fbEventCover'
  | 'sproutEvent'
  | 'waStatus'
  | 'waProfile'
  | 'tiktokCarousel'
  | 'liPageImages'
  | 'liProfileCover'
  | 'liSingleImage'
  | 'ytThumbnail'
  | 'gbpPhotos'
  | 'semrushGbp'
  | 'xAdSpecs'
  | 'xProfilePhoto'

export type SocialSource = { href: string; label: string; short: string; official: boolean }

export type SocialPreset = {
  id: string
  platform: PlatformId
  label: string
  width: number
  height: number
  ratio: string
  basis: SizeBasis
  note: string
  sources: SourceId[]
  safeZone?: SafeZone
  circle?: boolean
  maxBytes?: number
  maxBytesNote?: string
}

export type Crop = { cx: number; cy: number; zoom: number }

export type Rect = { x: number; y: number; width: number; height: number }

export type DrawPlan = {
  sx: number
  sy: number
  sw: number
  sh: number
  dx: number
  dy: number
  dw: number
  dh: number
  covers: boolean
  upscale: number
}

export const SIZES_CHECKED = '2026-10-23'
export const SIZES_CHECKED_LABEL = '23 באוקטובר 2026'

export const MAX_ZOOM = 5
export const UPSCALE_WARNING = 1.1
export const DEFAULT_PRESET_ID = 'ig-portrait'

const MB = 1024 * 1024

export const META_SAFE_ZONE: SafeZone = {
  top: 0.14,
  bottom: 0.35,
  side: 0.06,
  text: 'Meta ממליצה להשאיר בערך 14% למעלה, 35% למטה ו-6% בכל צד בלי טקסט, לוגו או פרטים חשובים, כי שם יושבים תמונת הפרופיל, הכפתורים והכיתוב.',
}

export const X_HEADER_SAFE_ZONE: SafeZone = {
  top: 0.12,
  bottom: 0.12,
  side: 0,
  text: 'לפי X, בחלק מהמסכים והדפדפנים עד 60 פיקסלים למעלה ולמטה עלולים להיחתך.',
}

export const socialSources: Record<SourceId, SocialSource> = {
  igResolution: {
    href: 'https://help.instagram.com/1631821640426723',
    label: 'Instagram Help Center: Image resolution of photos you share on Instagram',
    short: 'Instagram Help',
    official: true,
  },
  igReels: {
    href: 'https://help.instagram.com/1038071743007909',
    label: 'Instagram Help Center: Reel size & aspect ratios',
    short: 'Instagram Help',
    official: true,
  },
  metaIgFeed: {
    href: 'https://www.facebook.com/business/ads-guide/update/image/instagram-feed',
    label: 'Meta Ads Guide: Image ads in Instagram Feed',
    short: 'Meta Ads Guide',
    official: true,
  },
  metaIgStory: {
    href: 'https://www.facebook.com/business/ads-guide/update/image/instagram-story',
    label: 'Meta Ads Guide: Image ads in Instagram Stories',
    short: 'Meta Ads Guide',
    official: true,
  },
  metaIgReels: {
    href: 'https://www.facebook.com/business/ads-guide/update/image/instagram-reels',
    label: 'Meta Ads Guide: Image ads in Instagram Reels',
    short: 'Meta Ads Guide',
    official: true,
  },
  metaFbFeed: {
    href: 'https://www.facebook.com/business/ads-guide/update/image/facebook-feed',
    label: 'Meta Ads Guide: Image ads in Facebook Feed',
    short: 'Meta Ads Guide',
    official: true,
  },
  metaFbStory: {
    href: 'https://www.facebook.com/business/ads-guide/update/image/facebook-story',
    label: 'Meta Ads Guide: Image ads in Facebook Stories',
    short: 'Meta Ads Guide',
    official: true,
  },
  fbPageImages: {
    href: 'https://www.facebook.com/help/125379114252045',
    label: 'Facebook Help Center: Page profile picture and cover photo dimensions',
    short: 'Facebook Help',
    official: true,
  },
  fbEventCover: {
    href: 'https://www.facebook.com/help/1910675759253872',
    label: 'Facebook Help Center: Add a cover photo to your Facebook event',
    short: 'Facebook Help',
    official: true,
  },
  sproutEvent: {
    href: 'https://sproutsocial.com/insights/facebook-event-cover-photos/',
    label: 'Sprout Social: Facebook Event photo size & dimensions guide',
    short: 'Sprout Social',
    official: false,
  },
  waStatus: {
    href: 'https://faq.whatsapp.com/550664524802386',
    label: 'WhatsApp Help Center: Troubleshoot image quality in status ads',
    short: 'WhatsApp Help',
    official: true,
  },
  waProfile: {
    href: 'https://web.archive.org/web/20250122164500/https://developers.facebook.com/docs/whatsapp/on-premises/reference/settings/profile/photo',
    label: 'Meta for Developers, WhatsApp Business API: Profile photo (archived copy, January 2025)',
    short: 'Meta for Developers',
    official: true,
  },
  tiktokCarousel: {
    href: 'https://ads.tiktok.com/help/article/specifications-for-carousel-ads',
    label: 'TikTok for Business: Specifications for Carousel Ads',
    short: 'TikTok for Business',
    official: true,
  },
  liPageImages: {
    href: 'https://www.linkedin.com/help/linkedin/answer/a563309',
    label: 'LinkedIn Help: Image specifications for your LinkedIn Pages and Career Pages',
    short: 'LinkedIn Help',
    official: true,
  },
  liProfileCover: {
    href: 'https://www.linkedin.com/help/linkedin/answer/a568217',
    label: 'LinkedIn Help: Add or change the cover image on your profile',
    short: 'LinkedIn Help',
    official: true,
  },
  liSingleImage: {
    href: 'https://business.linkedin.com/advertise/ads/sponsored-content/single-image-ads-specs',
    label: 'LinkedIn Marketing Solutions: Single image ads specifications',
    short: 'LinkedIn Ads',
    official: true,
  },
  ytThumbnail: {
    href: 'https://support.google.com/youtube/answer/72431',
    label: 'YouTube Help: Add custom thumbnails',
    short: 'YouTube Help',
    official: true,
  },
  gbpPhotos: {
    href: 'https://support.google.com/business/answer/6103862',
    label: 'Google Business Profile Help: Manage your Business Profile photos & videos',
    short: 'Google Business Profile Help',
    official: true,
  },
  semrushGbp: {
    href: 'https://www.semrush.com/blog/google-business-profile-photo-size/',
    label: 'Semrush: Google Business Profile photo size guidelines',
    short: 'Semrush',
    official: false,
  },
  xAdSpecs: {
    href: 'https://business.x.com/en/help/campaign-setup/creative-ad-specifications',
    label: 'X Help Center: X Ads creative specs',
    short: 'X Help Center',
    official: true,
  },
  xProfilePhoto: {
    href: 'https://help.x.com/en/managing-your-account/common-issues-when-uploading-profile-photo',
    label: 'X Help Center: Help with uploading a profile photo',
    short: 'X Help Center',
    official: true,
  },
}

export const platforms: { id: PlatformId; label: string }[] = [
  { id: 'instagram', label: 'אינסטגרם' },
  { id: 'facebook', label: 'פייסבוק' },
  { id: 'whatsapp', label: 'וואטסאפ' },
  { id: 'tiktok', label: 'טיקטוק' },
  { id: 'linkedin', label: 'לינקדאין' },
  { id: 'youtube', label: 'יוטיוב' },
  { id: 'google', label: 'גוגל לעסק' },
  { id: 'x', label: 'X (טוויטר)' },
]

export const platformLabel = (id: PlatformId) => platforms.find((platform) => platform.id === id)?.label ?? id

export const socialPresets: SocialPreset[] = [
  {
    id: 'ig-portrait',
    platform: 'instagram',
    label: 'פוסט לאורך',
    width: 1080,
    height: 1350,
    ratio: '4:5',
    basis: 'official',
    note: 'אינסטגרם שומרת תמונה ברוחב 1080 בלי חיתוך כשהיחס שלה בין 1.91:1 ל-3:4, ו-4:5 נמצא בטווח. זה גם היחס ש-Meta ממליצה עליו למודעות בפיד, שם הגודל המומלץ הוא 1440×1800.',
    sources: ['igResolution', 'metaIgFeed'],
  },
  {
    id: 'ig-tall',
    platform: 'instagram',
    label: 'פוסט לאורך 3:4',
    width: 1080,
    height: 1440,
    ratio: '3:4',
    basis: 'official',
    note: 'היחס הגבוה ביותר שאינסטגרם שומרת בפוסט בלי חיתוך.',
    sources: ['igResolution'],
  },
  {
    id: 'ig-square',
    platform: 'instagram',
    label: 'פוסט ריבועי',
    width: 1080,
    height: 1080,
    ratio: '1:1',
    basis: 'official',
    note: 'ברוחב 1080, בתוך הטווח שאינסטגרם שומרת בלי חיתוך.',
    sources: ['igResolution'],
  },
  {
    id: 'ig-landscape',
    platform: 'instagram',
    label: 'פוסט לרוחב',
    width: 1080,
    height: 566,
    ratio: '1.91:1',
    basis: 'official',
    note: 'היחס הרחב ביותר שאינסטגרם שומרת בלי חיתוך.',
    sources: ['igResolution'],
  },
  {
    id: 'ig-story',
    platform: 'instagram',
    label: 'סטורי ורילס',
    width: 1080,
    height: 1920,
    ratio: '9:16',
    basis: 'common',
    note: 'אינסטגרם לא מפרסמת גודל בפיקסלים לסטורי רגיל. 9:16 הוא היחס ש-Meta מציינת לסטורי ולרילס, ו-1080 הוא הרוחב המרבי שאינסטגרם שומרת בתמונות. למודעות Meta ממליצה על 1440×2560, באותו יחס. מתאים גם לסטורי בפייסבוק.',
    sources: ['metaIgStory', 'metaIgReels', 'metaFbStory', 'igReels', 'igResolution'],
    safeZone: META_SAFE_ZONE,
  },
  {
    id: 'fb-post',
    platform: 'facebook',
    label: 'פוסט',
    width: 1440,
    height: 1800,
    ratio: '4:5',
    basis: 'official',
    note: 'ההמלצה של Meta לתמונה בפיד של פייסבוק, מתוך מדריך המודעות. לפוסט רגיל פייסבוק לא מפרסמת גודל נפרד.',
    sources: ['metaFbFeed'],
  },
  {
    id: 'fb-cover',
    platform: 'facebook',
    label: 'תמונת קאבר לעמוד',
    width: 851,
    height: 315,
    ratio: '2.7:1',
    basis: 'official',
    note: 'לפי פייסבוק זה הגודל שנטען הכי מהר, כקובץ JPG מתחת ל-100KB, ומינימום 400×150. בטלפון התמונה מוצגת ביחס אחר ותמונת הפרופיל מכסה חלק ממנה, אז את העיקר כדאי לשים במרכז.',
    sources: ['fbPageImages'],
  },
  {
    id: 'fb-event',
    platform: 'facebook',
    label: 'תמונת אירוע',
    width: 1920,
    height: 1005,
    ratio: '1.91:1',
    basis: 'common',
    note: 'פייסבוק לא מפרסמת גודל לתמונת אירוע, ורק מציינת שאי אפשר לשנות את הגודל אחרי שהתמונה נוספה. 1920×1005 הוא הגודל שמופיע במדריכים.',
    sources: ['fbEventCover', 'sproutEvent'],
  },
  {
    id: 'fb-profile',
    platform: 'facebook',
    label: 'תמונת פרופיל לעמוד',
    width: 320,
    height: 320,
    ratio: '1:1',
    basis: 'official',
    note: 'נחתכת לעיגול ומוצגת ב-176×176 במחשב וב-196×196 בטלפון. ללוגו או לטקסט פייסבוק ממליצה על PNG.',
    sources: ['fbPageImages'],
    circle: true,
  },
  {
    id: 'wa-status',
    platform: 'whatsapp',
    label: 'סטטוס',
    width: 1080,
    height: 1920,
    ratio: '9:16',
    basis: 'common',
    note: 'וואטסאפ מציינת יחס 9:16 לתמונות בסטטוס ורזולוציה מינימלית מומלצת של 500×320, בלי גודל מומלץ בפיקסלים. 1080×1920 הוא הגודל המקובל באותו יחס.',
    sources: ['waStatus'],
  },
  {
    id: 'wa-profile',
    platform: 'whatsapp',
    label: 'תמונת פרופיל לעסק',
    width: 640,
    height: 640,
    ratio: '1:1',
    basis: 'official',
    note: 'לפי התיעוד של WhatsApp Business API, התמונה נחתכת לריבוע של עד 640 פיקסלים ועד 5MB, ותמונה שצלע שלה קטנה מ-192 פיקסלים עלולה לצאת לא טוב. מוצגת בעיגול.',
    sources: ['waProfile'],
    circle: true,
    maxBytes: 5 * MB,
    maxBytesNote: 'וואטסאפ מקבלת תמונת פרופיל עד 5MB',
  },
  {
    id: 'tiktok-vertical',
    platform: 'tiktok',
    label: 'פוסט תמונה לאורך',
    width: 1080,
    height: 1920,
    ratio: '9:16',
    basis: 'common',
    note: 'טיקטוק מפרסמת לתמונה לאורך במודעות קרוסלה 720×1280, ביחס 9:16. לפוסט רגיל אין גודל רשמי, ו-1080×1920 באותו יחס נותן תמונה חדה יותר.',
    sources: ['tiktokCarousel'],
  },
  {
    id: 'li-square',
    platform: 'linkedin',
    label: 'פוסט ריבועי',
    width: 1200,
    height: 1200,
    ratio: '1:1',
    basis: 'official',
    note: 'מתוך מפרט המודעות של לינקדאין: היחס שלינקדאין ממליצה עליו כדי שהתמונה תוצג טוב במחשב ובטלפון.',
    sources: ['liSingleImage'],
  },
  {
    id: 'li-link',
    platform: 'linkedin',
    label: 'תמונה לפוסט עם קישור',
    width: 1200,
    height: 627,
    ratio: '1.91:1',
    basis: 'official',
    note: 'תמונה ברוחב של פחות מ-200 פיקסלים תוצג כתמונה ממוזערת בצד הפוסט.',
    sources: ['liPageImages'],
  },
  {
    id: 'li-banner',
    platform: 'linkedin',
    label: 'באנר לפרופיל אישי',
    width: 1584,
    height: 396,
    ratio: '4:1',
    basis: 'official',
    note: 'JPG או PNG, פחות מ-8MB. תמונת הפרופיל מוצגת מעליה.',
    sources: ['liProfileCover'],
    maxBytes: 8 * MB,
    maxBytesNote: 'לינקדאין מקבלת באנר לפרופיל עד 8MB',
  },
  {
    id: 'li-cover',
    platform: 'linkedin',
    label: 'קאבר לעמוד חברה',
    width: 1512,
    height: 256,
    ratio: '5.9:1',
    basis: 'official',
    note: 'PNG או JPEG עד 3MB. לינקדאין ממליצה להרחיק פרטים חשובים מהשוליים, בעיקר מהפינה הימנית התחתונה.',
    sources: ['liPageImages'],
    maxBytes: 3 * MB,
    maxBytesNote: 'לינקדאין מקבלת תמונות לעמוד חברה עד 3MB',
  },
  {
    id: 'li-logo',
    platform: 'linkedin',
    label: 'לוגו לעמוד חברה',
    width: 400,
    height: 400,
    ratio: '1:1',
    basis: 'official',
    note: 'מינימום 268×268. לוגו שקוף מוצג על רקע לבן.',
    sources: ['liPageImages'],
    maxBytes: 3 * MB,
    maxBytesNote: 'לינקדאין מקבלת תמונות לעמוד חברה עד 3MB',
  },
  {
    id: 'yt-thumbnail',
    platform: 'youtube',
    label: 'תמונה ממוזערת לסרטון',
    width: 3840,
    height: 2160,
    ratio: '16:9',
    basis: 'official',
    note: 'רוחב מינימלי 640. מהטלפון אפשר להעלות עד 2MB, מהמחשב עד 50MB. לתמונה ממוזערת של Shorts יוטיוב ממליצה על 9:16.',
    sources: ['ytThumbnail'],
    maxBytes: 2 * MB,
    maxBytesNote: 'מהטלפון יוטיוב מקבלת תמונה ממוזערת עד 2MB (מהמחשב עד 50MB)',
  },
  {
    id: 'gbp-logo',
    platform: 'google',
    label: 'לוגו בפרופיל העסק',
    width: 720,
    height: 720,
    ratio: '1:1',
    basis: 'official',
    note: 'גוגל ממליצה על 720×720 לתמונות בפרופיל העסק, מינימום 250×250, קובץ JPG או PNG בין 10KB ל-5MB.',
    sources: ['gbpPhotos'],
    maxBytes: 5 * MB,
    maxBytesNote: 'גוגל מקבלת בפרופיל העסק קבצים עד 5MB',
  },
  {
    id: 'gbp-cover',
    platform: 'google',
    label: 'תמונת שער בפרופיל העסק',
    width: 1024,
    height: 576,
    ratio: '16:9',
    basis: 'common',
    note: 'גוגל לא מפרסמת גודל לתמונת השער, רק את ההמלצה הכללית של 720×720 ו-JPG או PNG עד 5MB. 16:9 ב-1024×576 הוא הגודל המקובל במדריכים.',
    sources: ['gbpPhotos', 'semrushGbp'],
    maxBytes: 5 * MB,
    maxBytesNote: 'גוגל מקבלת בפרופיל העסק קבצים עד 5MB',
  },
  {
    id: 'gbp-post',
    platform: 'google',
    label: 'תמונה לעדכון בפרופיל העסק',
    width: 1200,
    height: 900,
    ratio: '4:3',
    basis: 'common',
    note: 'גוגל לא מפרסמת גודל לתמונה בעדכונים. 1200×900 ביחס 4:3 הוא הגודל המקובל במדריכים.',
    sources: ['gbpPhotos', 'semrushGbp'],
    maxBytes: 5 * MB,
    maxBytesNote: 'גוגל מקבלת בפרופיל העסק קבצים עד 5MB',
  },
  {
    id: 'x-post',
    platform: 'x',
    label: 'פוסט לרוחב',
    width: 1920,
    height: 1080,
    ratio: '16:9',
    basis: 'official',
    note: 'מתוך מפרט המודעות של X, שתומך גם ב-1:1 (1080×1080), ב-4:5 (1440×1800) וב-9:16 (1080×1920). קובץ עד 5MB, PNG או JPEG.',
    sources: ['xAdSpecs'],
    maxBytes: 5 * MB,
    maxBytesNote: 'X מקבלת תמונה עד 5MB',
  },
  {
    id: 'x-header',
    platform: 'x',
    label: 'תמונת כותרת לפרופיל',
    width: 1500,
    height: 500,
    ratio: '3:1',
    basis: 'official',
    note: 'בחלק מהמסכים עד 60 פיקסלים למעלה ולמטה עלולים להיחתך.',
    sources: ['xProfilePhoto'],
    safeZone: X_HEADER_SAFE_ZONE,
  },
  {
    id: 'x-profile',
    platform: 'x',
    label: 'תמונת פרופיל',
    width: 400,
    height: 400,
    ratio: '1:1',
    basis: 'official',
    note: 'JPEG, GIF או PNG עד 2MB. מוצגת בעיגול.',
    sources: ['xProfilePhoto'],
    circle: true,
    maxBytes: 2 * MB,
    maxBytesNote: 'X מקבלת תמונת פרופיל עד 2MB',
  },
]

export const presetById = (id: string) => socialPresets.find((preset) => preset.id === id)

export const presetsFor = (platform: PlatformId) => socialPresets.filter((preset) => preset.platform === platform)

export const presetName = (preset: SocialPreset) => `${platformLabel(preset.platform)}: ${preset.label}`

export const dimensions = (preset: { width: number; height: number }) => `${preset.width}×${preset.height}`

export const aspectOf = (preset: { width: number; height: number }) => preset.width / preset.height

export function baseCropSize(imageWidth: number, imageHeight: number, aspect: number) {
  if (imageWidth / imageHeight > aspect) return { width: imageHeight * aspect, height: imageHeight }
  return { width: imageWidth, height: imageWidth / aspect }
}

export function fitZoom(imageWidth: number, imageHeight: number, aspect: number) {
  const base = baseCropSize(imageWidth, imageHeight, aspect)
  return Math.min(base.width / imageWidth, base.height / imageHeight)
}

export const defaultCrop = (imageWidth: number, imageHeight: number): Crop => ({
  cx: imageWidth / 2,
  cy: imageHeight / 2,
  zoom: 1,
})

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function clampAxis(center: number, cropSize: number, imageSize: number) {
  const low = Math.min(cropSize / 2, imageSize - cropSize / 2)
  const high = Math.max(cropSize / 2, imageSize - cropSize / 2)
  return clamp(center, low, high)
}

export function clampCrop(crop: Crop, imageWidth: number, imageHeight: number, aspect: number): Crop {
  const zoom = clamp(crop.zoom, fitZoom(imageWidth, imageHeight, aspect), MAX_ZOOM)
  const base = baseCropSize(imageWidth, imageHeight, aspect)
  const width = base.width / zoom
  const height = base.height / zoom
  return {
    cx: clampAxis(crop.cx, width, imageWidth),
    cy: clampAxis(crop.cy, height, imageHeight),
    zoom,
  }
}

export function cropRect(crop: Crop, imageWidth: number, imageHeight: number, aspect: number): Rect {
  const safe = clampCrop(crop, imageWidth, imageHeight, aspect)
  const base = baseCropSize(imageWidth, imageHeight, aspect)
  const width = base.width / safe.zoom
  const height = base.height / safe.zoom
  return { x: safe.cx - width / 2, y: safe.cy - height / 2, width, height }
}

export function moveCrop(
  crop: Crop,
  deltaX: number,
  deltaY: number,
  imageWidth: number,
  imageHeight: number,
  aspect: number,
): Crop {
  return clampCrop({ ...crop, cx: crop.cx + deltaX, cy: crop.cy + deltaY }, imageWidth, imageHeight, aspect)
}

export function zoomCrop(crop: Crop, zoom: number, imageWidth: number, imageHeight: number, aspect: number): Crop {
  return clampCrop({ ...crop, zoom }, imageWidth, imageHeight, aspect)
}

export function fitCrop(imageWidth: number, imageHeight: number, aspect: number): Crop {
  return clampCrop(
    { cx: imageWidth / 2, cy: imageHeight / 2, zoom: fitZoom(imageWidth, imageHeight, aspect) },
    imageWidth,
    imageHeight,
    aspect,
  )
}

export function drawPlan(
  crop: Crop,
  imageWidth: number,
  imageHeight: number,
  outputWidth: number,
  outputHeight: number,
): DrawPlan {
  const rect = cropRect(crop, imageWidth, imageHeight, outputWidth / outputHeight)
  const scaleX = outputWidth / rect.width
  const scaleY = outputHeight / rect.height
  const sx = Math.max(0, rect.x)
  const sy = Math.max(0, rect.y)
  const ex = Math.min(imageWidth, rect.x + rect.width)
  const ey = Math.min(imageHeight, rect.y + rect.height)
  const dx = (sx - rect.x) * scaleX
  const dy = (sy - rect.y) * scaleY
  const dw = (ex - sx) * scaleX
  const dh = (ey - sy) * scaleY
  const edge = 0.5
  return {
    sx,
    sy,
    sw: ex - sx,
    sh: ey - sy,
    dx,
    dy,
    dw,
    dh,
    covers: dx <= edge && dy <= edge && dx + dw >= outputWidth - edge && dy + dh >= outputHeight - edge,
    upscale: Math.max(scaleX, scaleY),
  }
}

export function previewBox(crop: Crop, imageWidth: number, imageHeight: number, aspect: number) {
  const rect = cropRect(crop, imageWidth, imageHeight, aspect)
  return {
    left: (-rect.x / rect.width) * 100,
    top: (-rect.y / rect.height) * 100,
    width: (imageWidth / rect.width) * 100,
    height: (imageHeight / rect.height) * 100,
  }
}

export type ExportFormat = 'jpeg' | 'png' | 'webp'

export const exportTypes: Record<ExportFormat, 'image/jpeg' | 'image/png' | 'image/webp'> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

const exportExtensions: Record<ExportFormat, string> = { jpeg: 'jpg', png: 'png', webp: 'webp' }

export const formatFromType = (type: string): ExportFormat | null =>
  type === 'image/jpeg' ? 'jpeg' : type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : null

export function exportFileName(sourceName: string, preset: SocialPreset, format: ExportFormat) {
  const base =
    sourceName
      .replace(/\.[^./\\]+$/, '')
      .replace(/[\\/:*?"<>|]+/g, '-')
      .trim() || 'image'
  return `${base}-${preset.id}-${preset.width}x${preset.height}.${exportExtensions[format]}`
}

export const percent = (value: number) => `${Math.round(value * 100)}%`

export type TextPart = { text: string; ltr: boolean }

export function splitDimensions(text: string): TextPart[] {
  return text
    .split(/(\d+(?:\.\d+)?×\d+(?:\.\d+)?)/)
    .filter(Boolean)
    .map((part) => ({ text: part, ltr: /^\d+(?:\.\d+)?×\d+(?:\.\d+)?$/.test(part) }))
}

export const usedSources = (): SourceId[] => [...new Set(socialPresets.flatMap((preset) => preset.sources))]

export const safeZonePixels = (preset: SocialPreset) =>
  preset.safeZone
    ? {
        top: Math.round(preset.height * preset.safeZone.top),
        bottom: Math.round(preset.height * preset.safeZone.bottom),
        side: Math.round(preset.width * preset.safeZone.side),
      }
    : null
