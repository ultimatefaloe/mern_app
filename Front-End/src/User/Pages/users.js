import React, { useEffect, useState } from 'react';
  
import UserList from '../components/UserList';
import { useHttpClient } from '../../shared/components/hook/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const Users = () => {
    const {isLoading, error, sendHttpRequest, clearError} = useHttpClient();
    const [loadUsers, setLoadUsers] = useState([]);

    useEffect(()=>{
        const fetchUsers = async () =>{
            try {
                const responseData = await sendHttpRequest(process.env.REACT_APP_HTTP_REQUEST_API + '/users');

                setLoadUsers(responseData.users)
            } catch (err) {}
        };
        fetchUsers()
    },[sendHttpRequest]);
    
    return(
        <div>
            <React.Fragment>
                <ErrorModal error={error} onClear={clearError} />
                {isLoading && (
                    <div className='center'>
                        <LoadingSpinner asOverlay />
                    </div>
                )}
                { !isLoading && loadUsers &&<UserList items={loadUsers}/> }
            </React.Fragment>
        </div>
    );
};

export default Users;