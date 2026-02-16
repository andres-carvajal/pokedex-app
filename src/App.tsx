import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme/theme'
import { CaughtPokemonProvider } from './context/CaughtPokemonContext'
import Navbar from './components/Navbar'
import PokemonListPage from './pages/PokemonListPage'
import PokemonDetailPage from './pages/PokemonDetailPage'
import CollectionPage from './pages/CollectionPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <CaughtPokemonProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<PokemonListPage />} />
              <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
              <Route path="/collection" element={<CollectionPage />} />
            </Routes>
          </CaughtPokemonProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
