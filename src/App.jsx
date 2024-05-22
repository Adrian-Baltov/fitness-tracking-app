import Authenticated from './hoc/Authenticated'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import {
  useExercise,
  useGoal,
  useUser,
  useAuth
} from './context'
import UserProfile from './components/userProfile/UserProfile'
import { useNavigate } from 'react-router-dom'
import AuthPage from './views/AuthPage'
import { Header, NavBar } from './components'
import styles from './App.module.css'



function App() {

  const navData = [
    { title: 'Home', route: '/' },
    { title: 'Dashboard', route: '/dashboard' },
    { title: 'Exercises', route: '/exercises' },
    { title: 'Goals', route: '/goals' },
    { title: 'Logout', route: '/' },
  ];
  const { fetchExercises, exercises } = useExercise()
  const { appContainer, container, navBarContainer, content } = styles
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { userData } = useUser();

  return (
    <>
      <div className={appContainer}>
        <Header />
        <div className={container}>
          <div className={navBarContainer}>

            <NavBar items={navData} logout={logout} />
          </div>
          <div className={content}></div>

          <Routes>
            <Route path='/' element={<div>Home<div className="card-actions justify-end">
              {!user ? <button onClick={() => navigate('/auth')}>Go to Auth</button> : <><p>Welcome: {userData?.username}</p><button onClick={() => navigate('/user-profile')}>Go to User Profile</button><button onClick={logout}>Logout</button></>}
            </div></div>} />
            <Route path='/user-profile' element={<Authenticated><UserProfile /></Authenticated>} />
            <Route path='/auth' element={<AuthPage />} />
            <Route path='/dashboard' element={<div>Dashboard</div>} />
            <Route path='/exercises' element={<div>Exercises</div>} />
            <Route path='/goals' element={<div>Goals</div>} />
            <Route path='/' element={<div>Home</div>} />
          </Routes>
        </div>
      </div>

    </>

  )
}

export default App
