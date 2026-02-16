import { AppBar, Toolbar, Typography, Button, Badge, Box } from '@mui/material'
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCaughtPokemon } from '../context/CaughtPokemonContext'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { caughtPokemon } = useCaughtPokemon()

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexGrow: 1 }}
          onClick={() => navigate('/')}
        >
          <CatchingPokemonIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" component="div">
            Pokédex
          </Typography>
        </Box>

        <Button
          color="inherit"
          onClick={() => navigate('/')}
          sx={{
            fontWeight: location.pathname === '/' ? 700 : 400,
            borderBottom: location.pathname === '/' ? '2px solid white' : 'none',
            borderRadius: 0,
            mx: 1,
          }}
        >
          All Pokémon
        </Button>

        <Button
          color="inherit"
          onClick={() => navigate('/collection')}
          startIcon={
            <Badge badgeContent={caughtPokemon.length} color="secondary" max={999}>
              <FavoriteIcon />
            </Badge>
          }
          sx={{
            fontWeight: location.pathname === '/collection' ? 700 : 400,
            borderBottom: location.pathname === '/collection' ? '2px solid white' : 'none',
            borderRadius: 0,
            mx: 1,
          }}
        >
          My Collection
        </Button>
      </Toolbar>
    </AppBar>
  )
}
