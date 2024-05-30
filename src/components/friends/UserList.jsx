import React from 'react';
import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import { FaBox } from 'react-icons/fa';


const UserList = ({ users }) => {
    const userContext = useUser();
    const currentUser = userContext.userData;
    const [requestPending, setRequestPending] = useState(false);


    const isCurrentUser = (user, currentUser) => {
        if (user.uid === currentUser.uid) {
            return true;
        }
        return false;
    };


    const handleAddFriend = (userToAdd) => {
        const friendRequests = userToAdd.friendRequests ? [...userToAdd.friendRequests, currentUser.username] : [currentUser.username];
        userContext.updateUser(userToAdd.username, { friendRequests: friendRequests })

        setRequestPending(prevState => ({
            ...prevState,
            [userToAdd.uid]: true
        }));
    }


    useEffect(() => {
        const pendingRequests = {};
        users.forEach(user => {
            if (user.friendRequests && user.friendRequests.includes(currentUser.username)) {
                pendingRequests[user.uid] = true;
            } else {
                pendingRequests[user.uid] = false;
            }
        });
        setRequestPending(pendingRequests);
    }, [users]);


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
                        } else if (requestPending[user.uid]) {
                            content = <div className="badge badge-accent w-full">Request pending</div>;


                        } else {
                            content = (
                                <label  >
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