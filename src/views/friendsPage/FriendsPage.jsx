import SearchAllUsers from '../../components/searchAllUsers/SearchAllUsers.jsx';
import FriendsList from '../../components/friendsList/FriendsList.jsx';
import './friendsPage.css';


const FriendsPage = () => {

    return (
        <div className=" w-full flex justify-center items-center ">
            <div className='border border-white w-1/2 glass flex  h-96 rounded-lg ml-20 mr-40'>
                <div className='m-5 flex-grow overflow-y-auto styled-scrollbar '>
                    <SearchAllUsers />

                </div>

            </div>
            <div className='border border-white  w-1/2 glass flex   h-96 rounded-lg ml-40 mr-20'>
                <div className='m-5 flex-grow overflow-y-auto styled-scrollbar '>
                  <FriendsList/>
                </div>

            </div>

        </div>
    )
}

export default FriendsPage