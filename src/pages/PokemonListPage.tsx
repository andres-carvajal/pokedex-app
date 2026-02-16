import { useState, useMemo } from 'react'
import { Box, Container, Grid, Typography, Button, CircularProgress, Alert } from '@mui/material'
import { usePokemonList, useAllPokemonNames } from '../api/hooks'
import PokemonCard from '../components/PokemonCard'
import PokemonCardSkeleton from '../components/PokemonCardSkeleton'
import SearchBar from '../components/SearchBar'

export default function PokemonListPage() {
  const [search, setSearch] = useState('')
  const { data: allNames, isLoading: isLoadingNames } = useAllPokemonNames()
  const {
    data: paginatedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPaginated,
    isError,
    error,
  } = usePokemonList()

  const isSearching = search.trim().length > 0

  const filteredBySearch = useMemo(() => {
    if (!isSearching || !allNames) return []
    const query = search.trim().toLowerCase()
    return allNames.filter((p) => p.name.toLowerCase().includes(query))
  }, [search, allNames, isSearching])

  const paginatedItems = useMemo(() => {
    if (!paginatedData) return []
    return paginatedData.pages.flatMap((page) => page.items)
  }, [paginatedData])

  const displayItems = isSearching ? filteredBySearch : paginatedItems
  const isLoading = isSearching ? isLoadingNames : isLoadingPaginated

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
        Pokédex
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <SearchBar value={search} onChange={setSearch} />
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error instanceof Error ? error.message : 'Failed to load Pokémon. Please try again.'}
        </Alert>
      )}

      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={i}>
              <PokemonCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : displayItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {isSearching
              ? `No Pokémon found matching "${search}"`
              : 'No Pokémon loaded yet.'}
          </Typography>
        </Box>
      ) : (
        <>
          {isSearching && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
              Found {filteredBySearch.length} Pokémon matching &quot;{search}&quot;
            </Typography>
          )}

          <Grid container spacing={2}>
            {displayItems.map((pokemon) => (
              <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={pokemon.id}>
                <PokemonCard
                  id={pokemon.id}
                  name={pokemon.name}
                  spriteUrl={pokemon.spriteUrl}
                />
              </Grid>
            ))}
          </Grid>

          {!isSearching && hasNextPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                sx={{ minWidth: 200 }}
              >
                {isFetchingNextPage ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Load More'
                )}
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  )
}
