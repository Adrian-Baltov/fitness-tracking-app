import { FaBell } from "react-icons/fa";
import { useState } from "react";
import { useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { onValue } from "firebase/database";
import { db } from '../../../firebase/firebase-config.js';
import { ref } from "firebase/database";
import FriendNotification from "../friendNotifications/FriendNotification.jsx";
import Toast from "../toast/Toast.jsx";




const Notifications = () => {
    const { userData, loading: userLoading, error: userError } = useUser();
    const [expandNotifications, setExpandNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setnotificationCount] = useState(0);
    const [prevNotifications, setPrevNotifications] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);


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

                    const newNotifications = notificationsList.some(newNotification => !prevNotifications.some(oldNotification => oldNotification.from === newNotification.from));
                    if (newNotifications && hasMounted === true && prevNotifications.length <= notificationsList.length) {
                        setShowToast(true);
                    } else {
                        setShowToast(false);
                        setPrevNotifications(notificationsList);
                    }
                    setPrevNotifications(notificationsList)
                    setnotificationCount(notificationsList.length);
                    setNotifications(notificationsList);
                } else {
                    setNotifications([]);
                    setnotificationCount(0);
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

    useEffect(() => {
        setHasMounted(true);
    }, [])

    const handleOnCloseToast = () => {
        setShowToast(false);
    }




    return (
        <div className="relative">
            <button className='mr-2' onClick={() => setExpandNotifications(!expandNotifications)}>
                {notificationCount !== 0 && <span className='absolute top-0 right-0 -mt-2 -mr-0 bg-red-500 text-white rounded-full p-1 text-xs'>{notificationCount}</span>}
                <FaBell />
            </button>

            {showToast && <Toast toastPosition="toast-bottom" message='You have a new notification' onClose={handleOnCloseToast} ></Toast>}


            {expandNotifications && (
                <section className='fixed top-0 right-20 mt-7 bg-gray-700 w-64 rounded-lg shadow-lg z-10 p-4'>
                    <h2 className="font-bold text-lg mb-4">Notifications</h2>

                    <ul  className="p-2 bg-base-100 rounded-box">
                        {notifications.map((notification) => {
                            if (notification.type === 'friendRequest') {
                                return <FriendNotification notification={notification} key={notification.from} />
                            }

                        })}
                        
                        {notifications.length === 0 && <p className='p-4 '>No notifications</p>}
                    </ul>


                </section>

            )}

        </div>

    );
}

export default Notifications;