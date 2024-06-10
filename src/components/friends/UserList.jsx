import React from 'react';
import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { blockAccount, checkIfFriends, deleteAccount, unblockAccount } from '../../utils/utils.js';
import { db } from '../../../firebase/firebase-config';
import { ref } from 'firebase/database';
import { useHandleAccept, useHandleDecline } from '../../utils/utils.js';
import { onValue } from 'firebase/database';
import { useRouteError } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import EmailIcon from '@mui/icons-material/Email';
import { deleteUser } from 'firebase/auth';


const UserList = ({ users }) => {
    const userContext = useUser();
    const currentUser = userContext.userData;
    const [requestsPending, setRequestsPending] = useState(false);
    const [friends, setFriends] = useState({});
    const [friendRequests, setFriendRequests] = useState({});
    const handleAccept = useHandleAccept();
    const handleDecline = useHandleDecline();
    const [fromUserData, setFromUserData] = useState(null);
    const [expandDetailsUserUid, setExpandDetailsUserUid] = useState('');
    const [expandDetails, setExpandDetails] = useState(false);


    /**
     * Check if the user is the current user
     * @param {Object} user 
     * @param {Object} currentUser 
     * @returns 
     */
    const isCurrentUser = (user, currentUser) => {
        if (user.uid === currentUser.uid) {
            return true;
        }
        return false;
    };

    const handleDeleteUser = async (username) => {
        await deleteAccount(username);
    }


    /** 
     * Handle the add friend button click
     * 
     * @param {Object} userToAdd 
     */
    const handleAddFriend = (userToAdd) => {
        const friendRequests = userToAdd.friendRequests ? { ...userToAdd.friendRequests, [currentUser.username]: currentUser.username } : { [currentUser.username]: currentUser.username };
        userContext.updateUser(userToAdd.username, { friendRequests: friendRequests });


        const newNotification = {
            type: 'friendRequest',
            from: currentUser.username
        }
        const notifications = userToAdd.notifications ? { ...userToAdd.notifications, [currentUser.username]: newNotification }
            :
            { [currentUser.username]: newNotification };
        userContext.updateUser(userToAdd.username, { notifications: notifications })


        setRequestsPending((prevState) => {
            return { ...prevState, [userToAdd.uid]: true }; // for immeadiate UI update
        });


        const sentRequests = currentUser.sentRequests || {};

        const newRequest = {
            type: 'friendRequest',
            from: currentUser.username,
            timestamp: Date.now()
        };

        sentRequests[userToAdd.username] = newRequest;
        userContext.updateUser(currentUser.username, { sentRequests: sentRequests });

    }


    /**
     * Update the requestsPending state when the users array changes
     */
    useEffect(() => {
        setRequestsPending(prevState => {
            const pendingRequests = { ...prevState }; // Copy the previous state
            users.forEach(user => {
                if (user.friendRequests && user.friendRequests.hasOwnProperty(currentUser.username)) {
                    pendingRequests[user.uid] = true;
                } else {
                    pendingRequests[user.uid] = false;
                }
            });
            return pendingRequests; // Return the updated state
        });

    }, [users]);


    /**
     * Update the sentRequests state when the currentUser changes
     */
    useEffect(() => {
        const friendReuquestsRef = ref(db, `users/${currentUser?.username}/friendRequests`);
        onValue(friendReuquestsRef, (snapshot) => {
            if (snapshot.exists()) {
                const friendRequests = snapshot.val();
                setFriendRequests(friendRequests);
            } else {
                setFriendRequests({});
            }
        });
    }, [currentUser])


    /**
     * Update the friends state when the currentUser changes
     */
    useEffect(() => {
        const friendsRef = ref(db, `users/${currentUser?.username}/friends`);
        onValue(friendsRef, (snapshot) => {
            if (snapshot.exists()) {
                const friends = snapshot.val();
                setFriends(friends);
            } else {
                setFriends({});
            }
        });
    }, [currentUser])


    /**
     *   Handle the accept button click
     *  
     * @param {string} user 
     * @param {Object} setFromUserData 
     * @param {Object} fromUserData 
     */
    const onAccept = (user, setFromUserData, fromUserData) => {
        handleAccept(user, setFromUserData, fromUserData);
    }


    const onDecline = (user) => {
        handleDecline(user);
    }


    const handleClickDetails = (user) => {
        setExpandDetails(!expandDetails);
        setExpandDetailsUserUid(user.uid);

    }


    return (
        <div className="overflow-x-none">
            <table className="table">
                {/* head */}
                <thead>

                </thead>
                <tbody>

                    {users.map((user) => {
                        let content;
                        let details;

                        if (expandDetailsUserUid === user.uid && expandDetails) {
                            console.log(expandDetailsUserUid)
                            details = <div className=" absolute right-0 p-4 z-[10]   rounded-md  bg-black">
                                <h2>Details</h2>
                                <p><PeopleIcon /> Friends: {Object.values(user.friends || {}).length}</p>
                                <p> <EmailIcon /> Email: {user.email}</p>
                                <p>First Name: {user.firstName}</p>
                                <p>Last Name: {user.lastName}</p>
                            </div>
                        }
                        if (isCurrentUser(user, currentUser)) {

                            content = <span>Current User</span>

                        } else if (requestsPending[user.uid]) {

                            content = <div className="badge badge-accent w-full">Request pending</div>;


                        } else if (checkIfFriends(friends, user)) {
                            content = <span>Friends</span>

                        }

                        else if (friendRequests.hasOwnProperty(user.username)) {
                            content = <span> <button class="btn btn-primary" onClick={() => onAccept(user.username, setFromUserData, fromUserData)}>Accept</button>
                                <button class="btn btn-secondary" onClick={() => onDecline(user.username)}>Decline</button> </span>
                        }

                        else {
                            content = (
                                <label >
                                    <button className="" onClick={() => handleAddFriend(user)} >Add friend</button>

                                </label>
                            );
                        }


                        return <tr key={user.uid}>
                            <th>
                                {content}
                                {details}

                            </th>
                            <td>
                                <div className="flex items-center gap-3">
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            <img src={user.profilePicUrl} alt="Avatar Tailwind CSS Component" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold">{user.username}</div>
                                        <div className="text-sm opacity-50">Bans: {user.isBlocked ? 'Yes' : 'No'}</div>
                                    </div>
                                </div>
                            </td>
                            <th>
                                <button className="btn btn-ghost btn-xs" onClick={() => handleClickDetails(user)}>details</button>
                            </th>
                            <th>

                            </th>
                            {currentUser.role === 'admin' && user.username !== currentUser.username &&
                            <th>
                                <button className="btn btn-ghost btn-xs" onClick={() => handleDeleteUser(user?.username)}>delete</button>
                                 </th>}
                            {currentUser.role === 'admin' && user.username !== currentUser.username &&
                                <th>
                                    {user.isBlocked ? <button className="btn btn-ghost btn-xs" onClick={ () => unblockAccount(user?.username)}>unblock</button> :
                            <button className="btn btn-ghost btn-xs" onClick={ () => blockAccount(user?.username)}>block</button> }
                                </th>
                            }
                        </tr>

                    })}
                </tbody>
                {/* foot */}


            </table>
        </div>
    );
};

export default UserList;