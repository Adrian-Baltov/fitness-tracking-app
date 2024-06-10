import { FaBell } from "react-icons/fa";
import { useReducer, useState } from "react";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import { onValue } from "firebase/database";
import { useFetcher } from "react-router-dom";
import { db } from '../../../firebase/firebase-config.js';
import { ref } from "firebase/database";
import FriendNotification from "../friendNotifications/FriendNotification.jsx";


const Notifications = () => {
    const { user, loading, error, register, login, logout } = useAuth();
    const { userData, loading: userLoading, error: userError } = useUser();
    const [expandNotifications, setExpandNotifications] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);


    /**
     * Fetch notifications from the database
     */
    useEffect(() => {
        const notificationsRef = ref(db, `users/${userData?.username}/notifications`)
        const fetchNotifications = (snapshot) => {
            try {

                if (snapshot.exists()) {
                    const notificationsData = snapshot.val();

                    const notificationsList = Object.keys(notificationsData).map(key => ({ ...notificationsData[key] }));
                    setNotifications(notificationsList);
                } else {
                    setNotifications([]);
                }


            } catch (error) {
                console.log('Error fetching notifications: ', error)
            }

        }

        /**
         * Listen for changes to the notifications node in the database
         */
        onValue(notificationsRef, fetchNotifications)



    }, [userData])



    return (
        <div className="relative">
            <button className='' onClick={() => setExpandNotifications(!expandNotifications)}>
                <FaBell />
            </button>

            {expandNotifications && (
                <section className='absolute top-0 right-0 mt-7 bg-white w-64 rounded-lg shadow-lg z-20 p-4'>
                    <h2 className="font-bold text-lg mb-4">Notifications</h2>

                    <ul tabIndex={0} className="dropdown-content z-[500] menu p-2 shadow bg-base-100 rounded-box w-52">
                        {notifications.map((notification) => {
                            if (notification.type === 'friendRequest') {
                                return <FriendNotification notification={notification} key={notification.from} />
                            }

                        })}

                        {notifications.length === 0 && <li className='p-4'>No notifications</li>}
                    </ul>

                </section>
                
            )}

        </div>

    );
}

export default Notifications;