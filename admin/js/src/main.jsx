import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query'

// Criando o cliente do React Query para gerenciar estados e requisições
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// Verifica se o elemento está disponível na página
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('image-replacer-app')
  
  if (container) {
    ReactDOM.createRoot(container).render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </React.StrictMode>
    )
  }
})