import type { MethodId } from '@/lib/gematria'

export const enMethodNames: Record<MethodId, { name: string; short: string; description: string }> = {
  standard: {
    name: 'Standard (mispar hechrachi)',
    short: 'Standard',
    description:
      'The usual gematria: Alef to Tet are 1 to 9, Yod to Tsadi are 10 to 90, Qof to Tav are 100 to 400. Final letters equal their regular forms.',
  },
  gadol: {
    name: 'Mispar gadol (large number)',
    short: 'Gadol',
    description:
      'Like the standard method, but the final letters continue the count: final Kaf 500, final Mem 600, final Nun 700, final Pe 800, final Tsadi 900.',
  },
  katan: {
    name: 'Mispar katan (small number)',
    short: 'Katan',
    description:
      'Drops the zeros from each letter value: Yod is 1, Kaf 2, Qof 1 and Tav 4. Every letter is worth 1 to 9.',
  },
  ordinal: {
    name: 'Ordinal (mispar siduri)',
    short: 'Ordinal',
    description:
      'The position of the letter in the alphabet: Alef 1, Bet 2 and so on up to Tav 22. Final letters take the position of the regular letter.',
  },
  atbash: {
    name: 'Atbash',
    short: 'Atbash',
    description:
      'Swaps each letter with its mirror in the reversed alphabet: Alef with Tav, Bet with Shin, Gimel with Resh, then values the new word in standard gematria.',
  },
  albam: {
    name: 'Albam',
    short: 'Albam',
    description:
      'Splits the alphabet into two halves and swaps them: Alef with Lamed, Bet with Mem, Gimel with Nun, then values the new word in standard gematria.',
  },
}
