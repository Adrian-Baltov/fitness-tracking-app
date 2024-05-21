import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { ref, get } from "firebase/database";

const UserProfile = () => {
    const user = useUser();
    const { user: authUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [userUsername, setUserUsername] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userFirstName, setUserFirstName] = useState(null);
    const [userLastName, setUserLastName] = useState(null);
    const [userAge, setUserAge] = useState(null);
    const [userGender, setUserGender] = useState(null);
    const [userHeight, setUserHeight] = useState(null);
    const [userWeight, setUserWeight] = useState(null);
    const [isChanged, setIsChanged] = useState(false);

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }

    useEffect(() => {
        const fetchUserData = async (currUser) => {
            const userData = await user.getUserByName(currUser.userData.username);
            if (userData.exists()) {
                setUserData(userData.val());

            }
        }
        fetchUserData(user);
    }
        , [user])

    useEffect(() => {

        if (userData) {

            setUserEmail(userData.email);
            setUserUsername(userData.username);
            setUserFirstName(userData.firstName);
            setUserLastName(userData.lastName);
        }
    }, [userData])



    const handleOnChangeEmail = (e) => {
        setIsChanged(true);
        console.log(e.target.value);
        setUserEmail(e.target.value);
    }


    const handleOnChangeUserName = (e) => {
        setIsChanged(true);
        setUserUsername(e.target.value);
    }

    const handleOnChangeFirstName = (e) => {
        setIsChanged(true);
        setUserFirstName(e.target.value);
    }

    const handleOnChangeUserLastName = (e) => {
        setIsChanged(true);
        setUserLastName(e.target.value);
    }

    const handleSave = () => {

      if(!isValidEmail(userEmail)){
        alert("Invalid email");
        return;
      }


        user.updateUser(user.userData.username, { email: userEmail, username: userUsername, firstName: userFirstName, lastName: userLastName });
        setIsChanged(false);
    }


    if (!authUser || !user.userData) {
        return <div>Loading...</div>; // Or some other placeholder content
    }



    return (
        <div><h1>User Profile</h1>

            <div className=" glass flex justify-center items-center h-screen">
                {authUser.uid === user.userData.uid ?
                    <form action="">
                        <label className="input input-bordered flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                            <input type="text" className="grow" placeholder="Email" value={userEmail} onChange={(e) => handleOnChangeEmail(e)} />

                        </label>
                        <div className="divider divider-neutral"> </div>
                        <label className="input input-bordered flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                            <input type="text" className="grow" placeholder="Username" value={userUsername} onChange={(e) => handleOnChangeUserName(e)}/>

                        </label>
                        <div className="divider divider-neutral"> </div>
                        <label className="input input-bordered flex items-center gap-2">

                            <input type="text" className="grow" placeholder="First Name" value={userFirstName} onChange={(e) => handleOnChangeFirstName(e)}/>

                        </label>
                        <div className="divider divider-neutral"> </div>
                        <label className="input input-bordered flex items-center gap-2">

                            <input type="text" className="grow" placeholder="Last Name" value={userLastName} onChange={(e) => handleOnChangeUserLastName(e)}/>

                        </label>
                        {isChanged && <button className="btn btn-primary bg-transparent border-transparent text-white" onClick={() => handleSave()} >Save</button>}
                    </form>





                    : <h1>You have to log in </h1>}


            </div> </div>
    )
}

export default UserProfile;