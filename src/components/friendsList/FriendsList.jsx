import { useUser } from "../../context/UserContext";
import { onValue, remove } from "firebase/database";
import { db } from '../../../firebase/firebase-config.js';
import { ref } from "firebase/database";
import { useState, useEffect } from "react";
import { searchFriends } from "../../utils/utils";
import { removeFriend } from "../../utils/utils";




const FriendsList = () => {
    const { userData, getUserByName } = useUser();
    const [friends, setFriends] = useState([]);
    const [search, setSearch] = useState('');
    const [allFriends, setAllFriends] = useState([]);
    const [friendsData, setFriendsData] = useState(null);
    const [expandDetailsUsername, setExpandDetailsUsername] = useState('');
    const [expandDetails, setExpandDetails] = useState(false);


    useEffect(() => {
        if (userData) {
            const friendsRef = ref(db, `users/${userData.username}/friends`);

            /**
             * Fetch friends from the database
             * 
             * @param {Object} snapshot 
             */
            const fetchFriends = (snapshot) => {
                try {
                    if (snapshot.exists()) {
                        const friendsData = snapshot.val();
                        const friendsList = Object.keys(friendsData);
            
                       
                        setAllFriends(friendsList);
                        setFriends(friendsList);
                    } else {
                        setFriends([]);
                        setAllFriends([]);
                    }
                } catch (error) {
                    console.log('Error fetching friends: ', error)
                }
            }
                 
            /**
             * Listen for changes to the friends node in the database
             */
            onValue(friendsRef, fetchFriends)
        }
    }, [userData])

   

    const handleChange = (e) => { 
       setSearch(e.target.value);
    }
   
    useEffect(() => {
    if(friends ) {
        const getFriendsData = async () => {
            const friendsDataArray = await Promise.all(
                friends.map(async friend => {
                    const snapshot = await getUserByName(friend);
                    if (snapshot.exists()) {
                        return { username: friend, profilePicUrl: snapshot.val().profilePicUrl, details: {
                            email: snapshot.val().email,
                            friendsLength: friends.length,
                            phone: snapshot.val().phone,
                            firstName: snapshot.val().firstName,
                            lastName: snapshot.val().lastName

                        } };
                    }
                    return null;
                })
            );
            const validFriendsData = friendsDataArray.filter(friend => friend !== null);
            setFriendsData(validFriendsData)
        }
        getFriendsData();
    }
  
    }, [friends])




  useEffect(( ) => {
    const searchResults = async () => {
        const filteredFriends = await searchFriends(search, allFriends, getUserByName); 
        setFriends(filteredFriends);
    }

    searchResults();
  }, [search, allFriends])


 return (
    <div className="flex flex-col justify-center items-center">
        <input className='input input-bordered w-1/2 items-center ' type="text"
        value={search}
        onChange={handleChange}
       placeholder={'Search friends'} />
        <div>
            { friendsData?.length > 0 ? friendsData?.map(friend => (
                <div key={friend.username} className="flex items-center justify-between border-b border-gray-200 p-2">
                    <div className="flex items-center">
                        <img src={`${friend.profilePicUrl}`} alt="profile" className="w-10 h-10 rounded-full" />
                        <p className="ml-2">{friend.username}</p>
                    </div>
                    <button className="bg-blue-500 text-white px-2 py-1 rounded-lg m-11" onClick={() => {setExpandDetails(!expandDetails)
                    setExpandDetailsUsername(friend.username)}}>View details</button>
                    {expandDetails && expandDetailsUsername === friend.username ? <div className="bg-gray-900 border border-white">
                        <div className="m-2">
                           <p>Email: {friend.details.email}</p>
                        <p>Phone: {friend.details.phone}</p>
                        <p>Friends: {friend.details?.friendsLength}</p>
                        <p>First Name: {friend.details.firstName}</p>
                        <p>Last Name: {friend.details.lastName}</p> 
                        </div>
                        
                    </div> : null}
                    <button className="bg-blue-500 text-white px-2 py-1 rounded-lg m-4" onClick={() => removeFriend(userData.username, friend.username)}>Remove friend</button>
                </div>
            )) : <p className="mt-20">No friends yet</p>}
           
        </div>
    </div>
 )
}

export default FriendsList