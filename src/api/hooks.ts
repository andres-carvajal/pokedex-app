import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { fetchPokemonList, fetchPokemonDetail, fetchAllPokemonNames } from './pokemonApi'

const PAGE_SIZE = 24

export function usePokemonList() {
  return useInfiniteQuery({
    queryKey: ['pokemon-list'],
    queryFn: ({ pageParam = 0 }) => fetchPokemonList(PAGE_SIZE, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + page.items.length, 0)
      return loaded < lastPage.total ? loaded : undefined
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 10,
  })
}

export function useAllPokemonNames() {
  return useQuery({
    queryKey: ['pokemon-all-names'],
    queryFn: fetchAllPokemonNames,
    staleTime: 1000 * 60 * 30,
  })
}

export function usePokemonDetail(id: number | string) {
  return useQuery({
    queryKey: ['pokemon-detail', id],
    queryFn: () => fetchPokemonDetail(id),
    staleTime: 1000 * 60 * 10,
    enabled: !!id,
  })
}
