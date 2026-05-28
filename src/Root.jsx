import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { PortfolioProvider } from './context/PortfolioContext.jsx'
import AppRouter from './routes/AppRouter.jsx'

export default function Root() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </PortfolioProvider>
    </AuthProvider>
  )
}
