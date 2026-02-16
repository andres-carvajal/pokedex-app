import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  LinearProgress,
  Chip,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon'
import { usePokemonDetail } from '../api/hooks'
import { useCaughtPokemon } from '../context/CaughtPokemonContext'
import TypeChip from '../components/TypeChip'

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

const STAT_COLORS: Record<string, string> = {
  hp: '#ff5252',
  attack: '#ff9800',
  defense: '#2196f3',
  'special-attack': '#9c27b0',
  'special-defense': '#4caf50',
  speed: '#ffc107',
}

export default function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: pokemon, isLoading, isError, error } = usePokemonDetail(id ?? '')
  const { catchPokemon, releasePokemon, isCaught } = useCaughtPokemon()

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={48} />
      </Container>
    )
  }

  if (isError || !pokemon) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          {error instanceof Error ? error.message : 'Failed to load Pokémon details.'}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    )
  }

  const artworkUrl =
    pokemon.sprites.other['official-artwork'].front_default ?? pokemon.sprites.front_default
  const types = pokemon.types.map((t) => t.type.name)
  const caught = isCaught(pokemon.id)

  const handleToggleCatch = () => {
    if (caught) {
      releasePokemon(pokemon.id)
    } else {
      catchPokemon({
        id: pokemon.id,
        name: pokemon.name,
        spriteUrl: pokemon.sprites.front_default ?? '',
        types,
      })
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Back
      </Button>

      <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: { xs: 'center', md: 'flex-start' },
          }}
        >
          {/* Image */}
          <Box
            sx={{
              width: { xs: 200, md: 280 },
              height: { xs: 200, md: 280 },
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.100',
              borderRadius: 3,
            }}
          >
            <Box
              component="img"
              src={artworkUrl ?? undefined}
              alt={pokemon.name}
              sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 2 }}
            />
          </Box>

          {/* Info */}
          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
              <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
                {pokemon.name}
              </Typography>
              <Typography variant="h5" color="text.secondary">
                #{String(pokemon.id).padStart(3, '0')}
              </Typography>
            </Box>

            {/* Types */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              {types.map((type) => (
                <TypeChip key={type} type={type} size="medium" />
              ))}
            </Box>

            {/* Physical */}
            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Height
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {(pokemon.height / 10).toFixed(1)} m
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Weight
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {(pokemon.weight / 10).toFixed(1)} kg
                </Typography>
              </Box>
            </Box>

            {/* Abilities */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Abilities
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {pokemon.abilities.map((a) => (
                  <Chip
                    key={a.ability.name}
                    label={a.ability.name.replace('-', ' ')}
                    variant={a.is_hidden ? 'outlined' : 'filled'}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                ))}
              </Box>
            </Box>

            {/* Catch Button */}
            <Button
              variant={caught ? 'outlined' : 'contained'}
              color={caught ? 'error' : 'primary'}
              size="large"
              startIcon={<CatchingPokemonIcon />}
              onClick={handleToggleCatch}
              sx={{ minWidth: 180 }}
            >
              {caught ? 'Release' : 'Catch!'}
            </Button>
          </Box>
        </Box>

        {/* Stats */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Base Stats
          </Typography>
          {pokemon.stats.map((stat) => (
            <Box key={stat.stat.name} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Typography
                variant="body2"
                sx={{ width: 80, fontWeight: 600, textTransform: 'capitalize' }}
              >
                {STAT_LABELS[stat.stat.name] ?? stat.stat.name}
              </Typography>
              <Typography variant="body2" sx={{ width: 40, textAlign: 'right', mr: 2, fontWeight: 600 }}>
                {stat.base_stat}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((stat.base_stat / 255) * 100, 100)}
                sx={{
                  flexGrow: 1,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: STAT_COLORS[stat.stat.name] ?? 'primary.main',
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  )
}
