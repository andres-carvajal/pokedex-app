import { Card, CardContent, Typography, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getTypeColor } from '../utils/typeColors'
import PokemonImage from './PokemonImage'

interface PokemonCardProps {
  id: number
  name: string
  spriteUrl: string
  types?: string[]
}

export default function PokemonCard({ id, name, spriteUrl, types }: PokemonCardProps) {
  const navigate = useNavigate()

  return (
    <Card
      onClick={() => navigate(`/pokemon/${id}`)}
      sx={{
        cursor: 'pointer',
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          top: 8,
          right: 12,
          color: 'text.secondary',
          fontWeight: 700,
          fontSize: '0.85rem',
        }}
      >
        #{String(id).padStart(3, '0')}
      </Typography>
      <PokemonImage
        src={spriteUrl}
        alt={name}
        width={96}
        height={96}
        pixelated
        sx={{ mx: 'auto', mt: 2 }}
      />
      <CardContent sx={{ flexGrow: 1, pt: 1 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
          {name}
        </Typography>
        {types && types.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', mt: 0.5, flexWrap: 'wrap' }}>
            {types.map((type) => (
              <Box
                key={type}
                component="span"
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#fff',
                  backgroundColor: getTypeColor(type),
                  textTransform: 'capitalize',
                }}
              >
                {type}
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
