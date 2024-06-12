import { db } from '../../../firebase/firebase-config.js';
import { ref, update } from "firebase/database";
import { onValue } from "firebase/database";
import { deleteUserFromDifferentRefs } from "../../utils/utils.js";
import { useState } from "react";
import { useEffect } from "react";
import { useUser } from "../../context/UserContext.jsx";
import { useFetcher } from "react-router-dom";
import { useHandleAccept } from "../../utils/utils.js";
import { useHandleDecline } from "../../utils/utils.js";

const FriendNotification = ({ notification }) => {
    const handleAccept = useHandleAccept();
    const handleDecline = useHandleDecline();
    const { from } = notification;
    const [fromUserData, setFromUserData] = useState({});
    
    const onAccept = (from) => {
        handleAccept(from);
    }
    const onDecline = (from) => {
        handleDecline(from);
    }


    return (
        <div>
            <li className='p-4 '>You have a new friend request from {from} !  </li>
            <div className="flex">
                <button className="btn btn-primary mr-2" onClick={() => onAccept(from)}>Accept</button>
                <br />
                <button className="btn btn-secondary ml-4" onClick={() => onDecline(from, setFromUserData, fromUserData)}>Decline</button>
            </div>

        </div>


    )
}

export default FriendNotification;