import Authenticated from './hoc/Authenticated'
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
import ExercisePage from './views/exercise/ExercisePage'
import { FaHome, FaDumbbell, FaBullseye, FaTachometerAlt } from 'react-icons/fa';
import FriendsPage from './views/FriendsPage'
import 'primereact/resources/themes/saga-blue/theme.css';  // Theme
import 'primereact/resources/primereact.min.css';          // Core CSS
import 'primeicons/primeicons.css';                        // Icons
import 'primeflex/primeflex.css';
import GoalsPage from './views/goals/GoalsPage'

function App() {

  const navData = [
    { title: 'Home', route: '/', icon: <FaHome /> },
    { title: 'Dashboard', route: '/dashboard', icon: <FaTachometerAlt /> },
    { title: 'Exercises', route: '/exercises', icon: <FaDumbbell /> },
    { title: 'Goals', route: '/goals', icon: <FaBullseye /> },
  ];

  const { appContainer, container, navBarContainer, content } = styles
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { userData } = useUser();

  return (
    <>
      <div className={appContainer}>
        <Header />
        <div className={container}>
          <NavBar items={navData} logout={logout} />
          <div className={content}></div>

          <Routes>
            <Route path='/' element={<div>Home<div className="card-actions justify-end">
              {!user ? <button onClick={() => navigate('/auth')}>Go to Auth</button> : <><p>Welcome: {userData?.username}</p><button onClick={() => navigate('/user-profile')}>Go to User Profile</button><button onClick={logout}>Logout</button></>}
            </div></div>} />
            <Route path='/user-profile' element={<Authenticated><UserProfile /></Authenticated>} />
            <Route path='/auth' element={<AuthPage />} />
            <Route path='/dashboard' element={<div>Dashboard</div>} />
            <Route path='/exercises' element={<ExercisePage />} />
            <Route path='/search/friends' element={<FriendsPage />} />
            <Route path='/goals' element={<GoalsPage />} />
            <Route path='/' element={<div>Home</div>} />
          </Routes>
        </div>
      </div>

    </>

  )
}

export default App

// TODO: Showcase of friends list with statues
// const users = {
//   adrian: {
//     username: 'adrian',
//     password: 'password',
//     role: 'user',
//     friends: {
//       kjdshkj124hjk1hkjdjh: {
//         status: 'pending'
//       },
//       sdhjk1hkjdjh: {
//         status: 'rejected'
//       },
//       sdhjk1hkjdjh: {
//         status: 'confirmed'
//       }
//     }
//   }
// }