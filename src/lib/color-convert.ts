export type Rgb = { r: number; g: number; b: number }
export type Hsl = { h: number; s: number; l: number }

export const COLOR_REVIEWED = '2026-10-23'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const parseHex = (input: string): Rgb | null => {
  const clean = input.trim().replace(/^#/, '')
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(clean)) return null
  const full = clean.length === 3 ? [...clean].map((char) => char + char).join('') : clean
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

export const toHex = ({ r, g, b }: Rgb): string =>
  `#${[r, g, b].map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0')).join('')}`.toUpperCase()

export const parseChannel = (input: string, max: number): number | null => {
  const clean = input.trim()
  if (!/^\d{1,3}$/.test(clean)) return null
  const value = Number(clean)
  return value <= max ? value : null
}

export const rgbToHsl = ({ r, g, b }: Rgb): Hsl => {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  const lightness = (max + min) / 2
  if (delta === 0) return { h: 0, s: 0, l: Math.round(lightness * 100) }
  const saturation = delta / (1 - Math.abs(2 * lightness - 1))
  let hue: number
  if (max === red) hue = ((green - blue) / delta) % 6
  else if (max === green) hue = (blue - red) / delta + 2
  else hue = (red - green) / delta + 4
  return {
    h: Math.round(((hue * 60) % 360 + 360) % 360) % 360,
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  }
}

export const hslToRgb = ({ h, s, l }: Hsl): Rgb => {
  const saturation = s / 100
  const lightness = l / 100
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  const sector = (h % 360) / 60
  const second = chroma * (1 - Math.abs((sector % 2) - 1))
  const table: [number, number, number][] = [
    [chroma, second, 0],
    [second, chroma, 0],
    [0, chroma, second],
    [0, second, chroma],
    [second, 0, chroma],
    [chroma, 0, second],
  ]
  const [red, green, blue] = table[Math.floor(sector) % 6]
  const offset = lightness - chroma / 2
  const channel = (value: number) => Math.round((value + offset) * 255)
  return { r: channel(red), g: channel(green), b: channel(blue) }
}

const linear = (channel: number) => {
  const value = channel / 255
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

export const relativeLuminance = ({ r, g, b }: Rgb): number =>
  0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)

export const contrastRatio = (first: Rgb, second: Rgb): number => {
  const a = relativeLuminance(first)
  const b = relativeLuminance(second)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

export const WHITE: Rgb = { r: 255, g: 255, b: 255 }
export const BLACK: Rgb = { r: 0, g: 0, b: 0 }

export type ContrastLevels = { normalAA: boolean; largeAA: boolean; normalAAA: boolean; largeAAA: boolean }

export const levelsFor = (ratio: number): ContrastLevels => ({
  normalAA: ratio >= 4.5,
  largeAA: ratio >= 3,
  normalAAA: ratio >= 7,
  largeAAA: ratio >= 4.5,
})

export const formatRatio = (ratio: number): string => `${(Math.floor(ratio * 100) / 100).toFixed(2)}:1`

export const cssRgb = ({ r, g, b }: Rgb): string => `rgb(${r}, ${g}, ${b})`

export const cssHsl = ({ h, s, l }: Hsl): string => `hsl(${h}, ${s}%, ${l}%)`
