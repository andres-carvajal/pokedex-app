import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { CaughtPokemon } from '../types/pokemon'

const STORAGE_KEY = 'pokedex-caught-pokemon'

interface CaughtPokemonContextType {
  caughtPokemon: CaughtPokemon[]
  catchPokemon: (pokemon: CaughtPokemon) => void
  releasePokemon: (id: number) => void
  isCaught: (id: number) => boolean
}

const CaughtPokemonContext = createContext<CaughtPokemonContextType | null>(null)

function loadFromStorage(): CaughtPokemon[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as CaughtPokemon[]
    }
  } catch {
    console.error('Failed to load caught Pokémon from localStorage')
  }
  return []
}

function saveToStorage(pokemon: CaughtPokemon[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pokemon))
  } catch {
    console.error('Failed to save caught Pokémon to localStorage')
  }
}

export function CaughtPokemonProvider({ children }: { children: ReactNode }) {
  const [caughtPokemon, setCaughtPokemon] = useState<CaughtPokemon[]>(loadFromStorage)

  useEffect(() => {
    saveToStorage(caughtPokemon)
  }, [caughtPokemon])

  const catchPokemon = useCallback((pokemon: CaughtPokemon) => {
    setCaughtPokemon((prev) => {
      if (prev.some((p) => p.id === pokemon.id)) return prev
      return [...prev, pokemon]
    })
  }, [])

  const releasePokemon = useCallback((id: number) => {
    setCaughtPokemon((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const isCaught = useCallback(
    (id: number) => caughtPokemon.some((p) => p.id === id),
    [caughtPokemon],
  )

  return (
    <CaughtPokemonContext.Provider value={{ caughtPokemon, catchPokemon, releasePokemon, isCaught }}>
      {children}
    </CaughtPokemonContext.Provider>
  )
}

export function useCaughtPokemon(): CaughtPokemonContextType {
  const context = useContext(CaughtPokemonContext)
  if (!context) {
    throw new Error('useCaughtPokemon must be used within a CaughtPokemonProvider')
  }
  return context
}
