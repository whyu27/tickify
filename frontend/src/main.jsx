import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { Web3Provider } from './context/Web3Context'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Web3Provider>
      <App />
    </Web3Provider>
  </AuthProvider>,
)
