// Фабрика объектов Metadata для каждой страницы
import type { Metadata } from 'next'

export function buildMetadata(overrides: Partial<Metadata>): Metadata {
  return {
    metadataBase: new URL('https://aiterra.com'),
    ...overrides,
  }
}
