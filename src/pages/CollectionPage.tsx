import { Container, Typography, Grid, Box, Button } from '@mui/material'
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon'
import { useNavigate } from 'react-router-dom'
import { useCaughtPokemon } from '../context/CaughtPokemonContext'
import PokemonCard from '../components/PokemonCard'

export default function CollectionPage() {
  const { caughtPokemon } = useCaughtPokemon()
  const navigate = useNavigate()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 1 }}>
        My Collection
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
        {caughtPokemon.length === 0
          ? "You haven't caught any Pokémon yet!"
          : `${caughtPokemon.length} Pokémon caught`}
      </Typography>

      {caughtPokemon.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CatchingPokemonIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your collection is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Go explore the Pokédex and catch some Pokémon!
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Browse Pokédex
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {caughtPokemon.map((pokemon) => (
            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={pokemon.id}>
              <PokemonCard
                id={pokemon.id}
                name={pokemon.name}
                spriteUrl={pokemon.spriteUrl}
                types={pokemon.types}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}
