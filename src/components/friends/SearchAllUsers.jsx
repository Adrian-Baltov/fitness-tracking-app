import React, { useState, useEffect } from 'react';
import { getAllUsersArray } from '../../utils/utils.js';
import { onValue } from 'firebase/database';
import UserList from './UserList.jsx';
import { searchAllUsers } from '../../utils/utils.js';
import { useUser } from '../../context/UserContext';


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

       <div className='container'>


         <div className="search-all-users">
        <input
            type="text"
            placeholder="Search all users"
            value={search}
            onChange={handleChange}
        />
        </div>
        
                <UserList users={users}/>
            
       </div>

       
    );
    };

export default SearchAllUsers