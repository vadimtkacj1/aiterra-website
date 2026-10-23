export const statusNamesEn: Record<string, { name: string; text: string }> = {
  'פעילה': {
    name: 'Active',
    text: 'The company is registered as active: it has not been struck off, dissolved or put into liquidation. That does not mean it actually does business.',
  },
  'פעילה זמנית': {
    name: 'Temporarily active',
    text: 'A company that was struck off or dissolved and restored to the register, for example by court order to complete a specific action. The status signals that it is not meant to carry on normal business.',
  },
  'פעילה/בפירוק - הליך פשרה או הסדר/פירוק זמני': {
    name: 'Active/in liquidation: compromise, arrangement or provisional liquidation',
    text: 'The company is in a compromise or arrangement with creditors or shareholders, or a provisional liquidator was appointed. Find out where the process stands before working with it.',
  },
  'פעילה/בפירוק - בכינוס נכסים': {
    name: 'Active/in liquidation: in receivership',
    text: 'A receiver was appointed who manages or sells the company\'s assets to pay creditors.',
  },
  'בפרוק מרצון': {
    name: 'In voluntary liquidation',
    text: 'The shareholders decided to close the company, and the directors declared it can pay all its debts. A trustee sells the assets, pays creditors and distributes the rest, and the company no longer carries on normal business.',
  },
  'בפרוק ע״י בימ״ש': {
    name: 'In liquidation by court',
    text: 'A court ordered the company wound up and appointed a trustee to run the liquidation, for example because it cannot pay its debts. Anyone the company owes money files a proof of debt with the trustee.',
  },
  'מחוקה': {
    name: 'Struck off',
    text: 'The Registrar struck the company off the register, for example after years without the annual fee and annual report. A struck-off company counts as dissolved. Cancelling the strike-off can be requested from the Registrar within a year, or from a court after that.',
  },
  'מחוסלת מרצון': {
    name: 'Dissolved (voluntary liquidation)',
    text: 'The voluntary liquidation ended and the Registrar recorded the company as dissolved. The company no longer exists.',
  },
  'חיסול ע״י בימ״ש': {
    name: 'Dissolved by court',
    text: 'The court liquidation ended and the court ordered the company dissolved. The company no longer exists.',
  },
  'מחוסלת עקב מיזוג': {
    name: 'Dissolved by merger',
    text: 'The company merged into another company. Its assets and debts passed to the absorbing company, and it was dissolved and removed from the register.',
  },
  'נגרעה מהמרשם': {
    name: 'Removed from the register',
    text: 'A foreign company removed from the register of foreign companies in Israel. It is no longer registered here as a company with a place of business in Israel, but it may still exist in the country where it was incorporated.',
  },
}
