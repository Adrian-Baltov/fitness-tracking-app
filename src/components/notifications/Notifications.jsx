import { FaBell } from "react-icons/fa";
import { useReducer, useState } from "react";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import { onValue } from "firebase/database";
import { useFetcher } from "react-router-dom";
import { db } from '../../../firebase/firebase-config.js';
import { ref } from "firebase/database";


const Notifications = () => {
    const { user, loading, error, register, login, logout } = useAuth();
    const { userData, loading: userLoading, error: userError } = useUser();
    const [expandNotifications, setExpandNotifications] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
       
                   
                        const notificationsData = userData.notifications;
                           
                        const notificationsList = Object.keys(notificationsData).map(key => ({...notificationsData[key] }));
                        setNotifications(notificationsList);
                        console.log(userData)
                   
              
            } catch (error) {
                console.log('Error fetching notifications: ', error)
            }

        }
        fetchNotifications();

    }, [expandNotifications, userData])



    return (
        <div className="flex flex-col">
            <button onClick={() => setExpandNotifications(!expandNotifications)}>
                <FaBell />
            </button>

            {expandNotifications && (
                <div className='notifications'>
                    <h2>Notifications</h2>
                   
                    <ul tabIndex={0} className="dropdown-content z-[500] menu p-2 shadow bg-base-100 rounded-box w-52">
    {notifications.map((notification) => {
                            return (
                                <div key={notification.from}>
                                    <p>{notification.from} {notification.type}</p>
                                </div>
                            )
                        })}
  </ul>
                        
                    </div>
               
            
            )}

        </div>

    );
}

export default Notifications;