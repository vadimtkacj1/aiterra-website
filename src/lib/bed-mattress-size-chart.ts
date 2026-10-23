export type BedSize = {
  id: string
  name: string
  widthCm: number
  lengthCm: number
  options: string
  eu: string
  us: string
  uk: string
}

export const BED_REVIEWED = '2026-10-23'
export const DEFAULT_WALKWAY_CM = 70
export const DEFAULT_FRAME_CM = 5
export const DEFAULT_MATTRESS_HEIGHT_CM = 25
export const SHEET_POCKET_EXTRA_CM = 5
export const MAX_ROOM_CM = 2000

export const bedSizes: BedSize[] = [
  {
    id: 'single',
    name: 'יחיד',
    widthCm: 90,
    lengthCm: 190,
    options: '80×190, 90×190, 90×200',
    eu: 'יחיד 90×200',
    us: 'Twin 98×189',
    uk: 'Single 91×191',
  },
  {
    id: 'one-and-half',
    name: 'מיטה וחצי',
    widthCm: 120,
    lengthCm: 190,
    options: '120×190, 120×200',
    eu: 'יחיד רחב 120×200',
    us: 'אין מידה קרובה',
    uk: 'Small double 122×191',
  },
  {
    id: 'double',
    name: 'זוגית',
    widthCm: 140,
    lengthCm: 190,
    options: '140×190, 140×200',
    eu: 'אין מידה קרובה',
    us: 'Full 136×189',
    uk: 'Double 137×191',
  },
  {
    id: 'wide-double',
    name: 'זוגית רחבה',
    widthCm: 160,
    lengthCm: 200,
    options: '160×200',
    eu: 'זוגית 160×200',
    us: 'Queen 152×202',
    uk: 'King 152×198',
  },
  {
    id: 'king',
    name: 'קינג',
    widthCm: 180,
    lengthCm: 200,
    options: '180×200',
    eu: 'זוגית 180×200',
    us: 'California King 183×212',
    uk: 'Super king 183×198',
  },
  {
    id: 'king-wide',
    name: 'קינג רחב',
    widthCm: 200,
    lengthCm: 200,
    options: '200×200',
    eu: 'זוגית 200×200',
    us: 'King 193×202',
    uk: 'אין מידה קרובה',
  },
]

export const findBed = (id: string): BedSize => bedSizes.find((bed) => bed.id === id) ?? bedSizes[2]

export const parseCm = (value: string): number | null => {
  const clean = value.trim().replace(',', '.')
  if (!/^\d+(\.\d+)?$/.test(clean)) return null
  const parsed = Number(clean)
  return Number.isFinite(parsed) ? parsed : null
}

export const cmError = (value: string, min: number, max: number): string => {
  if (!value.trim()) return ''
  const parsed = parseCm(value)
  if (parsed === null) return 'הקלידו מספר, למשל 250.'
  if (parsed < min || parsed > max) return `הקלידו מספר בין ${min} ל-${max}.`
  return ''
}

export const pocketDepthCm = (mattressHeightCm: number): number => mattressHeightCm + SHEET_POCKET_EXTRA_CM

export type RoomCheck = {
  fits: boolean
  neededWidthCm: number
  neededLengthCm: number
  rotated: boolean
}

export type RoomInput = {
  widthCm: number
  lengthCm: number
  walkwayCm: number
  frameCm: number
  bothSides: boolean
}

export const checkRoom = (room: RoomInput, bed: BedSize): RoomCheck => {
  const bedWidth = bed.widthCm + 2 * room.frameCm
  const bedLength = bed.lengthCm + 2 * room.frameCm
  const sides = room.bothSides ? 2 : 1
  const neededWidthCm = bedWidth + sides * room.walkwayCm
  const neededLengthCm = bedLength + room.walkwayCm
  const straight = room.widthCm >= neededWidthCm && room.lengthCm >= neededLengthCm
  const rotated = room.lengthCm >= neededWidthCm && room.widthCm >= neededLengthCm
  return { fits: straight || rotated, neededWidthCm, neededLengthCm, rotated: !straight && rotated }
}
