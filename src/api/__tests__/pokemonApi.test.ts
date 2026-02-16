import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchPokemonList, fetchPokemonDetail, fetchAllPokemonNames } from '../pokemonApi'

const mockListResponse = {
  count: 1350,
  next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ],
}

const mockDetailResponse = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  types: [{ slot: 1, type: { name: 'electric', url: '' } }],
  abilities: [{ ability: { name: 'static', url: '' }, is_hidden: false, slot: 1 }],
  stats: [{ base_stat: 35, effort: 0, stat: { name: 'hp', url: '' } }],
  sprites: {
    front_default: 'https://example.com/25.png',
    other: { 'official-artwork': { front_default: 'https://example.com/25-art.png' } },
  },
}

describe('pokemonApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchPokemonList', () => {
    it('fetches and transforms the Pokemon list', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockListResponse,
      } as Response)

      const result = await fetchPokemonList(20, 0)

      expect(result.total).toBe(1350)
      expect(result.items).toHaveLength(2)
      expect(result.items[0]).toEqual({
        name: 'bulbasaur',
        id: 1,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      })
      expect(result.items[1].id).toBe(2)
    })

    it('throws on non-OK response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await expect(fetchPokemonList()).rejects.toThrow('Failed to fetch')
    })
  })

  describe('fetchPokemonDetail', () => {
    it('fetches Pokemon detail by id', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockDetailResponse,
      } as Response)

      const result = await fetchPokemonDetail(25)

      expect(result.name).toBe('pikachu')
      expect(result.id).toBe(25)
      expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25')
    })
  })

  describe('fetchAllPokemonNames', () => {
    it('fetches all Pokemon names with correct limit', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockListResponse,
      } as Response)

      const result = await fetchAllPokemonNames()

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('bulbasaur')
      expect(fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=1500&offset=0',
      )
    })
  })
})
