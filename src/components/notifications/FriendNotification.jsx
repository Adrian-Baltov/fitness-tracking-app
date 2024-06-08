import { useUser } from "../../context/UserContext";
import { db } from '../../../firebase/firebase-config.js';
import { ref, update } from "firebase/database";
import { deleteUserFromDifferentRefs } from "../../utils/utils.js";
import { useState } from "react";
import { useHandleAccept } from "../../utils/utils.js";




const FriendNotification = ({ notification }) => {
    const { from, type } = notification;
    const [fromUserData, setFromUserData] = useState(null);
    const handleAccept = useHandleAccept();

   const onAccept = () => {
         handleAccept(from, setFromUserData, fromUserData);
   }


    return (
        <div>
            <li className='p-4'>You have a new friend request from {from} !</li>
             <div className="flex">
                <button className="btn btn-primary" onClick={onAccept}>Accept</button>
                <button className="btn btn-secondary">Decline</button>
             </div>
        </div>
            
       
    )
}

export default FriendNotification;