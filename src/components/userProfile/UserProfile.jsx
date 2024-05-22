import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { ref, get, set } from "firebase/database";
import backgroundImage from 'C:/Users/PC011010101/Desktop/final-academy-project/fitness-tracking-app/src/assets/Gat_Babi_Manu_06-03-22_22461.jpg';
const UserProfile = () => {
    const user = useUser();
    const { user: authUser } = useAuth();
    const [userData, setUserData] = useState('');
    const [userUsername, setUserUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userFirstName, setUserFirstName] = useState('');
    const [userLastName, setUserLastName] = useState('');
    const [userAge, setUserAge] = useState('');
    const [userGender, setUserGender] = useState('');
    const [userHeight, setUserHeight] = useState('');
    const [userWeight, setUserWeight] = useState('');
    const [isChanged, setIsChanged] = useState(false);
    const [isLoading , setIsLoading] = useState(false);

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }


      /* Function to fetch user data */
    useEffect(() => {
        const fetchUserData = async (currUser) => {
            const userData = await user.getUserByName(currUser.userData?.username);
            if (userData.exists()) {
                setUserData(userData.val());

            }
        }
        fetchUserData(user);
        
    if (!authUser || !user.userData) {
        setIsLoading(true);
     } else {  
         setIsLoading(false);
     }
    }
        , [user])


    /* Function to set the user data to the state */
    useEffect(() => {

        if (userData) {

            setUserEmail(userData.email);
            setUserUsername(userData.username);
            setUserFirstName(userData.firstName);
            setUserLastName(userData.lastName);
        }

    if (!authUser || !user.userData) {
       setIsLoading(true);
    } else {  
        setIsLoading(false);
    }
    }, [userData])


  /*
    * Function to handle the change of the email input
    */
    const handleOnChangeEmail = (e) => {
        setIsChanged(true);
       
        setUserEmail(e.target.value);
    }


     /* Function to handle the change of the username input */
    const handleOnChangeUserName = (e) => {
        setIsChanged(true);
        setUserUsername(e.target.value);
    }


      /* Function to handle the change of the first name input */
    const handleOnChangeFirstName = (e) => {
        setIsChanged(true);
        setUserFirstName(e.target.value);
    }

   
    /* Function to handle the change of the last name input */
    const handleOnChangeUserLastName = (e) => {
        setIsChanged(true);
        setUserLastName(e.target.value);
    }
    
    /* Function to handle the save button */
    const handleSave = () => {

      if(!isValidEmail(userEmail)){
        alert("Invalid email");
        return;
      }


        user.updateUser(user.userData.username, { email: userEmail, username: userUsername, firstName: userFirstName, lastName: userLastName });
        setIsChanged(false);
    }





    return (
        <div  className="flex fixed inset-0 bg-cover bg-center items-center justify-center " 
        style={{ backgroundImage: `url(${backgroundImage})` }} >

          
           
            <div className="flex w-6/12 h-5/6  justify-center items-center" >
         

            <div  className="  glass relative flex justify-center items-center w-full h-5/6">
                {authUser.uid === user.userData?.uid ?
                    <form className="flex flex-col items-center justify-center space-y-4"> <h1>User Profile</h1>            
                        <label className="input input-bordered flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                            <span className="label-text">Email</span>
                            <input type="text" className="grow" placeholder="Email" value={userEmail} onChange={(e) => handleOnChangeEmail(e)} />

                        </label>
                        <div className="divider divider-neutral"> </div>
                        <label className="input input-bordered flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                           
                                <span className="label-text">Username</span>
                            
                            <input type="text" className="grow" placeholder="Username" value={userUsername} onChange={(e) => handleOnChangeUserName(e)}/>

                        </label>
                        <div className="divider divider-neutral"> Personal Information</div>
                        <label className="input input-bordered flex items-center gap-2">
                        <span className="label-text">First Name</span>
                            <input type="text" className="grow" placeholder="First Name" value={userFirstName} onChange={(e) => handleOnChangeFirstName(e)}/>

                        </label>
                        <div className="divider divider-neutral"> </div>
                        <label className="input input-bordered flex items-center gap-2">
                        <span className="label-text">Last Name</span>
                            <input type="text" className="grow" placeholder="Last Name" value={userLastName} onChange={(e) => handleOnChangeUserLastName(e)}/>

                        </label>
                         {isLoading && <> <span className="loading loading-ring loading-xs"></span>
                    <span className="loading loading-ring loading-sm"></span>
                    <span className="loading loading-ring loading-md"></span>
                    <span className="loading loading-ring loading-lg"></span></>}{isChanged && <button className="btn btn-primary bg-transparent border-transparent text-white" onClick={() => handleSave()} >Save</button>}
                    </form>





                    : <>{isLoading && <> <span className="loading loading-ring loading-xs"></span>
                    <span className="loading loading-ring loading-sm"></span>
                    <span className="loading loading-ring loading-md"></span>
                    <span className="loading loading-ring loading-lg"></span></>}</>}
            </div>
       


            </div> 
            </div>
    )
}

export default UserProfile;