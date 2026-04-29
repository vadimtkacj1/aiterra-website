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
              {(member.socials.linkedin || member.socials.instagram || member.socials.whatsapp || member.socials.facebook) ? (
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
                  {member.socials.whatsapp ? (
                    <a
                      href={member.socials.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-[#d1d5db] bg-white flex items-center justify-center text-[#6b7280] hover:text-[#1B1BB3] hover:border-[#1B1BB3]/40 transition-colors"
                      aria-label={`${member.name} WhatsApp`}
                    >
                      <WhatsAppIcon />
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

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.92.55 3.71 1.5 5.23L2 22l5.08-1.65a9.79 9.79 0 0 0 4.96 1.35h.01c5.43 0 9.83-4.4 9.83-9.84A9.84 9.84 0 0 0 12.04 2Zm0 17.97a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.01.98.98-2.93-.2-.3a8.1 8.1 0 0 1-1.26-4.35c0-4.45 3.62-8.08 8.08-8.08 4.46 0 8.08 3.63 8.08 8.08 0 4.46-3.62 8.08-8.08 8.08Zm4.43-6.06c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.17-.71-.63-1.2-1.4-1.34-1.64-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.31-.74-1.79-.2-.48-.4-.42-.54-.43h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.11.15 1.53.09.47-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28Z" />
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