import { Route, Routes } from 'react-router-dom'
import {
  useExercise,
  useGoal,
  useUser,
  useAuth
} from './context'
import UserProfile from './components/userProfile/UserProfile'
import GoalsPage from './views/goals/GoalsPage'
import NotFound from './views/NotFound'
import Dashboard from './components/dashboard/Dashboard'
import AuthPage from './views/AuthPage'
import Authenticated from './hoc/Authenticated'
import ExercisePage from './views/exercise/ExercisePage'
import FriendsPage from './views/friendsPage/FriendsPage'
import { useNavigate } from 'react-router-dom'
import { Header, NavBar } from './components'
import { FaHome, FaDumbbell, FaBullseye, FaTachometerAlt, FaUserFriends } from 'react-icons/fa';
import styles from './App.module.css'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

function App() {

  const navData = [
    { title: 'Dashboard', route: '/dashboard', icon: <FaTachometerAlt /> },
    { title: 'Exercises', route: '/exercises', icon: <FaDumbbell /> },
    { title: 'Goals', route: '/goals', icon: <FaBullseye /> },
    { title: 'Search Users', route: '/search/friends', icon: <FaUserFriends /> }
  ];
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { userData } = useUser();
  const { appContainer, container, navBarContainer, content } = styles


  return (
    <>
      <div className={appContainer}>
        <Header />
        <div className={container}>
          <NavBar items={navData} logout={logout} />
          <div className={content}></div>

          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/user-profile' element={<Authenticated><UserProfile /></Authenticated>} />
            <Route path='/auth' element={<AuthPage />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/exercises' element={<Authenticated><ExercisePage /></Authenticated>} />
            <Route path='/search/friends' element={<Authenticated><FriendsPage /></Authenticated>} />
            <Route path='/goals' element={<Authenticated><GoalsPage /></Authenticated>} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </div>

    </>

  )
}

export default App

