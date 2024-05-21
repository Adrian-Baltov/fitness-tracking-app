import Authenticated from './hoc/Authenticated'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  useExercise,
  useGoal,
} from './context'
import { useAuth } from './context/AuthContext'
import UserProfile from './components/userProfile/UserProfile'
import { useNavigate } from 'react-router-dom'
import { useUser } from './context/UserContext'




function App() {
  const { fetchExercises, exercises } = useExercise()
  const navigate = useNavigate();


  return (
    <>

      <Routes>  
      
        <Route path='/' element={<div>Home<div className="card-actions justify-end">
           
            <button onClick={() => navigate('/user-profile')}>Go to User Profile</button>
          </div></div>} /> 
         <Route  path='/user-profile' element={<UserProfile/>} />
        <Route path='/auth' element={<div>Auth</div>} />
      
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
