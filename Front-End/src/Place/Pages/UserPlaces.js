import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

import PlaceList from '../Components/PlaceList';
import { useHttpClient } from '../../shared/components/hook/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const Places = () => {
    const userId = useParams().userId;
    const [loadedPlaces, setLoadPlaces] = useState([]);

    const { sendHttpRequest, isLoading, error, clearError } = useHttpClient();

    useEffect(() => {
        const fetchPlaces = async () => {
            try{
                const responseData = await sendHttpRequest( `${process.env.REACT_APP_HTTP_REQUEST_API}/places/user/${userId}`);

                setLoadPlaces(responseData.places || []);
            } catch (err){};
        };
        fetchPlaces()
    },[sendHttpRequest, userId]);

    const onDeletedPlaceHandler = (delPlaceId) => {
        setLoadPlaces(prevPlace => prevPlace.filter( p => p.id !== delPlaceId));
    }

    return(
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className='center'>
                    <LoadingSpinner asOverlay />
                </div>
            )}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={onDeletedPlaceHandler}/>}
        </React.Fragment>
    )
};

export default Places;