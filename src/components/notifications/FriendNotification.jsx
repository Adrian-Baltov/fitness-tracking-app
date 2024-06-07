import { useUser } from "../../context/UserContext";
import { db } from '../../../firebase/firebase-config.js';
import { ref, update } from "firebase/database";
import { deleteUserFromDifferentRefs } from "../../utils/utils.js";
import { useState } from "react";




const FriendNotification = ({ notification }) => {
    const { from, type } = notification;
    const { userData, getUserByName, updateUser } = useUser();
    const [fromUserData, setFromUserData] = useState(null);

    
    const handleAccept = async () => {
        const notificationsRef = `users/${userData.username}/notifications`;
        const friendRequestsRef = `users/${userData.username}/friendRequests`;
        const sentRequestsRef = `users/${from}/sentRequests`;
       await deleteUserFromDifferentRefs(notificationsRef, from);
         await deleteUserFromDifferentRefs(friendRequestsRef, from);
            await deleteUserFromDifferentRefs(sentRequestsRef, userData.username);
         await deleteUserFromDifferentRefs(friendRequestsRef, userData.username);


         const currUserUsername = userData.username;
         console.log('username: ', currUserUsername);
       
         getUserByName(from)
          .then((snapshot) => {
            if(snapshot.exists()) {
                const data = snapshot.val();
                setFromUserData(data);
            }

          })
            .catch((error) => {
                console.log('Error getting user data: ', error);
            });
         const fromUserFriends = fromUserData?.friends ? { ...fromUserData.friends, [currUserUsername]: true } : { [currUserUsername]: true };
         const currentUserFriends = userData?.friends ? { ...userData.friends, [from]:true } : { [from]: true};
         updateUser(currUserUsername, { friends: currentUserFriends });
           updateUser(from, { friends: fromUserFriends });
    }



    return (
        <div>
            <li className='p-4'>You have a new friend request from {from} !</li>
             <div className="flex">
                <button className="btn btn-primary" onClick={ handleAccept}>Accept</button>
                <button className="btn btn-secondary">Decline</button>
             </div>
        </div>
            
       
    )
}

export default FriendNotification;