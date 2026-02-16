import { Chip } from '@mui/material'
import { getTypeColor } from '../utils/typeColors'

interface TypeChipProps {
  type: string
  size?: 'small' | 'medium'
}

export default function TypeChip({ type, size = 'small' }: TypeChipProps) {
  const bgColor = getTypeColor(type)

  return (
    <Chip
      label={type.charAt(0).toUpperCase() + type.slice(1)}
      size={size}
      sx={{
        backgroundColor: bgColor,
        color: '#fff',
        fontWeight: 600,
        fontSize: size === 'medium' ? '0.875rem' : '0.75rem',
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
      }}
    />
  )
}
