import React, { useState, useEffect } from 'react';
import { getAllUsersArray } from '../../utils/utils.js';
import { onValue } from 'firebase/database';
import UserList from '../friends/UserList.jsx';
import { searchAllUsers } from '../../utils/utils.js';
import { useUser } from '../../context/UserContext.jsx';


const SearchAllUsers = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);


  useEffect(() => {
    const searchResults = async () => {
      const filteredUsers = await searchAllUsers(search);
      setUsers(filteredUsers);

    };
    searchResults();
  }, [search]);


  const handleChange = (e) => {
    setSearch(e.target.value);
    searchAllUsers(e.target.value);
  };


  return (

    <div className='flex flex-col justify-center items-center'>

      <input
        type="text"
        className="input input-bordered  w-1/2 mb-4 "
        placeholder="Search all users"
        value={search}
        onChange={handleChange}
      />

      <UserList users={users} />
    </div>


  );
};

export default SearchAllUsers