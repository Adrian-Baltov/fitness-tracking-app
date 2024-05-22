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



function App() {
  const { fetchExercises, exercises } = useExercise()
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { userData } = useUser();

  return (
    <>

      <Routes>  
      
        <Route path='/' element={<div>Home<div className="card-actions justify-end">
        {!user ? <button onClick={() => navigate('/auth')}>Go to Auth</button> : <><p>Welcome: {userData?.username}</p><button onClick={() => navigate('/user-profile')}>Go to User Profile</button><button onClick={logout}>Logout</button></>}
          </div></div>} /> 
         <Route  path='/user-profile' element={<Authenticated><UserProfile/></Authenticated>} />
         <Route path='/auth' element={<AuthPage />} />
      
      </Routes>
      {/* <div className="card w-96 bg-base-100 shadow-xl">
        <figure><img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
        <div className="card-body">
          <h2 className="card-title">Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={() => fetchExercises()}>Buy Now</button>
          </div>
        </div>
      </div> */}


    </>

  )
}

export default App
