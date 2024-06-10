import SearchAllUsers from '../../components/searchAllUsers/SearchAllUsers.jsx';
import './friendsPage.css';

const FriendsPage = () => {

    return (
        <div className="container flex justify-start mt-64 mb-64 ">
            <div className='border border-white w-1/2 glass flex flex-col h-96 rounded-lg'>
                  <div className='m-5 flex-grow overflow-y-auto styled-scrollbar '>
            <SearchAllUsers/>
         </div>
            </div>
        </div>
    )
}

export default FriendsPage