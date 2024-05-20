import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../../firebase/firebase-config';

export const getUserByHandle = (username) => {

    return get(ref(db, `users/${username}`));
};

export const createUserHandle = (username, uid, email, firstName, lastName, role = 'basic', isBlocked = false) => {

    return set(ref(db, `users/${username}`), { username, uid, email, firstName, lastName, role, isBlocked, createdOn: new Date() })
};

export const getUserData = (uid) => {

    return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};