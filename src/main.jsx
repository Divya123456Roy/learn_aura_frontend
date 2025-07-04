import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import { store } from './redux/Store.js'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()



createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <Provider store={store}>
    <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
    </Provider>
  </StrictMode>
)


