import { describe, it, expect } from 'vitest'
import { getTypeColor } from '../typeColors'

describe('getTypeColor', () => {
  it('returns the correct color for known types', () => {
    expect(getTypeColor('fire')).toBe('#F08030')
    expect(getTypeColor('water')).toBe('#6890F0')
    expect(getTypeColor('grass')).toBe('#78C850')
    expect(getTypeColor('electric')).toBe('#F8D030')
  })

  it('is case-insensitive', () => {
    expect(getTypeColor('Fire')).toBe('#F08030')
    expect(getTypeColor('WATER')).toBe('#6890F0')
  })

  it('returns a fallback color for unknown types', () => {
    expect(getTypeColor('unknown')).toBe('#68A090')
    expect(getTypeColor('')).toBe('#68A090')
  })
})
