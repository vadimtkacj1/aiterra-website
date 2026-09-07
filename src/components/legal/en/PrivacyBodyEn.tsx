export const LAST_UPDATED = '13.06.2026'
const PRIVACY_EMAIL = 'michael@aiterra.co.il'

export default function PrivacyBodyEn() {
  return (
    <>
      <h2>General</h2>
      <p>
        AITERRA (&quot;the Company&quot;, &quot;we&quot;) respects the privacy of users of the site
        www.aiterra.co.il (&quot;the Site&quot;). This policy sets out what information is collected
        through use of the Site, how it is stored, the purposes for which it is used and how we
        protect it, in accordance with the Israeli Protection of Privacy Law, 5741-1981 and its
        regulations. The information collected is held in the Company&apos;s database (&quot;the
        Database&quot;) and is used for the purposes set out below.
      </p>

      <h2>What information we collect</h2>
      <ul>
        <li>
          <strong>Information you provide:</strong> when you complete a contact form or leave your
          details on the Site, we collect the details you submit — including name, phone number,
          email address and the content of your enquiry. Providing this information is voluntary and
          based on your consent; it is not a legal obligation, but without it we may be unable to
          handle your enquiry.
        </li>
        <li>
          <strong>Information collected automatically:</strong> the Site uses analytics tools (such
          as Microsoft Clarity and Google Analytics) to understand how the Site is used and to
          improve the user experience. This includes browsing data, IP address, browser and device
          type, pages viewed and heat maps. This information is generally collected in aggregate,
          statistical form and does not identify you personally.
        </li>
      </ul>

      <h2>Cookies and marketing tracking tools</h2>
      <p>
        The Site uses cookies and other tracking technologies (such as pixels, tags and social
        network CAPI interfaces, for example Meta) for its ongoing operation, to adapt the Site to
        your preferences, to measure performance, and for marketing, analysis and targeted
        advertising across the web (remarketing/retargeting). A cookie consent notice is shown on
        your first visit. You can block or delete cookies at any time through your browser settings —
        note, however, that some features of the Site may not work fully without them.
      </p>

      <h2>What the information is used for</h2>
      <p>
        The information you provide and that we collect is used solely for the following purposes:
      </p>
      <ul>
        <li>
          Responding to enquiries, providing quotations and contacting you about the services you
          requested.
        </li>
        <li>Improving the Site, our services and the user experience.</li>
        <li>Personalising content, running campaigns and marketing advertising.</li>
        <li>Customer relationship management and compliance with legal requirements.</li>
      </ul>

      <h2>Marketing communications</h2>
      <p>
        Leaving contact details (such as an email address or phone number) on the Site constitutes
        your explicit consent to receive advertising material, offers, updates and marketing
        information from AITERRA, including by email, SMS or messaging platforms such as WhatsApp,
        in accordance with section 30A of the Israeli Communications Law (Telecommunications and
        Broadcasts), 5742-1982.
      </p>
      <p>
        <strong>Unsubscribing:</strong> you have the right to withdraw your consent at any time and
        to request removal from the mailing list, either by clicking the unsubscribe link included
        in every marketing message sent to you, or by contacting us directly by email.
      </p>

      <h2>Transfer of information to third parties and outside Israel</h2>
      <p>
        We do not sell, rent or transfer your personal details to third parties for profit, except
        in the following cases:
      </p>
      <ul>
        <li>
          To service providers and subcontractors acting on our behalf to operate the Site (such as
          hosting services, mailing platforms and analytics tools).
        </li>
        <li>Where required by a court order or by law.</li>
        <li>
          <strong>Transfer of information outside Israel:</strong> the information collected may be
          processed and stored on cloud servers or with service providers located outside the State
          of Israel (for example in the United States or Europe). By leaving your details you
          consent to your information being transferred and stored outside Israel, on the basis that
          those service providers meet international information security and privacy standards.
        </li>
      </ul>

      <h2>Retention period</h2>
      <p>
        Your personal information is retained in the Company&apos;s databases only for as long as
        needed to achieve the purposes set out in this policy, or for a longer period where required
        to meet legal, accounting or regulatory obligations.
      </p>

      <h2>Information security</h2>
      <p>
        We apply accepted technical and organisational security measures to protect the information,
        including encrypted traffic (HTTPS). Nevertheless, and despite our efforts, no such system
        can guarantee absolute immunity from unauthorised access, intrusion or cyber attack.
      </p>

      <h2>Minors</h2>
      <p>
        The Site and the services offered on it are intended for adult users over the age of 18. The
        Company does not knowingly collect personal information from anyone under 18. If you become
        aware that a minor has provided us with personal information without authorisation, please
        contact us so that we can delete it from our databases.
      </p>

      <h2>Your rights</h2>
      <p>
        Under the Israeli Protection of Privacy Law, 5741-1981, every person is entitled to review
        the information held about them in a database. A person who has reviewed their information
        and found it to be incorrect, incomplete, unclear or out of date may request that it be
        corrected or deleted. Requests on this matter can be sent to us by email at{' '}
        <a href={`mailto:${PRIVACY_EMAIL}`} dir="ltr">
          {PRIVACY_EMAIL}
        </a>
        .
      </p>

      <h2>Contact</h2>
      <p>
        For questions about this policy you can contact us by email at{' '}
        <a href={`mailto:${PRIVACY_EMAIL}`} dir="ltr">
          {PRIVACY_EMAIL}
        </a>
        .
      </p>
      <p>
        The Company may update or amend this policy from time to time. The updated version will be
        published on this page.
      </p>
    </>
  )
}
