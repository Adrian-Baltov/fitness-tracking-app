import React from 'react';
import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';


const UserList = ({ users }) => {
    const userContext = useUser();
    const currentUser = userContext.userData;
    const [requestsPending, setRequestsPending] = useState(false);
    const [sentRequests, setSentRequests] = useState({});


    const isCurrentUser = (user, currentUser) => {
        if (user.uid === currentUser.uid) {
            return true;
        }
        return false;
    };


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
            return { ...prevState, [userToAdd.username]: true }; // for immeadiate UI update
        });


        const sentRequests = currentUser.sentRequests || {};
        const newRequest = {
            type: 'friendRequest',
            from: currentUser.username,
            timestamp: Date.now()
        };
        sentRequests[userToAdd.username] = newRequest;


        userContext.updateUser(currentUser.username, { sentRequests: sentRequests });
        setSentRequests(sentRequests);
    }

    

   // Update the requestsPending state when the users array changes
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


    useEffect(() => {
      console.log('requestsPending', requestsPending)
      console.log(sentRequests)
    }
    , [requestsPending])


    return (
        <div className="overflow-x-auto">
            <table className="table">
                {/* head */}
                <thead>

                </thead>
                <tbody>

                    {users.map((user) => {
                        let content;
                        if (isCurrentUser(user, currentUser)) {

                            content = <span>Current User</span>

                        } else if (requestsPending[user.uid]) {
                         
                            content = <div className="badge badge-accent w-full">Request pending</div>;

                        } else {
                            content = (
                                <label>
                                    <button className="" onClick={() => handleAddFriend(user)} >Add friend</button>
                                </label>
                            );
                        }

                        return <tr key={user.uid}>
                            <th>
                                {content}
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
                            <td>
                                Wyman-Ledner
                                <br />
                                <span className="badge badge-ghost badge-sm">Community Outreach Specialist</span>
                            </td>
                            <td>Indigo</td>
                            <th>
                                <button className="btn btn-ghost btn-xs">details</button>
                            </th>
                        </tr>

                    })}
                </tbody>
                {/* foot */}


            </table>
        </div>
    );
};

export default UserList;