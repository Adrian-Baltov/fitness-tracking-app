import { useUser } from "../../context/UserContext.jsx";
import { db } from '../../../firebase/firebase-config.js';
import { ref, update } from "firebase/database";
import { deleteUserFromDifferentRefs } from "../../utils/utils.js";
import { useState } from "react";
import { useHandleAccept } from "../../utils/utils.js";
import { useHandleDecline } from "../../utils/utils.js";
import { onValue } from "firebase/database";
import { useEffect} from "react";


const FriendNotification = ({ notification }) => {
    const { from, type } = notification;
    const [fromUserData, setFromUserData] = useState({});
    const handleAccept = useHandleAccept();
    const handleDecline = useHandleDecline();

   const onAccept = (from, setFromUserData, fromUserData) => {
         handleAccept(from, setFromUserData, fromUserData);
   }

   const onDecline = (from, setFromUserData, fromUserData) => {
       handleDecline(from, setFromUserData, fromUserData);
    }


    return (
        <div>
            <li className='p-4 '>You have a new friend request from {from} !  </li>
             <div className="flex">
                <button className="btn btn-primary mr-2" onClick={() =>  onAccept(from, setFromUserData, fromUserData)}>Accept</button>
                <br />
                <button className="btn btn-secondary ml-4"  onClick={() =>  onDecline(from, setFromUserData, fromUserData)}>Decline</button>
             </div>
          
        </div>
            
       
    )
}

export default FriendNotification;