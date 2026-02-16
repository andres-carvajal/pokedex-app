import { Card, CardContent, Skeleton, Box } from '@mui/material'

export default function PokemonCardSkeleton() {
  return (
    <Card sx={{ textAlign: 'center', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Skeleton variant="circular" width={96} height={96} />
      </Box>
      <CardContent>
        <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} />
      </CardContent>
    </Card>
  )
}
