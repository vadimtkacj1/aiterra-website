import Image from 'next/image'
import { getAllAuthors } from '@/lib/authors-server'

export default function TeamSection() {
  const members = getAllAuthors()
  return (
    <section className="bg-white py-24" dir="rtl">
      <div className="max-w-7xl mx-auto px-0 md:px-6">
        <div className="text-right mb-16 px-6 md:px-0">
          <h2
            className="text-[20px] md:text-[48px]"
            style={{
              fontWeight: 700,
              lineHeight: '1.1',
              color: '#000000',
              marginBottom: '24px'
            }}
          >
            הצוות שלנו כותרת ראשית
          </h2>
          
          <div 
            style={{
              fontWeight: 700,
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#626262',
              maxWidth: '750px',
            }}
            className='md:mr-[40px]'
          >
            <p className="mb-2">המוחות מאחורי הטכנולוגיה וההצלחה שלכם</p>
            <p>
              טקסט פתיחה קצר: ב-AITERRA, אנחנו מאמינים שהטכנולוגיה הכי טובה בעולם לא שווה הרבה בלי האנשים הנכונים שמפעילים אותה. לכן, הרכבנו {'"'}סיירת דיגיטלית{'"'} ממוקדת-מטרה, המשלבת יכולות פיתוח עמוקות יחד עם אסטרטגיות שיווק ולידים אגרסיביות. כל אחד מאיתנו חי ונושם את תחום המומחיות שלו, ויחד – אנחנו המנוע שדוחף את העסק שלכם למקסימום חשיפה, המרות וצמיחה.
            </p>
          </div>
        </div>

        <div className="flex flex-row overflow-x-auto pb-8 md:pb-0 scroll-smooth hide-scrollbar md:overflow-visible md:grid md:grid-cols-4 md:gap-8">
          {members.map((member) => (
            <div key={member.name} className="flex-none w-75 md:w-auto flex flex-col items-start text-right gap-4 px-4 md:px-0 first:pl-6 last:pr-6 md:first:pl-0 md:last:pr-0">
              <div className="w-full aspect-square relative overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 style={{ fontSize: '20px', fontWeight: 700 }} className="text-gray-900">
                  {member.name}
                </h3>
                <p
                  style={{
                    background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  {member.role}
                </p>
              </div>
              {member.bio ? (
                <p style={{ fontSize: '14px', lineHeight: '140%' }} className="text-gray-500">
                  {member.bio}
                </p>
              ) : null}
              {(member.socials.linkedin || member.socials.instagram || member.socials.facebook) ? (
                <div className="flex items-center gap-2 pt-1">
                  {member.socials.linkedin ? (
                    <a
                      href={member.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-[#d1d5db] bg-white flex items-center justify-center text-[#6b7280] hover:text-[#1B1BB3] hover:border-[#1B1BB3]/40 transition-colors"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <LinkedInIcon />
                    </a>
                  ) : null}
                  {member.socials.instagram ? (
                    <a
                      href={member.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-[#d1d5db] bg-white flex items-center justify-center text-[#6b7280] hover:text-[#1B1BB3] hover:border-[#1B1BB3]/40 transition-colors"
                      aria-label={`${member.name} Instagram`}
                    >
                      <InstagramIcon />
                    </a>
                  ) : null}
                  {member.socials.facebook ? (
                    <a
                      href={member.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-[#d1d5db] bg-white flex items-center justify-center text-[#6b7280] hover:text-[#1B1BB3] hover:border-[#1B1BB3]/40 transition-colors"
                      aria-label={`${member.name} Facebook`}
                    >
                      <FacebookIcon />
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M6.94 8.5H4V20h2.94V8.5ZM5.47 3C4.56 3 3.8 3.75 3.8 4.67c0 .91.75 1.66 1.67 1.66.91 0 1.66-.75 1.66-1.66C7.13 3.75 6.38 3 5.47 3ZM20 12.91c0-2.93-1.56-4.29-3.64-4.29-1.68 0-2.43.92-2.85 1.57V8.5H10.6V20h2.91v-5.69c0-1.5.29-2.95 2.15-2.95 1.83 0 1.86 1.72 1.86 3.05V20H20v-7.09Z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.25.2 2.25.2v2.47H15.2c-1.24 0-1.63.78-1.63 1.58v1.88h2.78l-.44 2.9h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94Z" />
    </svg>
  )
}