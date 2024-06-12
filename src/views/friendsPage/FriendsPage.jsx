import SearchAllUsers from '../../components/searchAllUsers/SearchAllUsers.jsx';
import './friendsPage.css';

const FriendsPage = () => {

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <div className='border border-white glass flex flex-col h-96 rounded-lg' style={{ width: '600px' }}>
                <div className='m-5 flex-grow overflow-y-auto styled-scrollbar '>
                    <SearchAllUsers />
                </div>
            </div>
        </div>
    )
}

export default FriendsPage