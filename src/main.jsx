import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvder, UserProvider, ExerciseProvider, GoalProvider } from './context'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvder>
        <UserProvider>
          <ExerciseProvider>
            <GoalProvider>
              <App />
            </GoalProvider>
          </ExerciseProvider>
        </UserProvider>
      </AuthProvder>
    </BrowserRouter>
  </React.StrictMode>,
)
