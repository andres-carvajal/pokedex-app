import { useState } from 'react'
import { Box, type SxProps, type Theme } from '@mui/material'
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon'

interface PokemonImageProps {
  src: string | null | undefined
  alt: string
  width: number | Record<string, number>
  height: number | Record<string, number>
  pixelated?: boolean
  sx?: SxProps<Theme>
}

export default function PokemonImage({ src, alt, width, height, pixelated = false, sx }: PokemonImageProps) {
  const [hasError, setHasError] = useState(false)

  const showPlaceholder = hasError || !src

  return (
    <Box
      sx={[
        {
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {showPlaceholder ? (
        <CatchingPokemonIcon
          sx={{
            fontSize: typeof width === 'number' ? width * 0.6 : 64,
            color: 'grey.300',
          }}
        />
      ) : (
        <Box
          component="img"
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            ...(pixelated && { imageRendering: 'pixelated' }),
          }}
        />
      )}
    </Box>
  )
}
