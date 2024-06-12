import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage, storageRef } from "../../../firebase/firebase-config";
import { get, set } from "firebase/database";
import { deleteObject } from "firebase/storage";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

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
    const [phoneNumber , setPhoneNumber] = useState('');
    const [isChanged, setIsChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [profilePicUrl, setProfilePicUrl] = useState('');
    const [profilePicUploadProgress, setProfilePicUploadProgress] = useState(0);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);


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
            setProfilePicUrl(userData.profilePicUrl);
            setPhoneNumber(userData.phone);
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

        if (!isValidEmail(userEmail)) {
            alert("Invalid email");
            return;
        }


        user.updateUser(user.userData.username, { email: userEmail, username: userUsername, firstName: userFirstName, lastName: userLastName });
        setIsChanged(false);
    }

    const handleOnChangePhoneNumber = (e) => {
        setIsChanged(true);
        setPhoneNumber(e.target.value);
    }


    const handleUploadProfilePicture = async (e) => {
        e.preventDefault();
        if (file) {
            try {

                setIsUploading(true);

                const storageRef = ref(storage, `profilePictures/${user.userData.username}/profilePicture`);


                try {
                    await deleteObject(storageRef)
                } catch (error) {
                    console.log("Error deleting old profile picture:", error);
                }
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        setProfilePicUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

                    },
                    (error) => {
                        console.log("Error uploading file:", error);
                    },

                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            user.updateUser(user.userData.username, { profilePicUrl: downloadURL });
                            setProfilePicUrl(downloadURL);
                            setIsUploading(false);
                            setProfilePicUploadProgress(0);
                        } catch (error) {
                            console.log("Error getting download URL:", error);
                        }
                    }

                )

            } catch (error) {
                console.error('Error uploading profile picture:', error);

            }
            setFile(null);

        }

    }

    return (
        <div className="flex  justify-center w-screen" >

            <div className="flex w-3/6 h-5/6 justify-center items-center  h-screen" >

                <div className="  glass relative flex justify-center items-center w-full h-5/6 rounded-xl">

                    {authUser.uid === user.userData?.uid ?


                        <form className="flex flex-col items-center justify-center space-y-4 ">
                            <div className="avatar border-2 border-gray-500 rounded-full">
                                <div className="w-40 rounded-full bg-black">
                                    <img src={`${profilePicUrl}`} alt='No file' className="object-cover w-full  rounded-full" />
                                </div>
                            </div>

                            <input type="file" className="file-input file-input-bordered w-full max-w-xs" onChange={((e) => {
                                const file = e.target.files[0];
                                setFile(file);

                                const url = URL.createObjectURL(file);

                                setProfilePicUrl(url);

                            }
                            )} />
                            {file && <span> <button type="submit" className="submit-button" onClick={(e) => handleUploadProfilePicture(e)}>Upload </button></span>}
                            {profilePicUploadProgress && profilePicUploadProgress < 100 ? (
                                <div className="radial-progress" style={{ "--value": profilePicUploadProgress }} role="progressbar">
                                    {`${profilePicUploadProgress.toFixed(0)}%`}
                                </div>
                            ) : null}
                            <h1>User Profile</h1>
                            <label className="input input-bordered flex items-center gap-2 w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                                <span className="label-text">Email</span>
                                <input type="text" className="grow" placeholder="Email" value={userEmail} onChange={(e) => handleOnChangeEmail(e)} />

                            </label>


                            <div className="divider divider-neutral"> </div>
                            <label className="input input-bordered flex items-center gap-2 w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>

                                <span className="label-text">Username</span>

                                <input type="text" className="grow" placeholder="Username" value={userUsername} onChange={(e) => handleOnChangeUserName(e)} />

                            </label>
                            <div className="divider divider-neutral"> Personal Information</div>
                            <label className="input input-bordered flex items-center gap-2 w-full">
                                <span className="label-text">First Name</span>
                                <input type="text" className="grow" placeholder="First Name" value={userFirstName} onChange={(e) => handleOnChangeFirstName(e)} />

                            </label>
                            <div className="divider divider-neutral"> </div>
                            <label className="input input-bordered flex items-center gap-2 w-full">
                                <span className="label-text">Last Name</span>
                                <input type="text" className="grow" placeholder="Last Name" value={userLastName} onChange={(e) => handleOnChangeUserLastName(e)} />

                            </label>
                            <div className="divider divider-neutral"> </div>
                            <label className="input input-bordered flex items-center gap-2 w-full">
                                <span className="label-text">Phone Number</span>
                                <input type="text" className="grow" placeholder="Last Name" value={phoneNumber} onChange={(e) => handleOnChangePhoneNumber(e)} />

                            </label>
                            {isChanged && <button className="btn btn-primary bg-transparent border-transparent text-white" onClick={() => handleSave()} >Save</button>}
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