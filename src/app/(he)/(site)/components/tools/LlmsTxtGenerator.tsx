'use client'

import { useId, useMemo, useState } from 'react'
import { Copy, Download, ExternalLink } from 'lucide-react'
import {
  bots,
  buildLlmsTxt,
  buildRobotsTxt,
  defaultRules,
  defaultSite,
  kindLabels,
  llmsFileName,
  presets,
  robotsFileName,
  siteOrigin,
  type BotKind,
  type BotRule,
  type SiteInfo,
} from '@/lib/llms-txt'
import ui from './toolUi.module.css'
import styles from './LlmsTxtGenerator.module.css'

type Area = 'llms' | 'robots'
type Status = { area: Area; text: string } | null

const COPY_FAILED = 'ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.'
const kinds: BotKind[] = ['search', 'user', 'training']

const track = (format: string) => window.gtag?.('event', 'llms_txt_generator', { format })

function downloadText(text: string, fileName: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

export default function LlmsTxtGenerator() {
  const ids = {
    name: useId(),
    url: useId(),
    summary: useId(),
    details: useId(),
    main: useId(),
    optional: useId(),
    paths: useId(),
    sitemap: useId(),
  }
  const [site, setSite] = useState<SiteInfo>(defaultSite)
  const [rules, setRules] = useState<Record<string, BotRule>>(defaultRules)
  const [disallowPaths, setDisallowPaths] = useState('')
  const [sitemapUrl, setSitemapUrl] = useState('')
  const [status, setStatus] = useState<Status>(null)

  const llms = useMemo(() => buildLlmsTxt(site), [site])
  const robots = useMemo(() => buildRobotsTxt({ rules, disallowPaths, sitemapUrl }), [rules, disallowPaths, sitemapUrl])
  const origin = siteOrigin(site.siteUrl)

  const setField = (key: keyof SiteInfo, value: string) => {
    setSite((current) => ({ ...current, [key]: value }))
    setStatus(null)
  }

  const setRule = (token: string, rule: BotRule) => {
    setRules((current) => ({ ...current, [token]: rule }))
    setStatus(null)
  }

  const copy = async (area: Area, value: string, done: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setStatus({ area, text: done })
      track(`${area}_copy`)
    } catch {
      setStatus({ area, text: COPY_FAILED })
    }
  }

  const download = (area: Area, value: string, fileName: string) => {
    downloadText(value, fileName)
    setStatus({ area, text: `הקובץ ${fileName} ירד` })
    track(`${area}_download`)
  }

  return (
    <section className={ui.tool} aria-label="מחולל llms.txt ו-robots.txt לבוטים של AI">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>llms.txt: על האתר</legend>
            <div className={ui.row}>
              <div className={ui.field}>
                <label htmlFor={ids.name} className={ui.label}>
                  שם האתר או העסק
                </label>
                <input
                  id={ids.name}
                  type="text"
                  className={ui.input}
                  value={site.name}
                  onChange={(event) => setField('name', event.target.value)}
                />
              </div>
              <div className={ui.field}>
                <label htmlFor={ids.url} className={ui.label}>
                  כתובת האתר
                </label>
                <input
                  id={ids.url}
                  type="text"
                  inputMode="url"
                  className={`${ui.input} ${ui.ltr}`}
                  placeholder="https://example.co.il"
                  value={site.siteUrl}
                  onChange={(event) => setField('siteUrl', event.target.value)}
                />
              </div>
            </div>
            <div className={ui.field}>
              <label htmlFor={ids.summary} className={ui.label}>
                תיאור קצר
              </label>
              <p className={ui.hint}>משפט או שניים שמסבירים מה האתר ולמי הוא מיועד. זה יופיע כציטוט מתחת לכותרת.</p>
              <textarea
                id={ids.summary}
                className={`${ui.input} ${ui.textarea}`}
                value={site.summary}
                onChange={(event) => setField('summary', event.target.value)}
              />
            </div>
            <div className={ui.field}>
              <label htmlFor={ids.details} className={ui.label}>
                פרטים נוספים (לא חובה)
              </label>
              <p className={ui.hint}>שפות, אזורי שירות, איך לפרש את הקישורים. בלי כותרות.</p>
              <textarea
                id={ids.details}
                className={`${ui.input} ${ui.textarea}`}
                value={site.details}
                onChange={(event) => setField('details', event.target.value)}
              />
            </div>
            <div className={ui.field}>
              <label htmlFor={ids.main} className={ui.label}>
                דפים עיקריים
              </label>
              <p className={ui.hint}>שורה לכל דף, בצורה: כותרת | כתובת | תיאור קצר. אפשר גם כתובת בלבד, ונתיב שמתחיל ב-/ יושלם לפי כתובת האתר.</p>
              <textarea
                id={ids.main}
                className={`${ui.input} ${ui.textarea} ${ui.ltr}`}
                placeholder="שירותים | /services | כל השירותים שלנו"
                value={site.mainPages}
                onChange={(event) => setField('mainPages', event.target.value)}
              />
            </div>
            <div className={ui.field}>
              <label htmlFor={ids.optional} className={ui.label}>
                דפים משניים (Optional)
              </label>
              <p className={ui.hint}>
                לפי המפרט, הסעיף Optional מיועד למידע משני שאפשר לדלג עליו כשצריך הקשר קצר יותר. אותו פורמט שורות.
              </p>
              <textarea
                id={ids.optional}
                className={`${ui.input} ${ui.textarea} ${ui.ltr}`}
                value={site.optionalPages}
                onChange={(event) => setField('optionalPages', event.target.value)}
              />
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>robots.txt: מי נכנס</legend>
            <div className={styles.presets}>
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={ui.secondary}
                  onClick={() => {
                    setRules(preset.rules(bots))
                    setStatus(null)
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            {kinds.map((kind) => (
              <fieldset key={kind} className={ui.group}>
                <legend className={ui.legend}>{kindLabels[kind].title}</legend>
                <p className={ui.hint}>{kindLabels[kind].intro}</p>
                <ul className={styles.bots}>
                  {bots
                    .filter((bot) => bot.kind === kind)
                    .map((bot) => (
                      <li key={bot.token} className={styles.bot}>
                        <fieldset className={styles.botSet}>
                          <legend className={styles.botName}>
                            <span dir="ltr">{bot.token}</span>
                            <span className={styles.vendor}>{bot.vendor}</span>
                          </legend>
                          <p className={styles.botText}>
                            {bot.summary}{' '}
                            <a href={bot.sourceUrl} target="_blank" rel="noopener">
                              מקור
                              <ExternalLink aria-hidden="true" />
                            </a>
                          </p>
                          <div className={styles.choices}>
                            {(['allow', 'block'] as const).map((rule) => (
                              <label key={rule} className={styles.choice}>
                                <input
                                  type="radio"
                                  name={bot.token}
                                  checked={rules[bot.token] === rule}
                                  onChange={() => setRule(bot.token, rule)}
                                />
                                <span>{rule === 'allow' ? 'לאפשר' : 'לחסום'}</span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                      </li>
                    ))}
                </ul>
              </fieldset>
            ))}
            <div className={ui.field}>
              <label htmlFor={ids.paths} className={ui.label}>
                נתיבים שאסור לסרוק (לא חובה)
              </label>
              <p className={ui.hint}>
                נתיב בשורה, למשל /admin/. הנתיבים יתווספו לכל סורק שאתם מאפשרים. סורק שיש לו קבוצה משלו לא קורא את
                הכללים של User-agent: * שבקובץ הקיים.
              </p>
              <textarea
                id={ids.paths}
                className={`${ui.input} ${ui.textarea} ${ui.ltr}`}
                value={disallowPaths}
                onChange={(event) => {
                  setDisallowPaths(event.target.value)
                  setStatus(null)
                }}
              />
            </div>
            <div className={ui.field}>
              <label htmlFor={ids.sitemap} className={ui.label}>
                כתובת מפת האתר (לא חובה)
              </label>
              <input
                id={ids.sitemap}
                type="url"
                inputMode="url"
                className={`${ui.input} ${ui.ltr}`}
                placeholder={origin ? `${origin}/sitemap.xml` : 'https://example.co.il/sitemap.xml'}
                value={sitemapUrl}
                onChange={(event) => {
                  setSitemapUrl(event.target.value)
                  setStatus(null)
                }}
              />
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>הקבצים</h2>

            <h3 className={styles.fileTitle}>
              <span dir="ltr">{llmsFileName}</span>
            </h3>
            <pre className={styles.code} dir="ltr" tabIndex={0}>
              {llms.text}
            </pre>
            {llms.issues.length ? (
              <ul className={styles.issues}>
                {llms.issues.map((issue) => (
                  <li key={`${issue.line}-${issue.text}`}>
                    שורה {issue.line}: <span dir="ltr">{issue.text}</span>. {issue.reason}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className={ui.actions}>
              <button
                type="button"
                className={ui.primary}
                onClick={() => copy('llms', llms.text, 'התוכן של llms.txt הועתק')}
              >
                <Copy aria-hidden="true" />
                העתקה
              </button>
              <button type="button" className={ui.secondary} onClick={() => download('llms', llms.text, llmsFileName)}>
                <Download aria-hidden="true" />
                הורדה
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status?.area === 'llms' ? status.text : ''}
            </p>

            <h3 className={styles.fileTitle}>
              <span dir="ltr">{robotsFileName}</span>
            </h3>
            <pre className={styles.code} dir="ltr" tabIndex={0}>
              {robots}
            </pre>
            <div className={ui.actions}>
              <button
                type="button"
                className={ui.primary}
                onClick={() => copy('robots', robots, 'התוכן של robots.txt הועתק')}
              >
                <Copy aria-hidden="true" />
                העתקה
              </button>
              <button
                type="button"
                className={ui.secondary}
                onClick={() => download('robots', robots, robotsFileName)}
              >
                <Download aria-hidden="true" />
                הורדה
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status?.area === 'robots' ? status.text : ''}
            </p>

            <p className={ui.note}>
              הקבצים נוצרים בדפדפן ולא נשלחים לשום מקום. את llms.txt מעלים לשורש האתר, בכתובת
              {origin ? ` ${origin}/llms.txt` : ' /llms.txt'}. את בלוק ה-robots.txt מוסיפים לקובץ הקיים ולא מחליפים בו
              את מה שכבר כתוב, כדי לא לדרוס כללים של Googlebot, של מערכת הניהול או של תוסף האבטחה.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
