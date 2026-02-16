import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CaughtPokemonProvider, useCaughtPokemon } from '../CaughtPokemonContext'
import type { CaughtPokemon } from '../../types/pokemon'

const mockPokemon: CaughtPokemon = {
  id: 25,
  name: 'pikachu',
  spriteUrl: 'https://example.com/25.png',
  types: ['electric'],
}

const mockPokemon2: CaughtPokemon = {
  id: 1,
  name: 'bulbasaur',
  spriteUrl: 'https://example.com/1.png',
  types: ['grass', 'poison'],
}

function TestComponent() {
  const { caughtPokemon, catchPokemon, releasePokemon, isCaught } = useCaughtPokemon()

  return (
    <div>
      <span data-testid="count">{caughtPokemon.length}</span>
      <span data-testid="is-caught-25">{isCaught(25).toString()}</span>
      <span data-testid="is-caught-1">{isCaught(1).toString()}</span>
      <button onClick={() => catchPokemon(mockPokemon)}>Catch Pikachu</button>
      <button onClick={() => catchPokemon(mockPokemon2)}>Catch Bulbasaur</button>
      <button onClick={() => releasePokemon(25)}>Release Pikachu</button>
      <ul>
        {caughtPokemon.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  )
}

describe('CaughtPokemonContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with an empty collection', () => {
    render(
      <CaughtPokemonProvider>
        <TestComponent />
      </CaughtPokemonProvider>,
    )

    expect(screen.getByTestId('count')).toHaveTextContent('0')
    expect(screen.getByTestId('is-caught-25')).toHaveTextContent('false')
  })

  it('catches a Pokemon and updates the collection', async () => {
    const user = userEvent.setup()

    render(
      <CaughtPokemonProvider>
        <TestComponent />
      </CaughtPokemonProvider>,
    )

    await user.click(screen.getByText('Catch Pikachu'))

    expect(screen.getByTestId('count')).toHaveTextContent('1')
    expect(screen.getByTestId('is-caught-25')).toHaveTextContent('true')
    expect(screen.getByText('pikachu')).toBeInTheDocument()
  })

  it('does not duplicate a Pokemon if caught twice', async () => {
    const user = userEvent.setup()

    render(
      <CaughtPokemonProvider>
        <TestComponent />
      </CaughtPokemonProvider>,
    )

    await user.click(screen.getByText('Catch Pikachu'))
    await user.click(screen.getByText('Catch Pikachu'))

    expect(screen.getByTestId('count')).toHaveTextContent('1')
  })

  it('releases a Pokemon from the collection', async () => {
    const user = userEvent.setup()

    render(
      <CaughtPokemonProvider>
        <TestComponent />
      </CaughtPokemonProvider>,
    )

    await user.click(screen.getByText('Catch Pikachu'))
    expect(screen.getByTestId('count')).toHaveTextContent('1')

    await user.click(screen.getByText('Release Pikachu'))
    expect(screen.getByTestId('count')).toHaveTextContent('0')
    expect(screen.getByTestId('is-caught-25')).toHaveTextContent('false')
  })

  it('can catch multiple Pokemon', async () => {
    const user = userEvent.setup()

    render(
      <CaughtPokemonProvider>
        <TestComponent />
      </CaughtPokemonProvider>,
    )

    await user.click(screen.getByText('Catch Pikachu'))
    await user.click(screen.getByText('Catch Bulbasaur'))

    expect(screen.getByTestId('count')).toHaveTextContent('2')
    expect(screen.getByTestId('is-caught-25')).toHaveTextContent('true')
    expect(screen.getByTestId('is-caught-1')).toHaveTextContent('true')
  })

  it('persists caught Pokemon to localStorage', async () => {
    const user = userEvent.setup()

    render(
      <CaughtPokemonProvider>
        <TestComponent />
      </CaughtPokemonProvider>,
    )

    await user.click(screen.getByText('Catch Pikachu'))

    const stored = JSON.parse(localStorage.getItem('pokedex-caught-pokemon') ?? '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].name).toBe('pikachu')
  })

  it('loads caught Pokemon from localStorage on mount', async () => {
    localStorage.setItem(
      'pokedex-caught-pokemon',
      JSON.stringify([mockPokemon]),
    )

    render(
      <CaughtPokemonProvider>
        <TestComponent />
      </CaughtPokemonProvider>,
    )

    expect(screen.getByTestId('count')).toHaveTextContent('1')
    expect(screen.getByTestId('is-caught-25')).toHaveTextContent('true')
    expect(screen.getByText('pikachu')).toBeInTheDocument()
  })
})
