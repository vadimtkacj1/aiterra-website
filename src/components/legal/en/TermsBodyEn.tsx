export const LAST_UPDATED = '06.07.2026'
const TERMS_EMAIL = 'michael@aiterra.co.il'

export default function TermsBodyEn() {
  return (
    <>
      <h2>1. Introduction</h2>
      <p>
        Welcome to the AITERRA website at www.aiterra.co.il (respectively, &quot;the Site&quot; and
        &quot;the Company&quot;).
      </p>
      <p>
        Use of the Site, the content presented on it and the various services it offers is subject
        to the terms of use set out in this document (&quot;the Terms&quot;). Please read these
        terms carefully: browsing and using the Site constitute your irrevocable agreement to all of
        the terms set out below. If you do not agree to any of these terms, please cease all use of
        the Site immediately.
      </p>

      <h2>2. The nature of the Site and the services</h2>
      <p>
        The Site serves as a marketing and presentation platform for the Company&apos;s services in
        digital, website development, organic search (SEO), AI integration and marketing.
      </p>
      <p>
        The content on the Site — including articles, guides, service descriptions and the portfolio
        — is provided for general information only. It does not constitute a binding offer, an
        engagement contract or a promise of any particular result. Any commercial engagement for
        services with the Company will be made under a separate, specific agreement signed with the
        client.
      </p>

      <h2>3. Intellectual property and copyright</h2>
      <p>
        All intellectual property rights in the Site — including its design, source code, text,
        images, illustrations, videos, logos, trademarks, graphical elements and the portfolio
        presented on it — are the exclusive property of AITERRA, or of third parties who have
        permitted the Company to use them, such as clients whose sites appear in the portfolio.
      </p>
      <p>
        No content from the Site may be copied, reproduced, distributed, published, sold, modified
        or used commercially or otherwise without the prior express written consent of the
        Company&apos;s representatives.
      </p>

      <h2>4. Limitation of liability</h2>
      <p>The Site and its content are provided on an &quot;as is&quot; basis.</p>
      <p>
        The Company accepts no liability of any kind, express or implied, as to the completeness,
        currency or accuracy of the information on the Site. The Company will not be liable for any
        damage — direct, indirect, consequential or punitive — caused to a user or to any third
        party as a result of use of the Site, reliance on its content, or inability to use it.
      </p>
      <p>
        The Company does not undertake that the Site will operate without interruption or fault, or
        that it will be immune from unauthorised access, damage, malfunction or failures in
        hardware, software or communication lines.
      </p>

      <h2>5. Use of the Site</h2>
      <p>When using the Site, the user undertakes not to do the following:</p>
      <ul>
        <li>
          Operate automated means (such as crawlers, bots or scrapers) in order to copy content from
          the Site.
        </li>
        <li>
          Harm or attempt to harm the security of the Site, the servers on which it is hosted, or
          the Company&apos;s information systems.
        </li>
        <li>
          Use the Site for unlawful or harassing purposes, or for purposes intended to harm third
          parties.
        </li>
      </ul>
      <p>
        The Company reserves the right to block access for any user who breaches these terms,
        without prior notice, and to take legal action against them.
      </p>

      <h2>6. Links to external sites</h2>
      <p>
        The Site may include links to external sites or sources that are not owned or controlled by
        the Company. These links are provided for the user&apos;s convenience only. The Company
        accepts no responsibility for the content, reliability or privacy policy of those external
        sites. Accessing them is done at the user&apos;s own risk.
      </p>

      <h2>7. Privacy policy</h2>
      <p>
        The Company respects the privacy of users of the Site. How information is collected, stored
        and used is set out in detail in the{' '}
        <a href="/en/privacy-policy">privacy policy</a> published on the Site, which forms an
        integral part of these Terms.
      </p>

      <h2>8. Changes to the Site and to these Terms</h2>
      <p>
        The Company may, at its sole discretion and at any time, make changes to the Site, remove or
        add content, and amend these terms of use, without prior notice. The updated terms take
        effect from the moment they are published on the Site.
      </p>

      <h2>9. Governing law and jurisdiction</h2>
      <p>
        These Terms and the use of the Site are governed exclusively by the laws of the State of
        Israel. Exclusive jurisdiction over any matter or dispute arising from use of the Site or
        relating to these Terms is granted to the competent courts of the Tel Aviv-Yafo district
        only.
      </p>

      <h2>10. Contact</h2>
      <p>
        For any question, clarification or problem relating to the Site and its terms of use, you
        can contact us by email at{' '}
        <a href={`mailto:${TERMS_EMAIL}`} dir="ltr">
          {TERMS_EMAIL}
        </a>
        .
      </p>
    </>
  )
}
