import type { PokemonApiListResponse, PokemonDetail, PokemonListItem } from '../types/pokemon'

const BASE_URL = 'https://pokeapi.co/api/v2'
const SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

function extractIdFromUrl(url: string): number {
  const parts = url.replace(/\/$/, '').split('/')
  return parseInt(parts[parts.length - 1], 10)
}

export async function fetchPokemonList(
  limit: number = 20,
  offset: number = 0,
): Promise<{ items: PokemonListItem[]; total: number }> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon list: ${response.status}`)
  }

  const data: PokemonApiListResponse = await response.json()

  const items: PokemonListItem[] = data.results.map((result) => {
    const id = extractIdFromUrl(result.url)
    return {
      name: result.name,
      id,
      spriteUrl: `${SPRITE_URL}/${id}.png`,
    }
  })

  return { items, total: data.count }
}

export async function fetchAllPokemonNames(): Promise<PokemonListItem[]> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=1500&offset=0`)

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon names: ${response.status}`)
  }

  const data: PokemonApiListResponse = await response.json()

  return data.results.map((result) => {
    const id = extractIdFromUrl(result.url)
    return {
      name: result.name,
      id,
      spriteUrl: `${SPRITE_URL}/${id}.png`,
    }
  })
}

export async function fetchPokemonDetail(id: number | string): Promise<PokemonDetail> {
  const response = await fetch(`${BASE_URL}/pokemon/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon #${id}: ${response.status}`)
  }

  return response.json()
}
