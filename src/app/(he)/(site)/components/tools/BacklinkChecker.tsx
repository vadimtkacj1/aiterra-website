'use client'

import { useState, type FormEvent } from 'react'
import {
  isIsraeliDomain,
  loadProfile,
  missingDonors,
  rootDomain,
  type LinkDonor,
  type LinkProfile,
} from '@/lib/link-index'
import ui from './toolUi.module.css'
import styles from './BacklinkChecker.module.css'

type Result = { own: LinkProfile | null; ownDomain: string; rival: LinkProfile | null; rivalDomain: string }

const donorsHeading = ({ donors, referring }: LinkProfile) =>
  donors.length < referring
    ? `${donors.length} האתרים המקשרים עם הציון הגבוה ביותר, מתוך ${referring.toLocaleString('he-IL')}`
    : 'אתרים מקשרים'

function DonorTable({ donors }: { donors: LinkDonor[] }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">אתר מקשר</th>
            <th scope="col">ציון</th>
            <th scope="col">סוג קישור</th>
          </tr>
        </thead>
        <tbody>
          {donors.map((donor) => (
            <tr key={donor.domain}>
              <td dir="ltr">{donor.domain}</td>
              <td>{donor.score}</td>
              <td>{donor.follow ? 'רגיל' : 'nofollow'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Summary({ profile }: { profile: LinkProfile }) {
  return (
    <dl className={styles.metrics}>
      <div>
        <dt>ציון סמכות</dt>
        <dd>{profile.score}</dd>
      </div>
      <div>
        <dt>מקום בישראל</dt>
        <dd>{profile.place?.toLocaleString('he-IL') ?? '—'}</dd>
      </div>
      <div>
        <dt>אתרים מקשרים</dt>
        <dd>{profile.referring.toLocaleString('he-IL')}</dd>
      </div>
      <div>
        <dt>בלי nofollow</dt>
        <dd>{profile.followReferring.toLocaleString('he-IL')}</dd>
      </div>
    </dl>
  )
}

export default function BacklinkChecker() {
  const [site, setSite] = useState('')
  const [competitor, setCompetitor] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const ownDomain = rootDomain(site)
    const rivalDomain = competitor.trim() ? rootDomain(competitor) : ''
    if (!isIsraeliDomain(ownDomain) || (rivalDomain && !isIsraeliDomain(rivalDomain))) {
      setResult(null)
      setError('הבדיקה עובדת כרגע על דומיינים ישראליים בלבד, למשל example.co.il')
      return
    }
    setLoading(true)
    setError('')
    try {
      const [own, rival] = await Promise.all([loadProfile(ownDomain), rivalDomain ? loadProfile(rivalDomain) : null])
      setResult({ own, ownDomain, rival, rivalDomain })
    } catch {
      setError('הטעינה נכשלה. נסו שוב בעוד רגע.')
    } finally {
      setLoading(false)
    }
  }

  const gap = result?.rival ? missingDonors(result.own, result.rival) : []

  return (
    <div className={styles.wrap}>
      <form onSubmit={submit} className={styles.form}>
        <label className={ui.field}>
          <span>האתר שלכם</span>
          <input dir="ltr" value={site} onChange={(event) => setSite(event.target.value)} placeholder="example.co.il" required />
        </label>
        <label className={ui.field}>
          <span>מתחרה, לא חובה</span>
          <input dir="ltr" value={competitor} onChange={(event) => setCompetitor(event.target.value)} placeholder="competitor.co.il" />
        </label>
        <button type="submit" className={ui.primary} disabled={loading}>
          {loading ? 'בודק' : 'בדיקת קישורים'}
        </button>
      </form>

      {error ? <p role="alert">{error}</p> : null}

      {result ? (
        <div aria-live="polite">
          <h3 dir="ltr" className={styles.domain}>{result.ownDomain}</h3>
          {result.own ? (
            <>
              <Summary profile={result.own} />
              {result.own.donors.length ? (
                <>
                  <h3>{donorsHeading(result.own)}</h3>
                  <DonorTable donors={result.own.donors} />
                </>
              ) : null}
              {result.own.anchors.length ? (
                <>
                  <h3>טקסטי קישור נפוצים</h3>
                  <ul className={styles.anchors}>
                    {result.own.anchors.map((anchor) => (
                      <li key={anchor}>{anchor}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </>
          ) : (
            <p>לא מצאנו קישורים לאתר הזה במאגר. זה לא אומר שאין כאלה, רק שלא נמצאו בסריקה שלנו.</p>
          )}

          {result.rivalDomain ? (
            <>
              <h3 dir="ltr" className={styles.domain}>{result.rivalDomain}</h3>
              {result.rival ? (
                <>
                  <Summary profile={result.rival} />
                  <h3>מקשרים למתחרה ולא נמצאו אצלכם</h3>
                  {result.rival.donors.length < result.rival.referring ? (
                    <p>
                      ההשוואה בודקת את {result.rival.donors.length} האתרים עם הציון הגבוה ביותר שמקשרים למתחרה, מתוך{' '}
                      {result.rival.referring.toLocaleString('he-IL')}.
                    </p>
                  ) : null}
                  {gap.length ? <DonorTable donors={gap} /> : <p>לא נמצאו פערים בין האתרים המובילים.</p>}
                </>
              ) : (
                <p>לא מצאנו קישורים למתחרה במאגר.</p>
              )}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
