import Image from 'next/image'

const team = [
  {
    name: 'אריק (Erik)',
    role: 'מנהל אסטרטגיה, קריאייטיב והפקה',
    bio: 'טקסט: אריק הוא הכוח היצירתי שגורם למותגים לבלוט ברשת. הוא אחראי על בניית אסטרטגיות שיווק מנצחות, כתיבת תסריטים חדים שמדברים לקהל היעד, וניהול הצילום וההפקה המקצועית של התוכן. אריק דואג שהמסר של העסק שלכם יחתוך את הרעש הדיגיטלי, יעורר סקרנות, וייראה הכי אותנטי ומשכנע שיש',
  },
  {
    name: 'מיכאל (Michael)',
    role: 'מנהל מכירות וניהול פרויקטים',
    bio: 'מיכאל הוא הפנים של AITERRA מול הלקוחות שלנו והכוחות שלו. הוא מנהל מכירות ומוודא שהתהליך כולו מהיר – מנקב הצרכים ועד להשקה המוצלחת.',
  },
  {
    name: 'ואדים (Vadim)',
    role: 'מתכנת ראשי (Lead Developer)',
    bio: 'ואדים הוא המוח הטכנולוגי מאחורי הקלעים. כמתכנת הראשי שלנו, הוא אחראי לקוד נקי, מהיר ומאובטח. בין אם פיתוח אתר איקומרס מורכב או יצירת אוטומציות חכמות.',
  },
  {
    name: 'שון (Sean)',
    role: 'מנהל פיתוח וקידום דיגיטלי (SEO & Google Ads)',
    bio: 'שון מחבר בצורה מושלמת בין עולמות הקוד ומניעי החיפוש. הוא מגייל את האסטרטגיה הקדמית לקבל הועד הגנסים ם עסקיים גם על פרסום ממומן בגוגל.',
  },
]

export default function TeamSection() {
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
          {team.map((member) => (
            <div key={member.name} className="flex-none w-75 md:w-auto flex flex-col items-start text-right gap-4 px-4 md:px-0 first:pl-6 last:pr-6 md:first:pl-0 md:last:pr-0">
              <div className="w-full aspect-square relative overflow-hidden">
                <Image
                  src="/images/person.jpg"
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
              <p style={{ fontSize: '14px', lineHeight: '140%' }} className="text-gray-500">
                {member.bio}
              </p>
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