import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { Web3Provider } from './context/Web3Context'
import { NotificationProvider } from './context/NotificationContext'

createRoot(document.getElementById('root')).render(
  <NotificationProvider>
    <AuthProvider>
      <Web3Provider>
        <App />
      </Web3Provider>
    </AuthProvider>
  </NotificationProvider>,
)
