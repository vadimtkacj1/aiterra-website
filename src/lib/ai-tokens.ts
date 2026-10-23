export type ProviderId = 'openai' | 'anthropic' | 'google'

export type ApiModel = {
  id: string
  provider: ProviderId
  name: string
  inputUsd: number
  outputUsd: number
  note?: string
  longContext?: { above: number; inputUsd: number; outputUsd: number }
}

export type TokenEstimate = {
  tokens: number
  hebrewWords: number
  latinWords: number
  digits: number
  symbols: number
  characters: number
  hebrewShare: number
}

export type RequestCost = {
  model: ApiModel
  inputTokens: number
  outputTokens: number
  usdPerRequest: number
  usdPerMonth: number
  ilsPerMonth: number
  longContext: boolean
}

export const API_PRICES_AS_OF = '2026-10-23'

export const ESTIMATOR = {
  encoding: 'o200k_base',
  tiktokenVersion: '0.12.0',
  samples: 1240,
  hebrewWord: 0.131,
  hebrewLetter: 0.411,
  latinWord: 0.934,
  latinLetter: 0.024,
  digitGroup: 1.24,
  symbol: 0.675,
  meanError: 0.04,
  hebrewMeanError: 0.062,
  englishMeanError: 0.023,
}

export const HEBREW_TO_ENGLISH_RATIO = 1.286

export const TOKENS_PER_HEBREW_WORD = 2.07

export const MAX_TEXT_CHARS = 200_000

export const MAX_MONTHLY_REQUESTS = 100_000_000

export const MAX_ANSWER_WORDS = 50_000

export const providers: Record<ProviderId, { name: string; href: string; label: string }> = {
  openai: {
    name: 'OpenAI',
    href: 'https://developers.openai.com/api/docs/pricing',
    label: 'OpenAI API: Pricing',
  },
  anthropic: {
    name: 'Anthropic',
    href: 'https://platform.claude.com/docs/en/about-claude/pricing',
    label: 'Anthropic: Claude API pricing',
  },
  google: {
    name: 'Google',
    href: 'https://ai.google.dev/gemini-api/docs/pricing',
    label: 'Google AI for Developers: Gemini API pricing',
  },
}

export const apiModels: ApiModel[] = [
  { id: 'gpt-6-astra', provider: 'openai', name: 'GPT-6 Astra', inputUsd: 10, outputUsd: 50 },
  { id: 'gpt-6.1-sol', provider: 'openai', name: 'GPT-6.1 Sol', inputUsd: 2, outputUsd: 10 },
  { id: 'gpt-6-luna', provider: 'openai', name: 'GPT-6 Luna', inputUsd: 0.1, outputUsd: 0.5 },
  { id: 'gpt-5.4', provider: 'openai', name: 'GPT-5.4', inputUsd: 2.5, outputUsd: 15 },
  { id: 'gpt-5.4-mini', provider: 'openai', name: 'GPT-5.4 mini', inputUsd: 0.75, outputUsd: 4.5 },
  { id: 'claude-fable-5.1', provider: 'anthropic', name: 'Claude Fable 5.1', inputUsd: 10, outputUsd: 50 },
  { id: 'claude-opus-5.5', provider: 'anthropic', name: 'Claude Opus 5.5', inputUsd: 4, outputUsd: 20 },
  { id: 'claude-sonnet-5.5', provider: 'anthropic', name: 'Claude Sonnet 5.5', inputUsd: 2, outputUsd: 10 },
  {
    id: 'claude-haiku-5.5',
    provider: 'anthropic',
    name: 'Claude Haiku 5.5',
    inputUsd: 0.1,
    outputUsd: 0.5,
    longContext: { above: 100_000, inputUsd: 0.5, outputUsd: 2.5 },
  },
  {
    id: 'gemini-4-argon',
    provider: 'google',
    name: 'Gemini 4 Argon',
    inputUsd: 2,
    outputUsd: 10,
    note: 'עד 30.11.2026. מ-1.12.2026: ‎$4 ו-‎$20',
  },
  {
    id: 'gemini-3.1-pro-preview',
    provider: 'google',
    name: 'Gemini 3.1 Pro Preview',
    inputUsd: 2,
    outputUsd: 12,
    longContext: { above: 200_000, inputUsd: 4, outputUsd: 18 },
  },
  {
    id: 'gemini-3.8-flash',
    provider: 'google',
    name: 'Gemini 3.8 Flash',
    inputUsd: 0.75,
    outputUsd: 3.75,
    note: 'עד 31.12.2026. מ-1.1.2027: ‎$1.50 ו-‎$7.50',
  },
  { id: 'gemini-3.5-flash-lite', provider: 'google', name: 'Gemini 3.5 Flash-Lite', inputUsd: 0.3, outputUsd: 2.5 },
]

export const modelOf = (id: string) => apiModels.find((model) => model.id === id) ?? apiModels[0]

const HEBREW_RUN = /[֐-׿]+/g
const LATIN_RUN = /[A-Za-z]+/g
const DIGIT_RUN = /[0-9]+/g
const SYMBOL = /[^\s֐-׿A-Za-z0-9]/gu

const runs = (text: string, pattern: RegExp) => text.match(pattern) ?? []

export function estimateTokens(text: string): TokenEstimate {
  const hebrew = runs(text, HEBREW_RUN)
  const latin = runs(text, LATIN_RUN)
  const digitRuns = runs(text, DIGIT_RUN)
  const symbols = runs(text, SYMBOL).length
  const hebrewLetters = hebrew.reduce((sum, word) => sum + word.length, 0)
  const latinLetters = latin.reduce((sum, word) => sum + word.length, 0)
  const digitGroups = digitRuns.reduce((sum, run) => sum + Math.ceil(run.length / 3), 0)
  const raw =
    hebrew.length * ESTIMATOR.hebrewWord +
    hebrewLetters * ESTIMATOR.hebrewLetter +
    latin.length * ESTIMATOR.latinWord +
    latinLetters * ESTIMATOR.latinLetter +
    digitGroups * ESTIMATOR.digitGroup +
    symbols * ESTIMATOR.symbol
  const letters = hebrewLetters + latinLetters
  return {
    tokens: text.trim() ? Math.max(1, Math.round(raw)) : 0,
    hebrewWords: hebrew.length,
    latinWords: latin.length,
    digits: digitRuns.reduce((sum, run) => sum + run.length, 0),
    symbols,
    characters: [...text].length,
    hebrewShare: letters ? hebrewLetters / letters : 0,
  }
}

export function englishEquivalent(estimate: TokenEstimate, text: string) {
  const hebrewOnly = estimateTokens(text.replace(/[^֐-׿\s]/g, ' ')).tokens
  const rest = Math.max(0, estimate.tokens - hebrewOnly)
  return Math.round(hebrewOnly / HEBREW_TO_ENGLISH_RATIO + rest)
}

export const answerTokens = (hebrewWords: number) => Math.round(hebrewWords * TOKENS_PER_HEBREW_WORD)

export function requestCost(
  model: ApiModel,
  inputTokens: number,
  outputTokens: number,
  requestsPerMonth: number,
  usdIls: number,
): RequestCost {
  const longContext = Boolean(model.longContext && inputTokens > model.longContext.above)
  const inputUsd = longContext && model.longContext ? model.longContext.inputUsd : model.inputUsd
  const outputUsd = longContext && model.longContext ? model.longContext.outputUsd : model.outputUsd
  const usdPerRequest = (inputTokens * inputUsd + outputTokens * outputUsd) / 1_000_000
  const usdPerMonth = usdPerRequest * requestsPerMonth
  return {
    model,
    inputTokens,
    outputTokens,
    usdPerRequest,
    usdPerMonth,
    ilsPerMonth: usdPerMonth * usdIls,
    longContext,
  }
}

const countFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 })
const priceFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const ilsFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const ilsWholeFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 })

export const formatTokens = (count: number) => countFormat.format(count)

export const formatPerMillion = (usd: number) => priceFormat.format(usd)

export function formatSmallUsd(usd: number) {
  if (usd === 0) return '$0'
  if (usd >= 1) return priceFormat.format(usd)
  const digits = Math.min(6, Math.max(2, 1 - Math.floor(Math.log10(usd)) + 1))
  return `$${usd.toFixed(digits).replace(/0+$/, '').replace(/\.$/, '')}`
}

export const formatIlsAmount = (ils: number) =>
  ils >= 1000 ? `${ilsWholeFormat.format(ils)} ₪` : `${ilsFormat.format(ils)} ₪`
