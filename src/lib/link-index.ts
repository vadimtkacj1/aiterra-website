export const LINK_INDEX_SHARDS = 512
export const LINK_INDEX_UPDATED_LABEL = '02.11.2026'

export type LinkDonor = { domain: string; score: number; follow: boolean }

export type LinkProfile = {
  domain: string
  score: number
  place: number | null
  referring: number
  followReferring: number
  donors: LinkDonor[]
  anchors: string[]
  donorHashes: Set<string>
}

type StoredProfile = {
  a: number
  p: number | null
  r: number
  f: number
  d: [string, number, number][]
  t: string[]
  h?: string
}

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
  }
  return value >>> 0
})

export function crc32(text: string): number {
  let value = 0xffffffff
  for (const byte of new TextEncoder().encode(text)) {
    value = crcTable[(value ^ byte) & 0xff] ^ (value >>> 8)
  }
  return (value ^ 0xffffffff) >>> 0
}

export function rootDomain(input: string): string {
  const host = input
    .trim()
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, '')
    .split(/[/?#]/)[0]
    .replace(/^www\./, '')
  const parts = host.split('.')
  const secondLevel = ['co', 'org', 'ac', 'gov', 'net', 'muni', 'k12', 'idf']
  const keep = parts.length > 2 && secondLevel.includes(parts[parts.length - 2]) ? 3 : 2
  return parts.slice(-keep).join('.')
}

const DONOR_HASH_LENGTH = 8

const donorHash = (domain: string) => crc32(domain).toString(16).padStart(DONOR_HASH_LENGTH, '0')

const splitDonorHashes = (joined = '') =>
  new Set(joined.match(new RegExp(`.{${DONOR_HASH_LENGTH}}`, 'g')) ?? [])

export const isIsraeliDomain = (domain: string) => /^[a-z0-9-]+(\.[a-z0-9-]+)*\.il$/.test(domain)

async function loadShard(number: number): Promise<Record<string, StoredProfile>> {
  const response = await fetch(`/link-index/${number}.json.gz`)
  if (!response.ok || !response.body) throw new Error('shard')
  const stream = response.body.pipeThrough(new DecompressionStream('gzip'))
  return JSON.parse(await new Response(stream).text())
}

export async function loadProfile(domain: string): Promise<LinkProfile | null> {
  const shard = await loadShard(crc32(domain) % LINK_INDEX_SHARDS)
  const stored = shard[domain]
  if (!stored) return null
  return {
    domain,
    score: stored.a,
    place: stored.p,
    referring: stored.r,
    followReferring: stored.f,
    donors: stored.d.map(([name, score, follow]) => ({ domain: name, score, follow: Boolean(follow) })),
    anchors: stored.t,
    donorHashes: splitDonorHashes(stored.h),
  }
}

export function missingDonors(own: LinkProfile | null, rival: LinkProfile): LinkDonor[] {
  const known = new Set(own?.donors.map((donor) => donor.domain))
  const linksToOwn = (domain: string) => known.has(domain) || Boolean(own?.donorHashes.has(donorHash(domain)))
  return rival.donors.filter((donor) => !linksToOwn(donor.domain) && donor.domain !== own?.domain && donor.follow)
}
