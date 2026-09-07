import { CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/contact'

export const LAST_UPDATED = '06.07.2026'

export default function AccessibilityBodyEn() {
  return (
    <>
      <h2>Our commitment to accessibility</h2>
      <p>
        AITERRA is committed to providing an equitable service to every visitor and to making this
        site usable by people with disabilities. We work to bring www.aiterra.co.il in line with the
        Israeli Equal Rights for Persons with Disabilities Regulations (Service Accessibility
        Adjustments), 5773-2013, with Israeli Standard IS 5568, and with the international WCAG 2.1
        guidelines at level AA.
      </p>

      <h2>Accessibility features on this site</h2>
      <ul>
        <li>
          An accessibility widget available on every page, offering among other things: larger text,
          contrast adjustment, a readable font, highlighted links and headings, paused animation and
          an enlarged cursor
        </li>
        <li>Semantic page structure with a consistent heading hierarchy and navigation</li>
        <li>A &quot;skip to main content&quot; link at the top of every page</li>
        <li>Full keyboard navigation, including a visible focus indicator</li>
        <li>Alternative text on meaningful images</li>
        <li>Colour contrast meeting the standard across the main content</li>
        <li>
          A responsive layout for desktop, tablet and mobile, with support for browser text zoom
        </li>
      </ul>

      <h2>Known limitations</h2>
      <p>
        We work continuously to improve the accessibility of this site. Even so, some parts of it —
        including third-party embedded content and complex graphical components — may not yet be
        fully accessible. If you encounter a difficulty or a component that is not accessible, we
        would be glad to hear from you and will work to correct it promptly.
      </p>

      <h2>Contacting the accessibility coordinator</h2>
      <p>
        For accessibility enquiries, requests for adjustments, or to report a problem, you can reach
        us at:
      </p>
      <ul>
        <li>
          Email:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} dir="ltr">
            {CONTACT_EMAIL}
          </a>
        </li>
        <li>
          Phone:{' '}
          <a href={`tel:+972${CONTACT_PHONE.replace(/-/g, '').slice(1)}`} dir="ltr">
            {CONTACT_PHONE}
          </a>
        </li>
      </ul>
      <p>
        So that we can handle your enquiry efficiently, please include the address of the page where
        you encountered the problem, a description of the problem, and the assistive technology you
        are using, if relevant.
      </p>
    </>
  )
}
